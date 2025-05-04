import { Model } from './simulation/Model';
import { Controller } from './simulation/Controller';
import { API } from './simulation/API';
import { Boundary } from './simulation/Boundary';
import { Entity } from './simulation/Entity';
import { IEvent } from './models/Events';
import { Projectile } from './simulation/Projectile';

export class Engine {

  public model: Model;
  public simulation: Controller;

  public init ():Engine {

    this.model = new Model().init();
    this.simulation = new Controller().initWithModel(this.model);

    return this;

  }

  public start ():void {

    this.simulation.start();

  }

  public update ():void {

    this.simulation.update();

  }

  public stop ():void {

    this.simulation.stop();

  }

  get api ():API<Boundary, Entity> {

    return this.simulation.api;
    
  }

}

export interface IEngineDelegate {

  init(engine:Engine):any;
  start():void;
  update():void;
  stop():void;
  pause():void;
  resume():void;
  onModelEvent(event:IEvent<Entity | Boundary | Projectile>):void;
  onContactEvent(event:IEvent<any>):void;
  onBoundaryCrossEvent(event:IEvent<any>):void;

}
