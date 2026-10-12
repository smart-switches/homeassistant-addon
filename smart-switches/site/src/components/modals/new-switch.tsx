import React from "react"
import { Config } from "../../api";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { z } from "zod";
import { AutoForm } from "uniforms-mui";
import ZodBridge from "uniforms-bridge-zod";
import { useSnackbar } from "../snackbar";

// Define the schema using zod
const switchSchema = z.object({
  name: z.string()
    .min(1, "Switch name is required")
    .max(50, "Name must be 50 characters or less")
});

// Create the bridge using the simplified zod helper
const bridge = new ZodBridge({ schema: switchSchema });

export type NewSwitchModalProps = {
  show?: boolean,
  onShow?: () => void,
  onHide?: () => void,
  onConfirm?: (remoteName: string) => Promise<Config>,
}

const NewSwitchModal: React.FC<NewSwitchModalProps> = (props) => {
  const formRef = React.useRef<any>(null);
  const snackbar = useSnackbar();

  const onShow = props.onShow ?? (() => {});
  const onHide = props.onHide ?? (() => {});

  const handleSubmit = async (model: { name: string }) => {
    const onConfirm = props.onConfirm ?? (async (_: string) => {});

    try {
      await onConfirm(model.name);
      onHide();
    } catch (error) {
      snackbar.show(`Failed to add switch: ${String(error)}`, "error");
    }
  };

  return (
    <Dialog
      open={!!props.show}
      onClose={onHide}
      fullWidth
      maxWidth="xs"
      slotProps={{
        transition: {
          onEntered: onShow,
        },
      }}
    >
      <DialogTitle>Add Switch</DialogTitle>
      <DialogContent>
        <AutoForm
          ref={formRef}
          schema={bridge}
          onSubmit={handleSubmit}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            if (formRef.current) {
              formRef.current.submit();
            }
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewSwitchModal;
