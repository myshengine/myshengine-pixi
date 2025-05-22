import { MyshPixiApp } from '@app/mysh-pixi.app';
import { Application, BaseTexture, MIPMAP_MODES, SCALE_MODES } from 'pixi.js';

export class PixiRender {
    public init(config: { color: number }): Application {
        BaseTexture.defaultOptions.scaleMode = SCALE_MODES.LINEAR;
        BaseTexture.defaultOptions.mipmap = MIPMAP_MODES.ON;

        const pixi = new Application({
            backgroundAlpha: 1,
            backgroundColor: config.color,
            powerPreference: 'high-performance',
            resolution: this.getDevicePixelRatio(),
            autoDensity: true,
            width: window.innerWidth,
            height: window.innerHeight,
        });

        return pixi;
    }

    private getDevicePixelRatio(): number {
        if (window.devicePixelRatio >= 2) {
            return 2;
        } else {
            return window.devicePixelRatio;
        }
    }
}

const parent = document.querySelector('.game') as HTMLDivElement;
const render = new PixiRender();
const pixi = render.init({ color: 0x000000 });

const mysh = new MyshPixiApp();
mysh.connectRender(pixi, parent);
mysh.init();