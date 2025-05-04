import { Identifiable, IChild } from './Identity';
import { EventDispatcher } from './Events';
import { ICollection } from './ICollection';
export declare class ChildCollection<T extends Identifiable & IChild> extends EventDispatcher<T> implements ICollection<T> {
    items: Map<number, T>;
    protected itemsByParentID: Map<number, T[]>;
    constructor();
    init(): this;
    reset(): void;
    getItemByParentID(parentID: number): T | null;
    getItemsByParentID(parentID: number): T[] | null;
    addItem(item: T): boolean;
    removeItem(item: T): boolean;
    updateItem(item: T): boolean;
}
