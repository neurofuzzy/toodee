import { Identifiable } from './Identity';
import { EventDispatcher } from './Events';
import { ICollection } from './ICollection';
export declare class BaseCollection<T extends Identifiable> extends EventDispatcher<T> implements ICollection<T> {
    items: Map<number, T>;
    constructor();
    init(): this;
    reset(): void;
    getItemByID(id: number): T | undefined;
    addItem(item: T): boolean;
    removeItem(item: T): boolean;
    updateItem(item: T): boolean;
}
