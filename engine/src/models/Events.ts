namespace Models {

  export enum EventType {
    Change = 1,
    Add,
    Remove,
  }

  export interface IEvent<T extends Identifiable> {
    type:number;
    source:T;
    target:Identifiable;
    payload:any;
    cancelled:boolean;
    cancel():void;
  }

  export interface IEventListenerFunc<T extends Identifiable> {
    (event:IEvent<T>):void;
  }

  export interface IEventDispatcher<T extends Identifiable> {
    init():any;
    reset():void;
    addListener(listener:IEventListenerFunc<T>, scope:any):void;
    removeListener(listener:IEventListenerFunc<T>):void;
    dispatchEvent(event:IEvent<T>):void;
    dispatch(type:number, source:T, target?:Identifiable, payload?:any):void;
  }

  export class Event<T extends Identifiable> implements IEvent<T> {

    public type:number;
    public source:T;
    public target:Identifiable;
    public payload:any;
    public cancelled:boolean;

    constructor (type:number, source:T = null, target:Identifiable = null, payload:any) {

      this.type = type;
      this.source = source;
      this.target = target;
      this.payload = payload;

    }

    cancel ():void {
      this.cancelled = true;
    }

  }

  export class EventDispatcher<T extends Identifiable> implements IEventDispatcher<T> {
    
    protected listeners:Array<IEventListenerFunc<T>>;
    protected listenerScopes:Array<any>;

    public init () {
      this.reset();
      return this;
    }

    public reset () {
      this.listeners = [];
      this.listenerScopes = [];
    }

    public addListener(listener:IEventListenerFunc<T>, scope:any):void {

      this.listeners.push(listener);
      this.listenerScopes.push(scope);

    }

    public removeListener(listener:IEventListenerFunc<T>):void {

      let idx = this.listeners.indexOf(listener);

      if (idx >= 0) {
        this.listeners.splice(idx, 1);
        this.listenerScopes.splice(idx, 1);
      }

    }

    public dispatchEvent(event:IEvent<any>) {

      this.listeners.forEach((listener, idx) => {

        if (event.cancelled) {
          return;
        }
        
        let scope = this.listenerScopes[idx];
        listener.call(scope, event);

      });

    }

    public dispatch(type:number, source:Identifiable, target?:Identifiable, payload?:any) {

      this.dispatchEvent(new Event(type, source, target, payload));

    }

  }

}