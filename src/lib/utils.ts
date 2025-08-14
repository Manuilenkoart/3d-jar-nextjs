'use client';

export const write = (key: string, value: unknown) => {
  try {
    if (typeof window === 'undefined') return false;

    if (!key || typeof key !== 'string') {
      throw new Error('Invalid storage key');
    }

    const serializedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

    window.localStorage.setItem(key, serializedValue);
    return true;
  } catch (error: unknown) {
    console.error('LocalStorage write error:', error instanceof Error ? error.message : String(error));
    return false;
  }
};

export const read = (key: string, defaultValue = null) => {
  try {
    if (typeof window === 'undefined') return defaultValue;

    const item = window.localStorage.getItem(key);
    if (item === null) return defaultValue;

    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (error: unknown) {
    console.error('LocalStorage read error:', error instanceof Error ? error.message : String(error));
    return defaultValue;
  }
};

export const debounce = (fn: Function, delay = 300) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: unknown[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export const getCookie = (cname: string): string => {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');

  for (const cookiePart of cookieArray) {
    const c = cookiePart.trim();
    if (c.startsWith(name)) {
      return c.substring(name.length);
    }
  }

  return '';
};

export const setCookie = (cname: string, cvalue: string, exdays = 365) => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
};

export const getWindowLocationOrigin = () => {
  if (typeof window === 'undefined') return '';

  return window.location.origin;
};
