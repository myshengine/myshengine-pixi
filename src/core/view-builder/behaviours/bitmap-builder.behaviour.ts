import { BitmapText } from 'pixi.js';
import { AbstractBuilderBehaviour } from './abstract-builder.behaviour';
import { IBitmapTextOptions } from '@shared/view-builder';

export class BitmapBuilderBehaviour extends AbstractBuilderBehaviour<IBitmapTextOptions> {
    public create(options: IBitmapTextOptions): BitmapText {
        const view = new BitmapText(options.text, options.bitmapTextStyle);

        this.setCommonData(options, view);
        this.setAnchor(options.anchor, view);

        view.tint = options.tint ? options.tint : 0xffffff;

        return view;
    }
}
