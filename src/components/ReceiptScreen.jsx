import React from "react";
import { motion } from "framer-motion";
import { COPY } from "../config.js";

/**
 * @param {{ onBack: () => void, onOpenWhen: () => void }} props
 */
export default function ReceiptScreen({ onBack, onOpenWhen }) {
  return (
    <div className="screen-overlay">
      <motion.div
        className="receipt-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <header className="receipt-header">
          <h2>{COPY.receipt.title}</h2>
          <p>{COPY.receipt.subtitle}</p>
        </header>
        <div className="receipt-items">
          {COPY.receipt.items.map((item) => (
            <div key={item.label} className="receipt-row">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
        <div className="receipt-total">
          <span>{COPY.receipt.totalLabel}</span>
          <span>{COPY.receipt.totalValue}</span>
        </div>
        <p className="receipt-footer">{COPY.receipt.footer}</p>
        <div className="receipt-actions">
          <button className="btn btn-secondary" type="button" onClick={onBack}>
            {COPY.receipt.backLabel}
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={onOpenWhen}
          >
            {COPY.receipt.openWhenLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
