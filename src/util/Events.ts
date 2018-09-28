namespace Util {

  export enum EventType {
    Change = 1,
    Add,
    Remove,
  }

  export interface IEvent<T> {
    type:number;
    sourceID:number;
    targetID:number;
    payload:T;
  }

  export interface IEventListener {
    onEvent(event:IEvent<any>, context:number);
  }

  export interface IEventDispatcher {
    init();
    reset();
    addListener(listener:IEventListener, context:number);
    removeListenter(listener:IEventListener);
    dispatchEvent(event:IEvent<any>);
    dispatch(type:number, source:Identifiable, target:Identifiable, payload:any);
  }

  export class Event<T> implements IEvent<T> {

    public type:number;
    public sourceID:number;
    public targetID:number;
    public payload:T;

    constructor (type:number, sourceID:number = -1, targetID:number = -1, payload:T) {

      this.type = type;
      this.sourceID = sourceID;
      this.targetID = targetID;
      this.payload = payload;

    }

    public static fromIDs (type:number, source:Identifiable, target:Identifiable = null, payload:any = null) {

      return new Event(
        type, 
        source ? source.id : -1, 
        target ? target.id : -1, 
        payload
      );

    }

  }

  export class EventDispatcher implements IEventDispatcher {

    protected listeners:Array<IEventListener>;
    protected listenerContexts:Array<number>;

    public init () {
      this.reset();
    }

    public reset () {
      this.listeners = [];
      this.listenerContexts = [];
    }

    public addListener(listener:IEventListener, eventContext:number = 0) {

      this.listeners.push(listener);
      this.listenerContexts.push(eventContext);

    }

    public removeListenter(listener:IEventListener) {

      let idx = this.listeners.indexOf(listener);

      if (idx >= 0) {
        this.listeners.splice(idx, 1);
        this.listenerContexts.splice(idx, 1);
      }

    }

    public dispatchEvent(event:IEvent<any>) {

      this.listeners.forEach((listener, idx) => {
        
        let context = this.listenerContexts[idx];
        listener.onEvent(event, context);

      });

    }

    public dispatch(type:number, source:Identifiable, target:Identifiable = null, payload:any = null) {

      let event = Event.fromIDs(type, source, target, payload);
      this.dispatchEvent(event);

    }

  }

}