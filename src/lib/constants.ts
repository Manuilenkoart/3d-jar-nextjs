export enum ANIMATIONS {
  dance,
  idle,
}

export const COOKIE_KEYS = {
  jarId: "jarId",
};

export const LOCAL_STORAGE_KEYS = {
  fontColor: "font-color",
  bcColor: "background-color",
  bcColorIsTransparent: "background-color-is-transparent",
  avatarAnimationDuration: "avatar-animation-duration",
};

export const RE_FETCH_INTERVAL =
  process.env.NEXT_PUBLIC_RE_FETCH_INTERVAL &&
  +process.env.NEXT_PUBLIC_RE_FETCH_INTERVAL >= 15
    ? +process.env.NEXT_PUBLIC_RE_FETCH_INTERVAL
    : 15; // Minimum API timeout is 15 seconds

export const ANIMATION_DURATION_CONFIGURATION = {
  min: 10,
  max: RE_FETCH_INTERVAL - 1,
};

export const IS_MOCK_FETCH = true;
