import { Spritesheet } from 'pixi.js';
import { ILoaderBehaviour } from '../model';
import { IAssetsManager } from '@shared/assets-manager';

export class SpritesheetLoaderBehaviour implements ILoaderBehaviour {
    constructor(private _assetsManager: IAssetsManager) {}

    public build(key: string, name: string, bundle: any): void {
        const spritesheet = bundle[key] as Spritesheet;
        const textures = spritesheet.textures;

        for (let anim in spritesheet.animations) {
            this._assetsManager.add(key);
            const textures = spritesheet.animations[anim];
            this._assetsManager.updateOnLoad(key, [{ name: anim, asset: textures, bundle: name }]);
        }

        for (let item in textures) {
            this._assetsManager.updateOnLoad(name, [{ name: item, asset: textures[item], bundle: name }]);
        }
    }
}
