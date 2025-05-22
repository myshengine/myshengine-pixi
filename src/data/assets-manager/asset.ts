import { AssetStatus } from '@shared/assets-manager';
import { IAsset, IAssetConfig, IAssetData, IExternalResolvableAsset } from '@shared/assets-manager/model';

export class Asset implements IExternalResolvableAsset {
    public data: IAssetData<any>[] = [];
    public status = AssetStatus.Pending;

    public get name(): string {
        return this._name;
    }

    public get loaded(): Promise<IAsset> {
        return this._loaded;
    }

    public get resolve(): (value: IAsset) => void {
        return this._resolve;
    }

    private _resolve!: (value: IAsset) => void;
    private _loaded: Promise<IAsset> = new Promise((resolve) => (this._resolve = resolve));

    constructor(private _name: string) {}

    public getAssetByName<T>(asset: string | IAssetConfig): IAssetData<T> | undefined {
        const name = typeof asset === 'string' ? asset : asset.name;
        return this.data.find((item) => item.name === name);
    }
}
