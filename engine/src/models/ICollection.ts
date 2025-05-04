// Migrated from namespace Models to ES module
import { Identifiable } from './Identity';

export interface ICollection<T extends Identifiable> {
  items: Map<number, T>;
  init(): this;
  reset(): void;
  addItem(item: T): boolean;
  removeItem(item: T): boolean;
  updateItem(item: T): boolean;
}