import { ISkeletonData, Spine } from 'pixi-spine';
import { AbstractBuilderBehaviour } from './abstract-builder.behaviour';
import { ISpineOptions } from '@shared/view-builder';
import { ServiceContainer } from 'myshengine-core';
import { AssetsManager } from '@data/assets-manager';
import { SpineController } from '@features/spine-controller';

export class SpineBuilderBehaviour extends AbstractBuilderBehaviour<ISpineOptions> {
    public create(options: ISpineOptions): Spine {
        const assetsManager = ServiceContainer.instance.get(AssetsManager);
        const spineController = ServiceContainer.instance.get(SpineController);

        const item = assetsManager.getAsset<ISkeletonData>(options.asset);
        if (!item) throw new Error(`Asset ${options.asset.toString()} not found!`);

        const spineData = item.asset;
        const view = new Spine(spineData);

        if (options.initialAnimation) {
            if (view.state.hasAnimation(options.initialAnimation)) {
                const name = `${options.key || ''}:${options.name}`;
                const chain = spineController.create(name);

                chain
                    .add(view, options.initialAnimation, {
                        timeScale: options.timeScale,
                        loopCount: options.loop,
                    })
                    .play();

                view.autoUpdate = true;
            }
        }

        if (options.skin) {
            if (view.skeleton.data.findSkin(options.skin)) {
                view.skeleton.setSkinByName(options.skin);
                view.skeleton.setSlotsToSetupPose();
            }
        }

        this.setCommonData(options, view);

        return view;
    }
}
