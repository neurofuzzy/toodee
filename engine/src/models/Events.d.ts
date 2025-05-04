export interface Identifiable {
    id: number;
}
export interface ITemporal {
    age: number;
    lifespan: number;
}
export declare enum EventType {
    Add = "add",
    Remove = "remove",
    Update = "update",
    Contact = "contact"
}
export interface IEvent<T extends Identifiable> {
    type: EventType;
    source?: T;
    target?: Identifiable;
    payload: any;
    cancelled: boolean;
    cancel(): void;
}
export type IEventListenerFunc<T extends Identifiable> = (event: IEvent<T>) => void;
export interface IEventDispatcher<T extends Identifiable> {
    init(): any;
    reset(): void;
    addListener(listener: IEventListenerFunc<T>, scope: any): void;
    removeListener(listener: IEventListenerFunc<T>): void;
    dispatchEvent(event: IEvent<T>): void;
    dispatch(type: EventType, source: T, target?: Identifiable, payload?: any): void;
}
export declare class Event<T extends Identifiable> implements IEvent<T> {
    type: EventType;
    source?: T;
    target?: Identifiable;
    payload: any;
    cancelled: boolean;
    constructor(type: EventType, source?: T, target?: Identifiable, payload?: any);
    cancel(): void;
}
export declare class EventDispatcher<T extends Identifiable> implements IEventDispatcher<T> {
    protected listeners: Array<{
        listener: IEventListenerFunc<T>;
        scope: any;
    }>;
    init(): this;
    reset(): void;
    addListener(listener: IEventListenerFunc<T>, scope: any): void;
    removeListener(listener: IEventListenerFunc<T>): void;
    dispatchEvent(event: IEvent<T>): void;
    dispatch(type: EventType, source: T, target?: Identifiable, payload?: any): void;
}
