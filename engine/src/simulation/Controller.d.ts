import { SpatialGrid } from '../geom/SpatialGrid';
import { PolygonGrid } from '../geom/PolygonGrid';
import { SpatialPolygonMap } from '../geom/SpatialPolygonMap';
import { BodyBodyContact, BodyBoundaryContact, BodySegmentBodyContact } from '../physics/Contact';
import { API } from './API';
import { EventDispatcher } from '../models/Events';
import { Model } from './Model';
export declare enum EventContext {
    Simulation = 1,
    Boundary = 2
}
export declare const MAXVEL: number;
export declare class Controller {
    protected model: Model;
    protected bodyGrid: SpatialGrid<any>;
    protected boundaryGrid: PolygonGrid<any>;
    protected bodyBoundaryMap: SpatialPolygonMap<any, any>;
    protected bodyBodyContacts: Array<BodyBodyContact>;
    protected bodyBodyContactIndices: Array<boolean>;
    protected bodyBoundaryContacts: Array<BodyBoundaryContact>;
    protected bodySegmentContactIndices: Array<boolean>;
    protected bodyBeamContacts: Array<BodySegmentBodyContact>;
    protected bodyBeamContactIndices: Array<boolean>;
    protected forces: Array<any>;
    protected dispatcher: EventDispatcher<any>;
    protected _api: API<any, any>;
    get api(): API<any, any>;
    initWithModel(model: Model): this;
    reset(): void;
    protected build(): void;
    start(): void;
    private getBodyBodyContacts;
    private getBodyBoundaryContacts;
    private alignBeam;
    private getBodyBeamContacts;
    private applyPointAsForce;
    private applyForces;
    private applyVelocities;
    update: (secondPass?: boolean) => void;
    stop(): void;
}
