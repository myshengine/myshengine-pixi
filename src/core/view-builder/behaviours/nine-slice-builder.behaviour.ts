import { AbstractBuilderBehaviour } from './abstract-builder.behaviour';
import { Container, NineSlicePlane, Texture } from 'pixi.js';
import { INineSliceOptions } from '@shared/view-builder';
import { ServiceContainer } from 'myshengine-core';
import { AssetsManager } from '@data/assets-manager';

export class NineSliceBuilderBehaviour extends AbstractBuilderBehaviour<INineSliceOptions> {
    public create(options: INineSliceOptions): Container {
        const assetsManager = ServiceContainer.instance.get(AssetsManager);
        const item = assetsManager.getAsset<Texture>(options.asset);
        if (!item) throw new Error(`Asset ${options.asset.toString()} not found!`);

        const texture = item.asset;
        const view = new NineSlicePlane(
            texture,
            options.leftWidth,
            options.topHeight,
            options.rightWidth,
            options.bottomHeight
        );

        view.tint = options.tint ? options.tint : 0xffffff;

        this.setCommonData(options, view);

        return view;
    }
}
