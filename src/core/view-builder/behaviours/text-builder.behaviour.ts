import { Text, TextStyle } from 'pixi.js';
import { AbstractBuilderBehaviour } from './abstract-builder.behaviour';
import { ITextOptions } from '@shared/view-builder';

export class TextBuilderBehaviour extends AbstractBuilderBehaviour<ITextOptions> {
    public create(options: ITextOptions): Text {
        const style = new TextStyle(options.textStyle || {});
        const view = new Text(options.text, style);

        this.setCommonData(options, view);
        this.setAnchor(options.anchor, view);

        return view;
    }
}
