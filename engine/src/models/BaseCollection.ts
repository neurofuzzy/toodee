// Migrated from namespace Models to ES module
import { Identifiable } from './Identity';
import { EventDispatcher } from './Events';
import { ICollection } from './ICollection';
import { EventType } from './Events';

export class BaseCollection<T extends Identifiable> extends EventDispatcher<T> implements ICollection<T> {
  public items: Map<number, T> = new Map();

  constructor() {
    super();
  }

  public init(): this {
    this.reset();
    return this;
  }

  public reset(): void {
    super.reset();
    this.items.clear();
  }

  public getItemByID(id: number): T | undefined {
    return this.items.get(id);
  }

  public addItem(item: T): boolean {
    if (!this.items.has(item.id)) {
      this.items.set(item.id, item);
      this.dispatch(EventType.Add, item, undefined, item);
      return true;
    }
    return false;
  }

  public removeItem(item: T): boolean {
    if (this.items.delete(item.id)) {
      this.dispatch(EventType.Remove, item, undefined, item);
      return true;
    }
    return false;
  }

  public updateItem(item: T): boolean {
    if (this.items.has(item.id)) {
      this.items.set(item.id, item);
      return true;
    }
    return false;
  }
}

// Export ChildCollection if defined in this file (if not, will migrate separately)