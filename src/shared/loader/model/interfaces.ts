export interface IBundleAsset {
    name: string;
    srcs: string | string[];
}

export interface IBundle {
    name: string;
    assets: IBundleAsset[];
}

export interface IAliasedResolution {
    width: number;
    height: number;
    alias: string;
}

export interface IManifest {
    bundles: IBundle[];
}

export interface ILoaderConfig {
    manifest: IManifest;
    resolutions: IAliasedResolution[];
    ignoreFormats?: string[];
}

export interface ILoader {
    dimension: string;
    init(config: ILoaderConfig): Promise<void>;
    loadBundle(name: string): Promise<void>;
}
