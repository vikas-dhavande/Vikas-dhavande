"use client";

import React, { useState } from "react";
import {
  ModalOverlay,
  Modal,
  Dialog,
} from "react-aria-components";
import { setCookiePreferenceAction } from "@/app/actions";
import LoginForm from "@/components/shadcn-space/blocks/login-01/login";

interface AuthModalProps {
  /** The button / element that opens the modal. Must be a single React element. */
  trigger: React.ReactNode;
  /** Called after successful login/signup with the user's display name. */
  onAuthSuccess?: (userName: string) => void;
}

export function AuthModal({ trigger, onAuthSuccess }: AuthModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        className="inline-flex cursor-pointer"
      >
        {trigger}
      </div>

      <ModalOverlay
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        isDismissable
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm data-entering:animate-in data-entering:fade-in-0 data-exiting:animate-out data-exiting:fade-out-0 duration-200"
      >
        <Modal className="w-full max-w-lg outline-none data-entering:animate-in data-entering:fade-in-0 data-entering:zoom-in-95 data-exiting:animate-out data-exiting:fade-out-0 data-exiting:zoom-out-95 duration-200">
          <Dialog className="outline-none">
            {({ close }) => (
              <LoginForm
                onClose={() => {
                  close();
                  setIsOpen(false);
                }}
                onSuccess={(userName: string) => {
                  // 1. Cache avatar seed in localStorage for instant client reads
                  try {
                    localStorage.setItem("avatar_seed", userName);
                  } catch {}

                  // 2. Persist to cookie for SSR (deferred to avoid render-cycle conflict)
                  setTimeout(() => {
                    setCookiePreferenceAction("avatar_seed", userName).catch(() => {});
                  }, 0);

                  // 3. Notify parent to refresh navbar user state
                  onAuthSuccess?.(userName);

                  // 4. Close the modal
                  close();
                  setIsOpen(false);
                }}
              />
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </>
  );
}
