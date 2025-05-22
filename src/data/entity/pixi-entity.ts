import { Entity } from 'myshengine-core';
import { Container } from 'pixi.js';

export class PixiEntity extends Entity {
    public get active(): boolean {
        const container = this.getComponent(Container);
        return container.visible;
    }

    public set active(value: boolean) {
        const container = this.getComponent(Container);
        container.visible = value;
    }
}
