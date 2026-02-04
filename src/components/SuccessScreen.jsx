import React from "react";
import { motion } from "framer-motion";
import { COPY } from "../config.js";

/**
 * @param {{ onReceipt: () => void, onOpenWhen: () => void }} props
 */
export default function SuccessScreen({ onReceipt, onOpenWhen }) {
  return (
    <div className="success-overlay" role="status" aria-live="polite">
      <motion.div
        className="success-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="success-emoji">😍</div>
        <h2>{COPY.success.title}</h2>
        <p>{COPY.success.subtitle}</p>
        <div className="success-actions">
          <button className="btn btn-primary" type="button" onClick={onReceipt}>
            {COPY.success.receiptLabel}
          </button>
          <button className="btn btn-secondary" type="button" onClick={onOpenWhen}>
            {COPY.success.openWhenLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
