import { Group, Stage } from '@pixi/layers';
import { Container } from 'pixi.js';

export interface ILayerOptions {
    name: string;
    order?: number;
    sortable?: boolean;
}

export interface ILayers {
    setStage(stage: Stage): void;
    createGroups(name: string, order: number, sortable: boolean): void;
    getGroup(name: string): Group | undefined;
    setLayer(name: string, node: Container): void;
    setOrder(node: Container, zOrder: number): void;
    sort(name: string): void;
    sortAll(): void;
}
