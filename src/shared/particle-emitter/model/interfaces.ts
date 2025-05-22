import { Container } from 'pixi.js';
import * as particles from '@pixi/particle-emitter';

export interface IParticleEmitter {
    createParticleEmitter(name: string, parent: Container, config: any): particles.Emitter;
    update(dt: number): void;
    emit(name: string): void;
    emitAll(): void;
}
