import { Layers } from "@core/layers";
import { ViewBuilder } from "@core/view-builder";
import { ILayerOptions } from "@shared/layers";
import { IScene, SceneType } from "@shared/scene";
import { TreeNode } from "@shared/view-builder";
import { Application, Container } from "pixi.js";

export class SceneController {

    private _currentScene: IScene | undefined;

    constructor(
        private _pixi: Application,
        private _viewBuilder: ViewBuilder,
        private _layers: Layers,
    ) {}

    public setScene<T extends IScene>(scene: SceneType<T>): void {
        const root = this._pixi.stage.getChildByName('Scene') as Container;
        if (!root) return;

        this._currentScene?.destroy();
        const sceneInstance = new scene(this._viewBuilder);
        sceneInstance.init(root);

        this._currentScene = sceneInstance;
        this._layers.sortAll();
    }

    public addLayer(layer: ILayerOptions): void {
        this._layers.createGroups(layer.name, layer.order || 0, layer.sortable || false);
    }

    public setShared(config: TreeNode): void {
        const shared = this._pixi.stage.getChildByName('Shared') as Container;
        shared.removeChildren();
        this._viewBuilder.create(config, shared);
    }

    public removeFromShared(name: string): void {
        const shared = this._pixi.stage.getChildByName('Shared') as Container;
        const childToRemove = shared.getChildByName(name, true);
        childToRemove && childToRemove.destroy({ children: true });
    }
    
}