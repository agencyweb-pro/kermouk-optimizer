const STORE_KEY = "kermouk-tweaks-state";

function getAllStates(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function getTweakState(id: string): boolean {
  return getAllStates()[id] === true;
}

export function setTweakState(id: string, value: boolean): void {
  const states = getAllStates();
  states[id] = value;
  localStorage.setItem(STORE_KEY, JSON.stringify(states));
}

export function setBulkTweakStates(ids: string[], value: boolean): void {
  const states = getAllStates();
  for (const id of ids) {
    states[id] = value;
  }
  localStorage.setItem(STORE_KEY, JSON.stringify(states));
}

export function getActiveTweaksCount(): number {
  const states = getAllStates();
  return Object.values(states).filter(Boolean).length;
}

export function resetAllTweaks(): void {
  localStorage.removeItem(STORE_KEY);
}
