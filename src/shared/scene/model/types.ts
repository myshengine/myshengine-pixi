import { IScene } from './interfaces';

export type SceneType<T extends IScene> = new (...args: any[]) => T;
