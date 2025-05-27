import { PixiEventType } from "@shared/view-builder";
import { IEntity } from "myshengine-core";
import { Container } from "pixi.js";

export interface IInteraction {
    type: PixiEventType;
    view: Container;
    entity: IEntity | null;
}