export type CategoryGroup = ReadonlyArray<{
  readonly group: string;
  readonly mainItem?: number;
  readonly items: ReadonlyArray<number>;
}>;

export interface Category {
  _id: string;
  label: string;
  value: number;
  group: string;
  mainItem?: number;
  createdAt?: string;
  updatedAt?: string;
}
