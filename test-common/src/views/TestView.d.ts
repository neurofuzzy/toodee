declare namespace Views {
    class TestView implements Models.IView<Simulation.Model> {
        protected model: Simulation.Model;
        protected sectors: Array<PIXI.Graphics>;
        protected sectorsContainer: PIXI.Container;
        protected boundaries: Array<PIXI.Graphics>;
        protected boundariesContainer: PIXI.Container;
        protected bodies: Array<PIXI.Graphics>;
        protected bodiesContainer: PIXI.Container;
        protected projectiles: Array<PIXI.Graphics>;
        protected ray: PIXI.Graphics;
        protected overlay: PIXI.Graphics;
        pixi: PIXI.Application;
        private fps;
        protected built: boolean;
        bodiesGraphics(): Array<any>;
        private colors;
        constructor();
        initWithModel(model: Simulation.Model): any;
        build(): void;
        update(): void;
        onModelEvent(event: Models.IEvent<Simulation.Entity | Simulation.Boundary | Simulation.Projectile | Simulation.Beam>): void;
    }
}
