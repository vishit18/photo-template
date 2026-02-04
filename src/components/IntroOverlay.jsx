import React from "react";
import { motion } from "framer-motion";
import { COPY } from "../config.js";

/**
 * @param {{ isVisible: boolean }} props
 */
export default function IntroOverlay({ isVisible }) {
  if (!isVisible) return null;

  return (
    <div className="intro-overlay" role="status" aria-live="polite">
      <motion.div
        className="intro-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="intro-heart">💛</div>
        <p className="intro-text">{COPY.introText}</p>
      </motion.div>
      <div className="intro-ambient" aria-hidden="true" />
      <div className="intro-hearts" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, index) => (
          <span key={index}>💛</span>
        ))}
      </div>
    </div>
  );
}
