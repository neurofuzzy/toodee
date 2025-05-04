export interface IController {
    start(): void;
    update(): void;
    stop(): void;
}
export interface IModelController<M> extends IController {
    initWithModel(model: M): any;
}
export interface IModelViewController<M, V> extends IController {
    initWithModelAndView(model: M, view: V): any;
}
export interface IEngineDelegate {
    init(engine: any): any;
    build(): void;
    start(): void;
    update(): void;
    stop(): void;
    pause(): void;
    resume(): void;
    onModelEvent(event: any): void;
    onContactEvent(event: any): void;
    onBoundaryCrossEvent(event: any): void;
}
