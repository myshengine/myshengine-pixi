import { BitmapText, Container, NineSlicePlane, Sprite, Text } from 'pixi.js';
import { AssetStatus, IAssetsManager } from '@shared/assets-manager';
import { IBuilderBehaviour, IViewBuilder, TreeNode } from '@shared/view-builder';
import { PixiType } from '@data/assets-manager';
import { Spine } from 'pixi-spine';
import { OnViewCreatedSignal } from './signals';
import {
    BitmapBuilderBehaviour,
    ContainerBuilderBehaviour,
    NineSliceBuilderBehaviour,
    SpineBuilderBehaviour,
    SpriteBuilderBehaviour,
    TextBuilderBehaviour,
} from './behaviours';


export class ViewBuilder implements IViewBuilder {
    private _behaviours: Map<PixiType<any>, IBuilderBehaviour<any>> = new Map();

    constructor(
        private _assetsManager: IAssetsManager,
    ) {
        this.setupBehaviours();
    }

    public create(options: TreeNode, parent?: Container): Container | undefined {
        const builder = this._behaviours.get(options.type);
        if (!builder) throw new Error(`Unsupported type: ${options.type}`);

        const isLoadingLazyAsset = parent ? this.loadLazyAsset(options, parent) : false;
        if (isLoadingLazyAsset) return;

        const view = builder.create(options);
        parent?.addChild(view);
        OnViewCreatedSignal.dispatch(view);
        options.children && this.createChildren(options.children, view);

        return view;
    }

    private setupBehaviours(): void {
        this._behaviours.set(Container, new ContainerBuilderBehaviour());
        this._behaviours.set(Sprite, new SpriteBuilderBehaviour());
        this._behaviours.set(BitmapText, new BitmapBuilderBehaviour());
        this._behaviours.set(Text, new TextBuilderBehaviour());
        this._behaviours.set(Spine, new SpineBuilderBehaviour());
        this._behaviours.set(NineSlicePlane, new NineSliceBuilderBehaviour());
    }

    private createChildren(children: TreeNode[], view: Container): void {
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            this.create(child, view);
        }
    }

    private loadLazyAsset(options: TreeNode, parent: Container): boolean {
        let isLoadingLazyAsset = false;

        if ('asset' in options) {
            const asset = this._assetsManager.getBundle(options.asset);
            if (!asset) throw new Error('No such asset');

            if (asset.status === AssetStatus.Pending) {
                asset.loaded.then(() => {
                    this.create(options, parent);
                });
                isLoadingLazyAsset = true;
            }
        }

        return isLoadingLazyAsset;
    }
}
