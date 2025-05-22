import { Group, Layer, Stage } from '@pixi/layers';
import { ILayers } from '@shared/layers';
import { Container } from 'pixi.js';

export class Layers implements ILayers {
    private _groups: Map<string, Group> = new Map();
    private _layers: Map<string, Layer> = new Map();
    private _stage: Stage | undefined;

    public setStage(stage: Stage): void {
        this._stage = stage;
    }

    public createGroups(name: string, order: number, sortable: boolean): void {
        const group = new Group(order, sortable);
        const layer = new Layer(group);

        layer.name = name;

        this._groups.set(name, group);
        this._layers.set(name, layer);

        this._stage?.addChild(layer);
    }

    public getGroup(name: string): Group | undefined {
        return this._groups.get(name);
    }

    public setLayer(name: string, node: Container): void {
        const group = this._groups.get(name);
        if (group) {
            node.parentGroup = group;
            this.sort(name);
        }
    }

    public setOrder(node: Container, zOrder: number): void {
        node.zOrder = zOrder;
    }

    public sort(name: string): void {
        this._stage?.sortChildren();
        this._stage?.updateStage();

        const layer = this._layers.get(name);
        layer && layer.sortChildren();
    }

    public sortAll(): void {
        this._stage?.sortChildren();
        this._stage?.updateStage();

        Array.from(this._layers.values()).forEach((layer) => {
            layer.sortChildren();
        });
    }
}
