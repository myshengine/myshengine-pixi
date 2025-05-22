import { AbstractBuilderBehaviour } from './abstract-builder.behaviour';
import { Container, Sprite, Texture } from 'pixi.js';
import { ISpriteOptions } from '@shared/view-builder';
import { ServiceContainer } from 'myshengine-core';
import { AssetsManager } from '@data/assets-manager';

export class SpriteBuilderBehaviour extends AbstractBuilderBehaviour<ISpriteOptions> {
    public create(options: ISpriteOptions): Container {
        const assetsManager = ServiceContainer.instance.get(AssetsManager);
        const item = assetsManager.getAsset<Texture>(options.asset);
        if (!item) throw new Error(`Asset ${options.asset.toString()} not found!`);

        const texture = item.asset;
        const view = new Sprite();
        view.texture = texture;
        view.tint = options.tint ? options.tint : 0xffffff;

        this.setCommonData(options, view);
        this.setAnchor(options.anchor, view);

        return view;
    }
}
