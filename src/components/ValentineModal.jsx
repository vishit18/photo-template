import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { COPY } from "../config.js";

/**
 * @param {{ isOpen: boolean, onYes: () => void }} props
 */
export default function ValentineModal({ isOpen, onYes }) {
  const [noClickCount, setNoClickCount] = useState(0);

  if (!isOpen) return null;

  const message =
    noClickCount === 0
      ? null
      : COPY.valentine.noMessages[
          (noClickCount - 1) % COPY.valentine.noMessages.length
        ];

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <motion.div
        className="modal-card"
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        <h2 className="modal-title">{COPY.valentine.title}</h2>
        <div className="modal-actions">
          <button
            className="btn btn-primary"
            type="button"
            onClick={onYes}
          >
            {COPY.valentine.yesLabel}
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => setNoClickCount((prev) => prev + 1)}
          >
            {COPY.valentine.noLabel}
          </button>
        </div>
        <div className="modal-message" aria-live="polite">
          <AnimatePresence mode="wait">
            {message ? (
              <motion.p
                key={message}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                {message}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
