import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'nutriplan:autoDeductPantry';
const EVENT_NAME = 'nutriplan:autoDeductPantryChanged';

export function getAutoDeductPantrySetting(): boolean {
  if (typeof window === 'undefined') return true;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw == null) return true; // default: enabled
    const parsed = JSON.parse(raw) as unknown;
    return typeof parsed === 'boolean' ? parsed : true;
  } catch {
    return true;
  }
}

export function setAutoDeductPantrySetting(enabled: boolean) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(enabled));
  } catch {
    // ignore write errors
  }
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function useAutoPantryDeductSetting() {
  const [enabled, setEnabledState] = useState<boolean>(() =>
    getAutoDeductPantrySetting(),
  );

  const setEnabled = useCallback((next: boolean) => {
    setEnabledState(next);
    setAutoDeductPantrySetting(next);
  }, []);

  useEffect(() => {
    const sync = () => setEnabledState(getAutoDeductPantrySetting());

    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) sync();
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener(EVENT_NAME, sync);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(EVENT_NAME, sync);
    };
  }, []);

  return { enabled, setEnabled };
}
