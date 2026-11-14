/**
 * TerraForge v2 FINAL — Persistent config & treasury
 * Self-managed settings; fees route to operator wallet
 */

const STORAGE_KEY = "terraforge_v2_config";

const DEFAULTS = {
  version: "2.0.0-final",
  treasuryWallet: "",
  displayName: "Operator",
  feeBps: {
    claim: 10000,
    mint: 10000,
    upgrade: 5000,
    market: 250,
    seal: 10000,
    module: 10000,
  },
  economy: {
    claimCost: 40,
    mintCost: 25,
    upgradeCost: 55,
    maintainBase: 2.5,
    yieldBase: 1.8,
    decayRate: 0.002,
    energyRegen: 0.15,
    eventChance: 0.008,
    maxOwnedSoft: 50,
  },
  features: {
    autoEvents: true,
    selfCorrect: true,
    selfExpand: true,
    marketplace: true,
    chronicles: true,
    modules: true,
  },
  theme: {
    neonIntensity: 1,
    autoRotate: true,
  },
  cloud: {
    mode: "local",
    region: "auto",
  },
};

export function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULTS);
    const parsed = JSON.parse(raw);
    return deepMerge(structuredClone(DEFAULTS), parsed);
  } catch {
    return structuredClone(DEFAULTS);
  }
}

export function saveConfig(cfg) {
  const toSave = { ...cfg, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  return toSave;
}

export function resetConfig() {
  localStorage.removeItem(STORAGE_KEY);
  return structuredClone(DEFAULTS);
}

function deepMerge(base, over) {
  for (const k of Object.keys(over || {})) {
    if (
      over[k] &&
      typeof over[k] === "object" &&
      !Array.isArray(over[k]) &&
      base[k] &&
      typeof base[k] === "object"
    ) {
      deepMerge(base[k], over[k]);
    } else if (over[k] !== undefined) {
      base[k] = over[k];
    }
  }
  return base;
}

export { DEFAULTS };
