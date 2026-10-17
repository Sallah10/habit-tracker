"use client";
import { useState, type ReactNode } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

// A small confirmation dialog for anything destructive or easy to regret
// (logging out, deleting an account). Pass the element that opens it as
// `trigger`; the dialog handles open/close and a busy state.
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  destructive = false,
}: {
  trigger: ReactNode;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  destructive?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleConfirm() {
    try {
      setBusy(true);
      await onConfirm();
      setOpen(false);
    } catch {
      // The caller is responsible for surfacing errors (e.g. a toast).
    } finally {
      setBusy(false);
    }
  }

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-[90] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#33313f] p-6 text-white shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <AlertDialog.Title className="text-lg font-semibold">{title}</AlertDialog.Title>
          {description ? (
            <AlertDialog.Description className="mt-2 text-sm text-gray-300">
              {description}
            </AlertDialog.Description>
          ) : null}
          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <button className="rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-gray-200 transition-colors hover:bg-white/10">
                {cancelLabel}
              </button>
            </AlertDialog.Cancel>
            <button
              onClick={handleConfirm}
              disabled={busy}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${
                destructive
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-brand text-brand-foreground hover:bg-brand-soft"
              }`}
            >
              {busy ? "Working..." : confirmLabel}
            </button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
