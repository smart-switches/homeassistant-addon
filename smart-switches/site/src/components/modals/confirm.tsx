import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import React from "react"

export type ConfirmProps = {
    body: React.ReactNode,
    title: string,
    open: boolean,
    onOk: () => Promise<void>,
    onCancel: () => void,
    okText?: string,
    okColor?: 'primary' | 'error',
}

const ConfirmModal: React.FC<ConfirmProps> = props => {
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        if (!props.open) {
            setLoading(false)
        }
    }, [props.open])

    const onOk = async () => {
        setLoading(true)

        try {
            await props.onOk()
        } catch(e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog
            open={props.open}
            onClose={loading ? undefined : props.onCancel}
        >
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                {props.body}
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color={props.okColor ?? 'primary'}
                    loading={loading}
                    onClick={onOk}
                >
                    {props.okText ?? 'OK'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmModal;
