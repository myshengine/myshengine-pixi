import { Asset } from './asset';
import { AssetStatus } from '@shared/assets-manager';
import {
    IAsset,
    IAssetConfig,
    IAssetData,
    IAssetsManager,
    IExternalResolvableAsset,
} from '@shared/assets-manager/model';

export class AssetsManager implements IAssetsManager {
    public list: Map<string, IExternalResolvableAsset> = new Map();

    public add(name: string): void {
        const asset: IExternalResolvableAsset = new Asset(name);
        this.list.set(name, asset);
    }

    public updateOnLoad(name: string, assets: IAssetData<any>[]): void {
        const item = this.list.get(name);
        if (!item) return;

        item.data.push(...assets);
        item.status = AssetStatus.Loaded;

        item.resolve(item);
    }

    public getBundle(assetConfig: string | IAssetConfig): IAsset | undefined {
        let item;

        if (typeof assetConfig === 'string') {
            item = this.findParentBundle(assetConfig);
        } else {
            item = this.list.get(assetConfig.bundle);
        }

        return item;
    }

    public getAsset<T>(assetConfig: string | IAssetConfig): IAssetData<T> | undefined {
        const bundle = this.getBundle(assetConfig);
        if (!bundle) return;

        return bundle?.getAssetByName<T>(assetConfig);
    }

    public hasAsset<T>(assetConfig: string | IAssetConfig): boolean {
        const bundle = this.getBundle(assetConfig);
        return !!bundle?.getAssetByName<T>(assetConfig);
    }

    private findParentBundle(name: string): IAsset | undefined {
        const bundles = Array.from(this.list.values());
        const items = bundles.flatMap((bundle) => bundle.data);
        const item = items.find((item) => item.name === name);
        if (!item) return;

        return this.list.get(item.bundle);
    }
}
