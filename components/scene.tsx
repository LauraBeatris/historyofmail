"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type WheelEvent,
} from "react";
import { Illustration } from "./illustrations";
import { END, MOMENTS, START } from "./moments";
import { PaperPlane } from "./paper-plane";
import { useRulerSound } from "./use-ruler-sound";
import styles from "./scene.module.css";

const TICKS = 96;
const RADIUS = 9;
const BASE = 0.14;
const TILT = 7;

function yearToFraction(year: number) {
  return (year - START) / (END - START);
}

function nearestMoment(fraction: number) {
  const year = START + fraction * (END - START);
  let best = 0;
  for (let i = 1; i < MOMENTS.length; i++) {
    if (Math.abs(MOMENTS[i].year - year) < Math.abs(MOMENTS[best].year - year)) {
      best = i;
    }
  }
  return best;
}

const MOMENT_TICKS = new Set(
  MOMENTS.map((m) => Math.round(yearToFraction(m.year) * (TICKS - 1))),
);

export function Scene() {
  const reduceMotion = useReducedMotion();
  const ruler = useRef<HTMLDivElement>(null);
  const tickRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(1);
  const [scrubbing, setScrubbing] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);
  const sound = useRulerSound();
  const lastTick = useRef(-1);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const planeX = useSpring(cursorX, { stiffness: 500, damping: 40, mass: 0.5 });
  const planeY = useSpring(cursorY, { stiffness: 500, damping: 40, mass: 0.5 });

  const target = useMotionValue(yearToFraction(MOMENTS[1].year));

  const velocity = useMotionValue(0);
  const bank = useSpring(velocity, { stiffness: 120, damping: 14 });
  const bankDeg = useTransform(bank, [-3, 3], [-22, 22], { clamp: true });
  const lift = useTransform(bank, (v) => Math.abs(v) * -6);
  const planeTransform = useMotionTemplate`translate(${planeX}px, ${planeY}px) translate(-50%, -50%) translateY(${lift}px) rotate(${bankDeg}deg)`;

  const lastSample = useRef({ t: 0, x: 0 });

  const layoutTicks = useCallback((fraction: number) => {
    const center = fraction * (TICKS - 1);
    for (let i = 0; i < TICKS; i++) {
      const node = tickRefs.current[i];
      if (!node) continue;
      const d = i - center;
      const inside = Math.abs(d) < RADIUS;
      const bump = inside ? 0.5 * (1 + Math.cos((Math.PI * d) / RADIUS)) : 0;
      const tilt = inside ? (d / RADIUS) * TILT * bump : 0;
      node.style.transform = `scaleY(${BASE + (1 - BASE) * bump}) rotate(${tilt}deg)`;
    }
  }, []);

  useEffect(() => {
    layoutTicks(target.get());
  }, [layoutTicks, target]);

  useMotionValueEvent(target, "change", (fraction) => {
    const now = performance.now();
    const dt = now - lastSample.current.t;
    let speed = 0;
    if (dt > 0) {
      const v = ((fraction - lastSample.current.x) / dt) * 1000;
      speed = Math.abs(v);
      velocity.set(reduceMotion ? 0 : v);
      lastSample.current = { t: now, x: fraction };
    }
    layoutTicks(fraction);
    const index = Math.round(fraction * (TICKS - 1));
    if (index !== lastTick.current) {
      if (lastTick.current >= 0) sound.tick(speed, MOMENT_TICKS.has(index));
      lastTick.current = index;
    }
  });

  useEffect(() => {
    const id = setInterval(() => {
      if (performance.now() - lastSample.current.t > 80) velocity.set(0);
    }, 80);
    return () => clearInterval(id);
  }, [velocity]);

  const goTo = useCallback(
    (fraction: number) => {
      const clamped = Math.min(1, Math.max(0, fraction));
      target.set(clamped);
      setActive(nearestMoment(clamped));
    },
    [target],
  );

  const scrubFromX = useCallback(
    (clientX: number) => {
      const node = ruler.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      goTo((clientX - rect.left) / rect.width);
    },
    [goTo],
  );

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
      if (!cursorVisible) {
        planeX.jump(event.clientX);
        planeY.jump(event.clientY);
        setCursorVisible(true);
      }
    }
    if (event.pointerType === "mouse" || scrubbing) scrubFromX(event.clientX);
  }

  function onPointerLeave() {
    setCursorVisible(false);
    setScrubbing(false);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    sound.unlock();
    if (event.pointerType === "mouse") return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setScrubbing(true);
    scrubFromX(event.clientX);
  }

  function onWheel(event: WheelEvent<HTMLDivElement>) {
    sound.unlock();
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    goTo(target.get() + delta / 1800);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    sound.unlock();
    const next = Math.min(MOMENTS.length - 1, Math.max(0, active + step));
    setActive(next);
    target.set(yearToFraction(MOMENTS[next].year));
  }

  const moment = MOMENTS[active];
  const digits = String(moment.year).split("");

  return (
    <div
      className={styles.scene}
      tabIndex={0}
      role="slider"
      aria-label="History of mail"
      aria-valuemin={START}
      aria-valuemax={MOMENTS[MOMENTS.length - 1].year}
      aria-valuenow={moment.year}
      aria-valuetext={`${moment.year}, ${moment.title}`}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={() => setScrubbing(false)}
      onPointerCancel={() => setScrubbing(false)}
      onPointerLeave={onPointerLeave}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
    >
      <header className={styles.header}>
        <button
          type="button"
          className={styles.soundToggle}
          onClick={sound.toggle}
          aria-pressed={sound.enabled}
        >
          <span className={styles.soundDot} data-on={sound.enabled} />
          sound {sound.enabled ? "on" : "off"}
        </button>
        <a
          className={styles.link}
          href="https://resend.com/products/inboxes?utm_source=historyofmail.org&utm_medium=referral"
          target="_blank"
          rel="noopener"
        >
          inbox for agents
        </a>
      </header>

      <motion.div
        className={`${styles.cursor} ${cursorVisible ? styles.cursorVisible : ""}`}
        style={{ transform: planeTransform }}
      >
        <PaperPlane className={styles.plane} />
      </motion.div>

      <div className={styles.center}>
        <div className={styles.text}>
          <div className={styles.figure}>
            {MOMENTS.map((item, index) => (
              <div
                key={item.year}
                className={styles.figureItem}
                data-state={index === active ? "active" : index < active ? "before" : "after"}
              >
                <Illustration year={item.year} />
              </div>
            ))}
          </div>
          <div className={styles.year}>
            {digits.map((digit, index) => (
              <span key={`${index}-${digit}`} className={styles.digit}>
                {digit}
              </span>
            ))}
          </div>
          <h1 key={moment.title} className={`${styles.title} ${styles.swap}`}>
            {moment.title}
          </h1>
          <p key={moment.year} className={`${styles.blurb} ${styles.swap}`}>
            {moment.blurb}
          </p>
        </div>

        <div className={styles.ruler}>
          <div ref={ruler} className={styles.ticks}>
            {Array.from({ length: TICKS }, (_, i) => (
              <div
                key={i}
                ref={(node) => {
                  tickRefs.current[i] = node;
                }}
                className={`${styles.tick} ${MOMENT_TICKS.has(i) ? styles.tickMoment : ""}`}
              />
            ))}
          </div>
          <div className={styles.labels}>
            <span>{START}</span>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
