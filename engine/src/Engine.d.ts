import { Model } from './simulation/Model';
import { Controller } from './simulation/Controller';
import { API } from './simulation/API';
import { Boundary } from './simulation/Boundary';
import { Entity } from './simulation/Entity';
import { IEvent } from './models/Events';
import { Projectile } from './simulation/Projectile';
export declare class Engine {
    model: Model;
    simulation: Controller;
    init(): Engine;
    start(): void;
    update(): void;
    stop(): void;
    get api(): API<Boundary, Entity>;
}
export interface IEngineDelegate {
    init(engine: Engine): any;
    start(): void;
    update(): void;
    stop(): void;
    pause(): void;
    resume(): void;
    onModelEvent(event: IEvent<Entity | Boundary | Projectile>): void;
    onContactEvent(event: IEvent<any>): void;
    onBoundaryCrossEvent(event: IEvent<any>): void;
}
