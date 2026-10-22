"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "historyofmail:sound";

function readPreference() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

function createNoise(ctx: AudioContext) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

export function useRulerSound() {
  const context = useRef<AudioContext | null>(null);
  const noise = useRef<AudioBuffer | null>(null);
  const [preferred, setPreferred] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const enabled = preferred && unlocked;

  useEffect(() => {
    setPreferred(readPreference());
  }, []);

  const unlock = useCallback(() => {
    if (!context.current) context.current = new AudioContext();
    if (context.current.state === "suspended") {
      void context.current.resume();
    }
    setUnlocked(true);
  }, []);

  const savePreference = useCallback((next: boolean) => {
    setPreferred(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    } catch {}
  }, []);

  const toggle = useCallback(() => {
    if (!unlocked) {
      unlock();
      savePreference(true);
      return;
    }
    savePreference(!preferred);
  }, [preferred, savePreference, unlock, unlocked]);

  const tick = useCallback(
    (strength: number, accent: boolean) => {
      const ctx = context.current;
      if (!enabled || !ctx || ctx.state !== "running") return;
      if (!noise.current) noise.current = createNoise(ctx);
      const now = ctx.currentTime;
      const loud = Math.min(1, 0.35 + strength * 0.5);

      const flip = ctx.createBufferSource();
      flip.buffer = noise.current;
      const band = ctx.createBiquadFilter();
      band.type = "bandpass";
      band.Q.value = 1.4;
      const top = (accent ? 3200 : 2600) * (0.9 + Math.random() * 0.2);
      band.frequency.setValueAtTime(top, now);
      band.frequency.exponentialRampToValueAtTime(top * 0.22, now + 0.05);
      const flipGain = ctx.createGain();
      flipGain.gain.setValueAtTime(0.0001, now);
      flipGain.gain.exponentialRampToValueAtTime(0.18 * loud, now + 0.004);
      flipGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
      flip.connect(band);
      band.connect(flipGain);
      flipGain.connect(ctx.destination);
      flip.start(now);
      flip.stop(now + 0.08);

      const thump = ctx.createOscillator();
      thump.type = "sine";
      thump.frequency.setValueAtTime(accent ? 180 : 140, now);
      thump.frequency.exponentialRampToValueAtTime(60, now + 0.05);
      const thumpGain = ctx.createGain();
      thumpGain.gain.setValueAtTime(0.0001, now);
      thumpGain.gain.exponentialRampToValueAtTime((accent ? 0.16 : 0.06) * loud, now + 0.005);
      thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + (accent ? 0.09 : 0.05));
      thump.connect(thumpGain);
      thumpGain.connect(ctx.destination);
      thump.start(now);
      thump.stop(now + 0.1);
    },
    [enabled],
  );

  return { enabled, unlocked, toggle, unlock, tick };
}
