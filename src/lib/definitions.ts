export type TJar = {
  description: string;
  jarGoal: number;
  jarAmount: number;
  name: string;
  extJarId?: string;
  errCode?: string;
};

export type Avatar = 'mouse' | 'sorceress';
export type SceneEnvironment =
  | 'apartment'
  | 'city'
  | 'dawn'
  | 'forest'
  | 'lobby'
  | 'night'
  | 'park'
  | 'studio'
  | 'sunset'
  | 'warehouse';
