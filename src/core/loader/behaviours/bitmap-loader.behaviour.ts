import { ILoaderBehaviour } from '../model';
import { BitmapFont, BitmapFontData, Spritesheet } from 'pixi.js';
import { IAssetsManager } from '@shared/assets-manager';

export class BitmapLoaderBehaviour implements ILoaderBehaviour {
    constructor(private _assetsManager: IAssetsManager) {}

    public build(key: string, name: string, bundle: any): void {
        const fontData = new BitmapFontData();
        const bitmapRes = bundle[key] as Spritesheet;

        const extraCharsMapping = {
            dot: '.',
            comma: ',',
            usd: '$',
            eur: '€',
            space: ' ',
            dash: '-',
            plus: '+',
        };

        const frames = bitmapRes.data.frames;
        const textures = Object.keys(frames).map((frameKey, i) => {
            fontData.page.push({
                id: i,
                file: '',
            });

            // TODO: Remove TS ignore!
            //@ts-ignore
            const id = frameKey.length > 1 ? extraCharsMapping[frameKey] : frameKey;
            const uniqId = id.charCodeAt(0);
            const texture = bitmapRes.textures[frameKey];

            fontData.char.push({
                id: uniqId,
                page: i,
                x: 0,
                y: 0,
                width: texture.width,
                height: texture.height,
                xoffset: 0,
                yoffset: 0,
                xadvance: texture.width,
            });

            return texture;
        });

        fontData.common[0] = {
            lineHeight: textures[0].height,
        };

        fontData.info[0] = {
            face: key,
            size: textures[0].height,
        };

        const font = new BitmapFont(fontData, textures, true);

        BitmapFont.available[key] = font;
    }
}
