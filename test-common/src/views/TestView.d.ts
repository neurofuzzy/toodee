import { Application, Container, Graphics } from 'pixi.js';
import { IView, IEvent } from '../../../engine/src/models';
import { Model, Entity, Boundary, Projectile, Beam } from '../../../engine/src/simulation';
export declare class TestView implements IView<Model> {
    protected model: Model;
    protected sectors: Array<Graphics>;
    protected sectorsContainer: Container;
    protected boundaries: Array<Graphics>;
    protected boundariesContainer: Container;
    protected bodies: Array<Graphics>;
    protected bodiesContainer: Container;
    protected projectiles: Array<Graphics>;
    protected ray: Graphics;
    protected overlay: Graphics;
    pixi: Application;
    private fps;
    protected built: boolean;
    bodiesGraphics(): Array<any>;
    private colors;
    constructor();
    initWithModel(model: Model): any;
    build(): void;
    update(): void;
    onModelEvent(event: IEvent<Entity | Boundary | Projectile | Beam>): void;
}
