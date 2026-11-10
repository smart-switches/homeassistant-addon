package logstore

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

var fixedNow = time.Date(2025, 1, 2, 3, 4, 5, 0, time.UTC)

func newTestStore(t *testing.T, max int) *Store {
	t.Helper()

	s := New(filepath.Join(t.TempDir(), "logs"), max)
	s.now = func() time.Time { return fixedNow }

	return s
}

func entry(seq, uptime int64, msg string) Entry {
	return Entry{Seq: seq, UptimeMs: uptime, Level: "info", Message: msg}
}

func TestAppendAndList(t *testing.T) {
	s := newTestStore(t, 10)

	n, err := s.Append("kitchen", 10_000, []Entry{entry(1, 9_000, "a"), entry(2, 10_000, "b")})
	if err != nil {
		t.Fatal(err)
	}
	if n != 2 {
		t.Fatalf("expected 2 accepted, got %d", n)
	}

	got, err := s.List("kitchen")
	if err != nil {
		t.Fatal(err)
	}
	if len(got) != 2 || got[0].Message != "a" || got[1].Message != "b" {
		t.Fatalf("unexpected entries: %+v", got)
	}
}

func TestListUnknownSwitchIsEmpty(t *testing.T) {
	s := newTestStore(t, 10)

	got, err := s.List("nobody")
	if err != nil {
		t.Fatal(err)
	}
	if len(got) != 0 {
		t.Fatalf("expected no entries, got %+v", got)
	}
}

func TestAppendIgnoresDuplicates(t *testing.T) {
	s := newTestStore(t, 10)
	batch := []Entry{entry(1, 100, "a"), entry(2, 200, "b")}

	if _, err := s.Append("kitchen", 300, batch); err != nil {
		t.Fatal(err)
	}

	// Resend with one new entry
	n, err := s.Append("kitchen", 400, append(batch, entry(3, 350, "c")))
	if err != nil {
		t.Fatal(err)
	}
	if n != 1 {
		t.Fatalf("expected 1 accepted, got %d", n)
	}

	got, _ := s.List("kitchen")
	if len(got) != 3 {
		t.Fatalf("expected 3 entries, got %d", len(got))
	}
}

func TestAppendDuplicatesWithinBatch(t *testing.T) {
	s := newTestStore(t, 10)

	n, err := s.Append("kitchen", 300, []Entry{entry(1, 100, "a"), entry(1, 100, "a")})
	if err != nil {
		t.Fatal(err)
	}
	if n != 1 {
		t.Fatalf("expected 1 accepted, got %d", n)
	}
}

// If a device loses its log file its seq restarts, which must not cause its
// new entries to be mistaken for old ones.
func TestAppendAcceptsReusedSeqWithDifferentContent(t *testing.T) {
	s := newTestStore(t, 10)

	if _, err := s.Append("kitchen", 300, []Entry{entry(1, 100, "old")}); err != nil {
		t.Fatal(err)
	}

	n, err := s.Append("kitchen", 50, []Entry{entry(1, 20, "new")})
	if err != nil {
		t.Fatal(err)
	}
	if n != 1 {
		t.Fatalf("expected 1 accepted, got %d", n)
	}
}

func TestAppendTrimsToMaxEntries(t *testing.T) {
	s := newTestStore(t, 3)

	var batch []Entry
	for i := int64(1); i <= 5; i++ {
		batch = append(batch, entry(i, i*10, "line"))
	}

	n, err := s.Append("kitchen", 100, batch)
	if err != nil {
		t.Fatal(err)
	}
	if n != 5 {
		t.Fatalf("expected 5 accepted, got %d", n)
	}

	got, _ := s.List("kitchen")
	if len(got) != 3 || got[0].Seq != 3 || got[2].Seq != 5 {
		t.Fatalf("expected seqs 3..5, got %+v", got)
	}
}

func TestSwitchesAreIsolated(t *testing.T) {
	s := newTestStore(t, 10)

	s.Append("kitchen", 100, []Entry{entry(1, 10, "kitchen line")})
	s.Append("bedroom", 100, []Entry{entry(1, 10, "bedroom line")})

	got, _ := s.List("kitchen")
	if len(got) != 1 || got[0].Message != "kitchen line" {
		t.Fatalf("unexpected entries: %+v", got)
	}
}

func TestTimeEstimatedFromUptime(t *testing.T) {
	s := newTestStore(t, 10)

	s.Append("kitchen", 10_000, []Entry{entry(1, 7_000, "three seconds ago")})

	got, _ := s.List("kitchen")
	want := fixedNow.Add(-3 * time.Second)
	if !got[0].Time.Equal(want) {
		t.Fatalf("expected %v, got %v", want, got[0].Time)
	}
}

// An entry with an uptime beyond the device's current one must predate a
// reboot, so the time of receipt is the best available estimate.
func TestTimeFallsBackToReceiptForPreRebootEntries(t *testing.T) {
	s := newTestStore(t, 10)

	s.Append("kitchen", 1_000, []Entry{entry(9, 500_000, "before reboot")})

	got, _ := s.List("kitchen")
	if !got[0].Time.Equal(fixedNow) {
		t.Fatalf("expected %v, got %v", fixedNow, got[0].Time)
	}
}

func TestHostileSwitchNamesStayInsideDirectory(t *testing.T) {
	s := newTestStore(t, 10)

	names := []string{"../../etc/passwd", "..", ".", "a/b", "", strings.Repeat("x", 100)}
	for _, name := range names {
		if _, err := s.Append(name, 100, []Entry{entry(1, 10, "x")}); err != nil {
			t.Fatalf("append %q: %v", name, err)
		}

		got, err := s.List(name)
		if err != nil || len(got) != 1 {
			t.Fatalf("list %q: %v %+v", name, err, got)
		}
	}

	files, err := os.ReadDir(s.dir)
	if err != nil {
		t.Fatal(err)
	}
	if len(files) != len(names) {
		t.Fatalf("expected %d files in the logs dir, got %d", len(names), len(files))
	}

	parent, _ := os.ReadDir(filepath.Dir(s.dir))
	if len(parent) != 1 {
		t.Fatalf("files leaked outside the logs dir: %v", parent)
	}
}

func TestReadSkipsDamagedLines(t *testing.T) {
	s := newTestStore(t, 10)

	s.Append("kitchen", 100, []Entry{entry(1, 10, "good")})

	f, err := os.OpenFile(s.path("kitchen"), os.O_APPEND|os.O_WRONLY, 0)
	if err != nil {
		t.Fatal(err)
	}
	f.WriteString("{\"seq\":2,\"t\":\n")
	f.Close()

	got, err := s.List("kitchen")
	if err != nil {
		t.Fatal(err)
	}
	if len(got) != 1 || got[0].Message != "good" {
		t.Fatalf("unexpected entries: %+v", got)
	}
}

func TestNoTempFilesLeftBehind(t *testing.T) {
	s := newTestStore(t, 10)

	s.Append("kitchen", 100, []Entry{entry(1, 10, "x")})

	files, _ := os.ReadDir(s.dir)
	for _, f := range files {
		if strings.HasSuffix(f.Name(), ".tmp") {
			t.Fatalf("leftover temp file %s", f.Name())
		}
	}
}
