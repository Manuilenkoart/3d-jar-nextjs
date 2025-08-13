export enum ANIMATIONS {
  dance,
  idle,
}

export const COOKIE_KEYS = {
  jarId: 'jarId',
};

export const LOCAL_STORAGE_KEYS = {
  fontColor: 'font-color',
  bcColor: 'background-color',
  bcColorIsTransparent: 'background-color-is-transparent',
  isShowText: 'is-show-text',
  avatarAnimationDuration: 'avatar-animation-duration',
  hasAvatarShadow: 'has-avatar-shadow',
};

export const SEARCH_PARAMS = {
  isShowText: 'is-show-text',
  isTranparent: 'is-background-transparent',
  bcColor: 'background-color',
  fontColor: 'font-color',
  animationDuration: 'animation-duration',
  hasAvatarShadow: 'has-avatar-shadow',
  utmContent: 'utm_content',
  progressBar: {
    isShow: 'progress-bar-is-show',
    isFixAmount: 'progress-bar-is-fix-amount',
    fixAmount: 'progress-bar-fix-amount',
  },
};

export const UTM = {
  content: {
    isWidgetMode: 'widget',
  },
};

export const RE_FETCH_INTERVAL = process.env.NEXT_PUBLIC_RE_FETCH_INTERVAL
  ? +process.env.NEXT_PUBLIC_RE_FETCH_INTERVAL
  : 30; // Minimum API timeout is 15 seconds

export const ANIMATION_DURATION_CONFIGURATION = {
  min: 10,
  max: RE_FETCH_INTERVAL - 1,
};

export const IS_MOCK_FETCH =
  process.env.NEXT_PUBLIC_IS_MOCK_FETCH === undefined ? false : JSON.parse(process.env.NEXT_PUBLIC_IS_MOCK_FETCH);
