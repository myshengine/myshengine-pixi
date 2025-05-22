import { ViewBuilder } from '@core/view-builder';
import { IScene } from '@shared/scene';
import { TreeNode } from '@shared/view-builder';
import { Container } from 'pixi.js';

export abstract class Scene implements IScene {
    private _view!: Container;

    constructor(private _viewBuilder: ViewBuilder) {}

    public init(parent: Container): Container {
        this._view = this._viewBuilder.create(this.setup(), parent) as Container;
        return this._view;
    }

    public destroy(): void {
        this._view.destroy({ children: true });
    }

    protected abstract setup(): TreeNode;
}
