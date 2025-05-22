import { AssetStatus } from '../data';

export interface IAssetable {
    asset: string | IAssetConfig;
}

export interface IAssetConfig {
    bundle: string;
    name: string;
}

export interface IAssetData<T> {
    name: string;
    bundle: string;
    asset: T;
}

export interface IAsset {
    status: AssetStatus;
    data: IAssetData<any>[];
    name: string;
    loaded: Promise<IAsset>;
    getAssetByName<T>(asset: string | IAssetConfig): IAssetData<T> | undefined;
}

export interface IExternalResolvableAsset extends IAsset {
    resolve: (value: IAsset) => void;
}

export interface IAssetsManager {
    list: Map<string, IExternalResolvableAsset>;
    add(name: string): void;
    updateOnLoad(name: string, assets: IAssetData<any>[]): void;
    getBundle(assetConfig: string | IAssetConfig): IAsset | undefined;
    getAsset<T>(assetConfig: string | IAssetConfig): IAssetData<T> | undefined;

    hasAsset<T>(assetConfig: string | IAssetConfig): boolean;
}
