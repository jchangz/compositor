interface SpringConfig {
  mass: number;
  tension: number;
  friction: number;
}

export interface DrawClipPathData {
  path: Array<number>;
  config?: SpringConfig;
  immediate?: boolean;
}
