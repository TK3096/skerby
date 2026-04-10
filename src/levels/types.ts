export type TileType =
  | "floorUp"
  | "floorDown"
  | "floorLeft"
  | "floorRight"
  | "floorTopLeft"
  | "floorTopRight"
  | "floorDownLeft"
  | "floorDownRight"
  | "floorInside";

export type EnemyPatrolType = "horizontal" | "vertical";

export type ItemType = "donut" | "health" | "poison";

export interface BlockData {
  x: number;
  y: number;
  tile: TileType;
}

export interface EnemyData {
  x: number;
  y: number;
  patrol: EnemyPatrolType;
  boundStart: number;
  boundEnd: number;
}

export interface CoinData {
  x: number;
  y: number;
}

export interface ItemData {
  x: number;
  y: number;
  type: ItemType;
}

export interface WarpGateData {
  x: number;
  y: number;
  kind: "start" | "exit";
}

export interface HintData {
  x: number;
  y: number;
  image: string;
}

export interface LevelData {
  name: string;
  worldWidth: number;
  worldHeight: number;
  blocks: BlockData[];
  enemies: EnemyData[];
  coins: CoinData[];
  items: ItemData[];
  warpGates: WarpGateData[];
  hints: HintData[];
}
