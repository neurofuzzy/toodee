// Migrated from namespace Models to ES module

export interface Identifiable {
  id: number;
}

export interface ITemporal {
  age: number;
  lifespan: number;
}

export enum EventType {
  Add = 'add',
  Remove = 'remove',
  Update = 'update',
  Contact = 'contact',
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

export class Event<T extends Identifiable> implements IEvent<T> {
  public type: EventType;
  public source?: T;
  public target?: Identifiable;
  public payload: any;
  public cancelled!: boolean;

  constructor(type: EventType, source?: T, target?: Identifiable, payload?: any) {

    this.type = type;
    this.source = source;
    this.target = target;
    this.payload = payload;
    this.cancelled = false;

  }

  cancel(): void {
    this.cancelled = true;
  }

}

export class EventDispatcher<T extends Identifiable> implements IEventDispatcher<T> {
  
  protected listeners!: Array<{ listener: IEventListenerFunc<T>; scope: any }>;

  public init() {
    this.reset();
    return this;
  }

  public reset() {
    this.listeners = [];
  }

  public addListener(listener: IEventListenerFunc<T>, scope: any): void {

    this.listeners.push({ listener, scope });

  }

  public removeListener(listener: IEventListenerFunc<T>): void {

    this.listeners = this.listeners.filter(l => l.listener !== listener);

  }

  public dispatchEvent(event: IEvent<T>) {

    for (const { listener, scope } of this.listeners) {
      if (event.cancelled) {
        return;
      }
      listener.call(scope, event);
    }

  }

  public dispatch(type: EventType, source: T, target?: Identifiable, payload?: any) {

    this.dispatchEvent(new Event(type, source, target, payload));

  }

}