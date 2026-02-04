import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const DEFAULT_TILES = [
  { id: "hero", className: "bento-tile tile-hero" },
  { id: "tall", className: "bento-tile tile-tall" },
  { id: "wide", className: "bento-tile tile-wide" },
  { id: "small-1", className: "bento-tile tile-small" },
  { id: "small-2", className: "bento-tile tile-small" },
  { id: "small-3", className: "bento-tile tile-small" },
];

/**
 * @param {{
 *   media: { type: "image" | "video", src: string, alt?: string }[],
 *   tiles?: { id: string, className: string }[],
 *   intervalMs?: number,
 *   transitionMs?: number,
 *   videoTileIndexes?: number[]
 * }} props
 */
export default function BentoSlideshow({
  media = [],
  tiles = DEFAULT_TILES,
  intervalMs = 3200,
  transitionMs = 5000,
  videoTileIndexes = [1, 5],
}) {
  const shouldReduceMotion = useReducedMotion();
  const [broken, setBroken] = useState({});
  const [indices, setIndices] = useState(() =>
    tiles.map((_, index) => index),
  );
  const [modes, setModes] = useState(() =>
    tiles.map((_, index) => (index % 2 === 0 ? "image" : "video")),
  );

  const mediaList = useMemo(() => media.filter(Boolean), [media]);
  const imageItems = useMemo(
    () => mediaList.filter((item) => item.type === "image"),
    [mediaList],
  );
  const videoItems = useMemo(
    () => mediaList.filter((item) => item.type === "video"),
    [mediaList],
  );

  useEffect(() => {
    if (!mediaList.length) return;
    setModes(
      tiles.map((_, index) => {
        if (videoItems.length === 0) return "image";
        if (imageItems.length === 0) return "video";
        const availableVideoSlots = Math.min(
          videoTileIndexes.length,
          videoItems.length,
          videoTileIndexes.length,
        );
        const videoSlots = videoTileIndexes.slice(0, availableVideoSlots);
        return videoSlots.includes(index) ? "video" : "image";
      }),
    );
    setIndices(tiles.map((_, index) => index));
  }, [imageItems.length, mediaList.length, tiles, videoItems.length, videoTileIndexes]);

  useEffect(() => {
    if (shouldReduceMotion || mediaList.length === 0) return undefined;
    const interval = window.setInterval(() => {
      setIndices((prev) =>
        prev.map((currentIndex, tileIndex) => {
          if (modes[tileIndex] !== "image") return currentIndex;
          if (!imageItems.length) return currentIndex;
          return (currentIndex + 1) % imageItems.length;
        }),
      );
    }, intervalMs);
    return () => window.clearInterval(interval);
  }, [imageItems.length, mediaList.length, modes, shouldReduceMotion, intervalMs]);

  return (
    <div className="bento-slideshow" aria-hidden="true">
      <div className="bento-grid">
        {tiles.map((tile, index) => {
          const mode = modes[index];
          let pool = mode === "video" ? videoItems : imageItems;
          if (!pool.length) {
            pool = mode === "video" ? imageItems : videoItems;
          }
          const poolIndex = pool.length ? indices[index] % pool.length : -1;
          const currentRaw = poolIndex >= 0 ? pool[poolIndex] : null;
          const current =
            currentRaw && !broken[currentRaw.src] ? currentRaw : null;
          const mediaKey = current?.src || `placeholder-${tile.id}`;

          return (
            <div key={tile.id} className={tile.className}>
              <AnimatePresence mode="sync" initial={false}>
                <motion.div
                  key={mediaKey}
                  className="bento-media"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: transitionMs / 1000, ease: "easeInOut" }}
                >
                  {current ? (
                    current.type === "video" ? (
                      <video
                        className="bento-video"
                        src={current.src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        onError={() =>
                          setBroken((prev) => ({
                            ...prev,
                            [current.src]: true,
                          }))
                        }
                      />
                    ) : (
                      <img
                        className="bento-image"
                        src={current.src}
                        alt={current.alt || "Memory"}
                        loading="lazy"
                        onError={() =>
                          setBroken((prev) => ({
                            ...prev,
                            [current.src]: true,
                          }))
                        }
                      />
                    )
                  ) : (
                    <div className="bento-placeholder">
                      <span>Add media</span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="bento-glow" />
            </div>
          );
        })}
      </div>
      <div className="bento-overlay" />
    </div>
  );
}
