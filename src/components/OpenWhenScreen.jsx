import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { COPY } from "../config.js";

/**
 * @param {{ onBack: () => void }} props
 */
export default function OpenWhenScreen({ onBack }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const activeNote = useMemo(() => {
    if (activeIndex === null) return null;
    return COPY.openWhen.items[activeIndex];
  }, [activeIndex]);

  return (
    <div className="screen-overlay">
      <motion.div
        className="open-when-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <header className="open-when-header">
          <h2>{COPY.openWhen.title}</h2>
          <p>{COPY.openWhen.subtitle}</p>
        </header>
        <div className="open-when-grid">
          {COPY.openWhen.items.map((item, index) => (
            <button
              key={item.label}
              className="open-when-item"
              type="button"
              onClick={() => setActiveIndex(index)}
            >
              <span className="envelope">✉️</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <div className="open-when-actions">
          <button className="btn btn-secondary" type="button" onClick={onBack}>
            {COPY.openWhen.backLabel}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {activeNote ? (
          <motion.div
            className="modal-backdrop"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-card"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="modal-title">{activeNote.label}</h3>
              <p className="modal-note">{activeNote.note}</p>
              <button className="btn btn-secondary" type="button">
                {COPY.openWhen.voiceNoteLabel}
              </button>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => setActiveIndex(null)}
              >
                {COPY.openWhen.closeLabel}
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
