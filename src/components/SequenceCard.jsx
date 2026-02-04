import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { COPY } from "../config.js";

/**
 * @param {{ onComplete: () => void, steps?: string[] }} props
 */
export default function SequenceCard({ onComplete, onContinue, steps }) {
  const shouldReduceMotion = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(1);
  const completedRef = useRef(false);
  const [completed, setCompleted] = useState(false);

  const items = useMemo(() => steps || COPY.sequenceLines, [steps]);

  useEffect(() => {
    if (shouldReduceMotion) {
      setVisibleCount(items.length);
      if (!completedRef.current) {
        completedRef.current = true;
        setCompleted(true);
        onComplete();
      }
      return undefined;
    }

    const interval = window.setInterval(() => {
      setVisibleCount((prev) => {
        const next = Math.min(prev + 1, items.length);
        if (next === items.length && !completedRef.current) {
          completedRef.current = true;
          setCompleted(true);
          window.clearInterval(interval);
          window.setTimeout(onComplete, 700);
        }
        return next;
      });
    }, 900);

    return () => window.clearInterval(interval);
  }, [items.length, onComplete, shouldReduceMotion]);

  return (
    <motion.div
      className="sequence-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="sequence-content">
        {items.map((line, index) => {
          const isVisible = index < visibleCount;
          return (
            <motion.p
              key={line}
              className="sequence-line"
              initial={{ opacity: 0, y: 12 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.5 }}
              aria-hidden={!isVisible}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: line.replace(
                    /\*\*(.*?)\*\*/g,
                    "<strong>$1</strong>",
                  ),
                }}
              />
            </motion.p>
          );
        })}
      </div>
      <div className="sequence-dots" aria-hidden="true">
        {items.map((_, index) => (
          <span
            key={index}
            className={`sequence-dot ${index < visibleCount ? "active" : ""}`}
          />
        ))}
      </div>
      {completed ? (
        <button
          className="btn btn-primary sequence-cta"
          type="button"
          onClick={onContinue}
        >
          {COPY.keepGoingLabel}
        </button>
      ) : null}
    </motion.div>
  );
}
