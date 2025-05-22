import { ISpineUtils } from '@shared/spine-controller';
import { Spine } from 'pixi-spine';
import { Container } from 'pixi.js';

export class SpineUtils implements ISpineUtils {
    public getDuration(spine: Spine, name: string): number {
        const animation = spine.spineData.findAnimation(name);
        if (animation === null) throw Error(`[SpineChainsUtil]: Animation ${name} not found`);
        return animation.duration;
    }

    public findSlotIndex(spine: Spine, name: string): number {
        return spine.skeleton.findSlotIndex(name);
    }

    public findSlotByName(spine: Spine, name: string): Container {
        const index = this.findSlotIndex(spine, name);
        return spine.slotContainers[index].children[0] as Container;
    }

    public setSlotAlpha(spine: Spine, nameSlot: string, alpha: number): void {
        const currentSlot = spine.skeleton.findSlot(nameSlot);
        currentSlot.currentSprite.alpha = alpha;
    }

    public addToSlot(spine: Spine, slotName: string, child: Container): void {
        const slot = this.findSlotByName(spine, slotName);
        slot.addChild(child);
    }

    public setSkin(spine: Spine, skinName: string): void {
        const skin = spine.skeleton.data.findSkin(skinName);
        if (!skin) throw Error(`[SpineChainsUtil]: Skin ${skinName} not found`);

        spine.skeleton.skin = skin;
        spine.skeleton.setSlotsToSetupPose();
        spine.state.apply(spine.skeleton);
    }
}
