import { IContainerOptions } from '@shared/view-builder';
import { AbstractBuilderBehaviour } from './abstract-builder.behaviour';
import { Container } from 'pixi.js';

export class ContainerBuilderBehaviour extends AbstractBuilderBehaviour<IContainerOptions> {
    public create(options: IContainerOptions): Container {
        const view = new Container();

        this.setCommonData(options, view);

        return view;
    }
}
