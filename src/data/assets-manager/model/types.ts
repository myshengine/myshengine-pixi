import { DisplayObject } from 'pixi.js';

export type PixiType<T extends DisplayObject> = new (...args: any[]) => T;
