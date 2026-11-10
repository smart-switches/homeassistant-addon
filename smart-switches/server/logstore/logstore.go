// Package logstore persists log entries reported by switch firmware.
//
// Each switch gets its own JSON Lines file under the logs directory, holding
// only the most recent entries.
package logstore

import (
	"bufio"
	"bytes"
	"encoding/hex"
	"encoding/json"
	"errors"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/lucaspopp0/ha-smart-switches/smart-switches/util"
)

const (
	envLogsDir     = "LOGS_DIR"
	defaultLogsDir = "/data/logs"

	// DefaultMaxEntries is how many entries are kept per switch.
	DefaultMaxEntries = 500
)

// Entry is a single log line as reported by a device.
type Entry struct {
	// Seq is the device's monotonic counter for the entry.
	Seq int64 `json:"seq"`
	// UptimeMs is the device's uptime when the entry was logged.
	UptimeMs int64 `json:"t"`
	// Level is "info", "warn" or "error".
	Level string `json:"lvl"`
	// Message is the log text.
	Message string `json:"msg"`
	// Time is the estimated wall-clock time the entry was logged.
	Time time.Time `json:"time"`
}

// DefaultDir returns the directory logs are stored in.
func DefaultDir() string {
	return util.GetEnv(envLogsDir, defaultLogsDir)
}

type Store struct {
	dir        string
	maxEntries int
	now        func() time.Time

	mu sync.Mutex
}

func New(dir string, maxEntries int) *Store {
	return &Store{
		dir:        dir,
		maxEntries: maxEntries,
		now:        time.Now,
	}
}

// Append records entries reported by a switch and returns how many were new.
//
// Devices resend entries they haven't had acknowledged, for example after a
// reboot, so an entry that was already stored (same seq, uptime, level and
// message) is ignored. uptimeMs is the device's uptime at the moment of
// reporting, and is used to estimate when each entry was logged.
func (s *Store) Append(switchName string, uptimeMs int64, entries []Entry) (int, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	existing, err := s.read(switchName)
	if err != nil {
		return 0, err
	}

	seen := make(map[entryKey]struct{}, len(existing))
	for _, e := range existing {
		seen[keyOf(e)] = struct{}{}
	}

	received := s.now().UTC()
	accepted := 0

	for _, e := range entries {
		k := keyOf(e)
		if _, dup := seen[k]; dup {
			continue
		}

		seen[k] = struct{}{}
		e.Time = estimateTime(received, uptimeMs, e.UptimeMs)
		existing = append(existing, e)
		accepted++
	}

	if accepted == 0 {
		return 0, nil
	}

	if len(existing) > s.maxEntries {
		existing = existing[len(existing)-s.maxEntries:]
	}

	return accepted, s.write(switchName, existing)
}

// List returns the stored entries for a switch, oldest first.
func (s *Store) List(switchName string) ([]Entry, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	return s.read(switchName)
}

type entryKey struct {
	seq      int64
	uptimeMs int64
	level    string
	message  string
}

func keyOf(e Entry) entryKey {
	return entryKey{seq: e.Seq, uptimeMs: e.UptimeMs, level: e.Level, message: e.Message}
}

// estimateTime converts a device uptime to wall-clock time, given the uptime
// the device reported at the time of receipt. An entry whose uptime is ahead
// of the reported one must be from before a reboot, so its real time can't be
// derived and the time of receipt is used instead.
func estimateTime(received time.Time, reportedUptimeMs, entryUptimeMs int64) time.Time {
	if entryUptimeMs > reportedUptimeMs {
		return received
	}

	return received.Add(-time.Duration(reportedUptimeMs-entryUptimeMs) * time.Millisecond)
}

// path returns the file for a switch. The name comes from the device, so it is
// hex encoded rather than used directly to keep it from escaping the directory.
func (s *Store) path(switchName string) string {
	return filepath.Join(s.dir, hex.EncodeToString([]byte(switchName))+".jsonl")
}

func (s *Store) read(switchName string) ([]Entry, error) {
	data, err := os.ReadFile(s.path(switchName))
	if errors.Is(err, os.ErrNotExist) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	var entries []Entry

	scanner := bufio.NewScanner(bytes.NewReader(data))
	scanner.Buffer(nil, 1<<20)
	for scanner.Scan() {
		var e Entry
		if err := json.Unmarshal(scanner.Bytes(), &e); err != nil {
			// Skip lines damaged by an interrupted write
			continue
		}

		entries = append(entries, e)
	}

	return entries, scanner.Err()
}

// write replaces the switch's file atomically, so a crash mid-write can't
// leave it truncated.
func (s *Store) write(switchName string, entries []Entry) error {
	if err := os.MkdirAll(s.dir, 0o755); err != nil {
		return err
	}

	var buf bytes.Buffer
	enc := json.NewEncoder(&buf)
	for _, e := range entries {
		if err := enc.Encode(e); err != nil {
			return err
		}
	}

	tmp, err := os.CreateTemp(s.dir, "logs-*.tmp")
	if err != nil {
		return err
	}

	if _, err := tmp.Write(buf.Bytes()); err != nil {
		tmp.Close()
		os.Remove(tmp.Name())
		return err
	}

	if err := tmp.Close(); err != nil {
		os.Remove(tmp.Name())
		return err
	}

	if err := os.Chmod(tmp.Name(), 0o644); err != nil {
		os.Remove(tmp.Name())
		return err
	}

	if err := os.Rename(tmp.Name(), s.path(switchName)); err != nil {
		os.Remove(tmp.Name())
		return err
	}

	return nil
}
