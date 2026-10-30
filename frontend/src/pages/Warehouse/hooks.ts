import { useCallback, useState } from "react";

export interface ToastState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info";
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    severity: "success",
  });

  const notify = useCallback(
    (message: string, severity: ToastState["severity"] = "success") =>
      setToast({ open: true, message, severity }),
    [],
  );

  const close = useCallback(
    () => setToast((t) => ({ ...t, open: false })),
    [],
  );

  return { toast, notify, close };
}

/** Keeps the "pending confirmation" state of a row action in one place. */
export function useConfirm<T>() {
  const [pending, setPending] = useState<T | null>(null);
  return { pending, ask: setPending, clear: () => setPending(null) };
}
