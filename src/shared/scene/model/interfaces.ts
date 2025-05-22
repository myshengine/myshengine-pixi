import { Container } from 'pixi.js';

export interface IScene {
    init(parent: Container): Container;
    destroy(): void;
}
