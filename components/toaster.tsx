"use client";
import { Toaster as SonnerToaster } from "sonner";

// One toast surface for the whole app. Styled to match the dark panels.
export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      position="bottom-center"
      closeButton
      toastOptions={{
        style: {
          background: "#33313f",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: "#ffffff",
        },
      }}
    />
  );
}
