import { Assets, Spritesheet, Texture } from 'pixi.js';
import { ILoaderBehaviour } from './model';
import { IAssetsManager } from '@shared/assets-manager';
import { IAliasedResolution, IBundle, ILoader, ILoaderConfig } from '@shared/loader';
import {
    BitmapLoaderBehaviour,
    SpineLoaderBehaviour,
    SpritesheetLoaderBehaviour,
    TextureLoaderBehaviour,
} from './behaviours';

export class Loader implements ILoader {
    public get dimension(): string {
        return this._dimension;
    }

    private _dimension: string = '';
    private _behaviours: Map<string, ILoaderBehaviour> = new Map();

    constructor(private _assetsManager: IAssetsManager) {}

    public async init(config: ILoaderConfig): Promise<void> {
        const { bundles } = config.manifest;
        const isWebPSupported = await this.checkWebPSupport();

        this._dimension = this.closestDimension(config.resolutions);
        config.ignoreFormats && this.ignoreFormats(bundles, config.ignoreFormats);

        this.selectResolution(bundles, this._dimension);
        this.selectWebp(bundles, isWebPSupported);
        this.setupBehaviours();

        Assets.setPreferences({
            preferCreateImageBitmap: false,
            preferWorkers: false,
        });

        await Assets.init({ manifest: { bundles } });
    }

    public async loadBundle(name: string): Promise<void> {
        this._assetsManager.add(name);

        return Assets.loadBundle(name).then((bundle) => {
            this.processBundle(name, bundle);
        });
    }

    private processBundle(name: string, bundle: any): void {
        for (let key in bundle) {
            let buildBehaviour;

            if (bundle[key].hasOwnProperty('spineData')) {
                buildBehaviour = this._behaviours.get('spine');
            } else if (bundle[key] instanceof Texture) {
                buildBehaviour = this._behaviours.get('texture');
            } else if (bundle[key] instanceof Spritesheet) {
                buildBehaviour = this._behaviours.get('spritesheet');
            } else if (name === 'fonts') {
                buildBehaviour = this._behaviours.get('bitmap');
            }

            buildBehaviour && buildBehaviour.build(key, name, bundle);
        }
    }

    private setupBehaviours(): void {
        this._behaviours.set('spritesheet', new SpritesheetLoaderBehaviour(this._assetsManager));
        this._behaviours.set('texture', new TextureLoaderBehaviour(this._assetsManager));
        this._behaviours.set('bitmap', new BitmapLoaderBehaviour(this._assetsManager));
        this._behaviours.set('spine', new SpineLoaderBehaviour(this._assetsManager));
    }

    private closestDimension = (supportResolutions: IAliasedResolution[]): string => {
        const height = window.screen.height * window.devicePixelRatio;
        const width = window.screen.width * window.devicePixelRatio;
        const maxBorderSize = height > width ? height : width;
        const deltaResolutions = supportResolutions.map((info) => Math.abs(maxBorderSize - info.width));

        let minDelta = deltaResolutions[0];
        let minDeltaIndex = 0;

        deltaResolutions.map((delta, index) => {
            if (delta < minDelta) {
                minDelta = delta;
                minDeltaIndex = index;
            }
        });

        const findSupportResolution = supportResolutions[minDeltaIndex];

        return findSupportResolution.alias;
    };

    private checkWebPSupport(): Promise<boolean> {
        return new Promise((resolve) => {
            const webP = new Image();

            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src =
                'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    private selectResolution(bundles: IBundle[], resolution: string): void {
        for (let bundle of bundles) {
            for (let asset of bundle.assets) {
                if (Array.isArray(asset.srcs)) {
                    const selectedSrc = asset.srcs.filter((src: string) => src.includes(resolution));
                    if (selectedSrc && selectedSrc.length) asset.srcs = selectedSrc;
                }
            }
        }
    }

    private selectWebp(bundles: IBundle[], isSupport: boolean): void {
        for (let bundle of bundles) {
            for (let asset of bundle.assets) {
                if (Array.isArray(asset.srcs)) {
                    const selectedSrc = isSupport
                        ? asset.srcs.find((src: string) => src.includes('_webp'))
                        : asset.srcs.find((src: string) => !src.includes('_webp'));

                    if (selectedSrc) asset.srcs = selectedSrc;
                }
            }
        }
    }

    private ignoreFormats(bundles: IBundle[], formats: string[]): void {
        for (let bundle of bundles) {
            for (let asset of bundle.assets) {
                if (!Array.isArray(asset.srcs)) continue;

                const isIgnored = asset.srcs.some((src: string) =>
                    formats.some((format) => src.includes(`.${format}`)),
                );
                bundle.assets = bundle.assets.filter(() => !isIgnored);
            }

            if (bundle.assets.length == 0) {
                const index = bundles.indexOf(bundle);
                bundles.splice(index, 1);
            }
        }
    }
}
