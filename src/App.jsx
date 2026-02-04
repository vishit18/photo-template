import React, { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import BentoSlideshow from "./components/BentoSlideshow.jsx";
import HeartParticles from "./components/HeartParticles.jsx";
import IntroOverlay from "./components/IntroOverlay.jsx";
import OpenWhenScreen from "./components/OpenWhenScreen.jsx";
import ReceiptScreen from "./components/ReceiptScreen.jsx";
import SequenceCard from "./components/SequenceCard.jsx";
import SuccessScreen from "./components/SuccessScreen.jsx";
import ValentineModal from "./components/ValentineModal.jsx";

import { SITE_CONFIG } from "./config.js";

const randomBetween = (min, max) => min + Math.random() * (max - min);

function App() {
  const shouldReduceMotion = useReducedMotion();
  const [introVisible, setIntroVisible] = useState(true);
  const [screen, setScreen] = useState("homeSequence");
  const [showValentine, setShowValentine] = useState(false);
  const [hearts, setHearts] = useState([]);
  const idRef = useRef(1);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroVisible(false), 1900);
    return () => window.clearTimeout(timer);
  }, []);

  const spawnHearts = useCallback(
    (x, y, options = {}) => {
      if (shouldReduceMotion) return;
      const {
        count = Math.floor(
          randomBetween(
            SITE_CONFIG.hearts.spawn.countMin,
            SITE_CONFIG.hearts.spawn.countMax,
          ),
        ),
        spread = SITE_CONFIG.hearts.spawn.spread,
        sizeMin = SITE_CONFIG.hearts.spawn.sizeMin,
        sizeMax = SITE_CONFIG.hearts.spawn.sizeMax,
      } = options;

      setHearts((prev) => {
        const next = [...prev];
        for (let i = 0; i < count; i += 1) {
          const id = idRef.current++;
          const size = randomBetween(sizeMin, sizeMax);
          const duration = randomBetween(
            SITE_CONFIG.hearts.spawn.durationMin,
            SITE_CONFIG.hearts.spawn.durationMax,
          );
          const drift = randomBetween(-spread, spread);
          const rise = randomBetween(
            SITE_CONFIG.hearts.spawn.riseMin,
            SITE_CONFIG.hearts.spawn.riseMax,
          );
          const rotate = randomBetween(
            SITE_CONFIG.hearts.spawn.rotateMin,
            SITE_CONFIG.hearts.spawn.rotateMax,
          );
          const emoji =
            SITE_CONFIG.hearts.emojis[
              Math.floor(Math.random() * SITE_CONFIG.hearts.emojis.length)
            ];
          next.push({
            id,
            x: x + randomBetween(-SITE_CONFIG.hearts.spawn.offsetX, SITE_CONFIG.hearts.spawn.offsetX),
            y: y + randomBetween(-SITE_CONFIG.hearts.spawn.offsetY, SITE_CONFIG.hearts.spawn.offsetY),
            size,
            duration,
            drift,
            rise,
            rotate,
            emoji,
          });

          window.setTimeout(() => {
            setHearts((current) => current.filter((heart) => heart.id !== id));
          }, duration + 120);
        }
        return next.slice(-SITE_CONFIG.hearts.maxHearts);
      });
    },
    [shouldReduceMotion],
  );

  const handlePointerDown = useCallback(
    (event) => {
      spawnHearts(event.clientX, event.clientY, {});
    },
    [spawnHearts],
  );

  const handleSequenceComplete = useCallback(() => {}, []);

  const handleKeepGoing = useCallback(() => {
    setShowValentine(true);
  }, []);

  const handleYes = useCallback(() => {
    setShowValentine(false);
    setScreen("success");
    spawnHearts(window.innerWidth / 2, window.innerHeight / 2, {
      count: SITE_CONFIG.hearts.burst.count,
      spread: SITE_CONFIG.hearts.burst.spread,
      sizeMin: SITE_CONFIG.hearts.burst.sizeMin,
      sizeMax: SITE_CONFIG.hearts.burst.sizeMax,
    });
  }, [spawnHearts]);

  useEffect(() => {
    const root = document.documentElement;
    const { colors, fonts } = SITE_CONFIG.theme;
    root.style.setProperty("--bg", colors.bg);
    root.style.setProperty("--card", colors.card);
    root.style.setProperty("--card-strong", colors.cardStrong);
    root.style.setProperty("--text", colors.text);
    root.style.setProperty("--muted", colors.muted);
    root.style.setProperty("--accent", colors.accent);
    root.style.setProperty("--accent-strong", colors.accentStrong);
    root.style.setProperty("--outline", colors.outline);
    root.style.setProperty("--glow", colors.glow);
    root.style.setProperty("--overlay-top", colors.overlayTop);
    root.style.setProperty("--overlay-bottom", colors.overlayBottom);
    root.style.setProperty("--bento-start", colors.bentoStart);
    root.style.setProperty("--bento-end", colors.bentoEnd);
    root.style.setProperty("--font-body", fonts.body);
    root.style.setProperty("--font-heading", fonts.heading);
  }, []);

  return (
    <div className="app" onPointerDownCapture={handlePointerDown}>
      <BentoSlideshow
        media={SITE_CONFIG.media}
        tiles={SITE_CONFIG.bento.tiles}
        intervalMs={SITE_CONFIG.animation.slideshowIntervalMs}
        transitionMs={SITE_CONFIG.animation.slideshowTransitionMs}
        videoTileIndexes={SITE_CONFIG.bento.videoTileIndexes}
      />
      <div className="app-overlay" />
      <HeartParticles hearts={hearts} />
      <IntroOverlay isVisible={introVisible} />

      {screen === "homeSequence" ? (
        <main className="app-content">
          {!introVisible ? (
            <SequenceCard
              onComplete={handleSequenceComplete}
              onContinue={handleKeepGoing}
            />
          ) : null}
          <ValentineModal
            isOpen={showValentine && !introVisible}
            onYes={handleYes}
          />
        </main>
      ) : null}

      {screen === "success" ? (
        <SuccessScreen
          onReceipt={() => setScreen("receipt")}
          onOpenWhen={() => setScreen("openWhen")}
        />
      ) : null}

      {screen === "receipt" ? (
        <ReceiptScreen
          onBack={() => setScreen("success")}
          onOpenWhen={() => setScreen("openWhen")}
        />
      ) : null}

      {screen === "openWhen" ? (
        <OpenWhenScreen onBack={() => setScreen("success")} />
      ) : null}
    </div>
  );
}

export default App;
