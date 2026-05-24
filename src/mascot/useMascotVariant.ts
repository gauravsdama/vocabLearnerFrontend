import { useState } from "react";
import { MASCOT_VARIANTS, type MascotVariant } from "./catalog";

const STORAGE_KEY = "vocabcat_mascot_variant";

function isMascotVariant(value: string): value is MascotVariant {
  return MASCOT_VARIANTS.some((variant) => variant === value);
}

function readStoredMascotVariant() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value && isMascotVariant(value) ? value : null;
  } catch {
    return null;
  }
}

function writeMascotVariant(variant: MascotVariant) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, variant);
  } catch {
    // ignore storage failures
  }
}

function chooseRandomMascotVariant() {
  const nextIndex = Math.floor(Math.random() * MASCOT_VARIANTS.length);
  return MASCOT_VARIANTS[nextIndex];
}

function getOrCreateMascotVariant() {
  const storedVariant = readStoredMascotVariant();
  if (storedVariant) {
    return storedVariant;
  }

  const nextVariant = chooseRandomMascotVariant();
  writeMascotVariant(nextVariant);
  return nextVariant;
}

export function useMascotVariant(explicitVariant?: MascotVariant) {
  const [storedVariant] = useState<MascotVariant>(
    () => explicitVariant ?? getOrCreateMascotVariant(),
  );

  return explicitVariant ?? storedVariant;
}
