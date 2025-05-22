import { ILoaderBehaviour } from '../model';
import { IAssetsManager } from '@shared/assets-manager';

export class SpineLoaderBehaviour implements ILoaderBehaviour {
    constructor(private _assetsManager: IAssetsManager) {}

    public build(key: string, name: string, bundle: any): void {
        this._assetsManager.updateOnLoad(name, [{ name: key, asset: bundle[key].spineData, bundle: name }]);
    }
}
