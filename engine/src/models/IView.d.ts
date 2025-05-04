export interface IView<T> {
    bodiesGraphics(): Array<any>;
    initWithModel(model: T): any;
    build(): void;
    update(): void;
}
