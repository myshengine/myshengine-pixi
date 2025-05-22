import { Container } from 'pixi.js';
import * as particles from '@pixi/particle-emitter';
import { IParticleEmitter } from '@shared/particle-emitter';

export class ParticleEmitter implements IParticleEmitter {
    private _emitters: Map<string, any> = new Map();

    public createParticleEmitter(name: string, parent: Container, config: any): particles.Emitter {
        const emitter = new particles.Emitter(parent, config);
        this._emitters.set(name, emitter);

        return emitter;
    }

    public update(dt: number): void {
        const emitters = Array.from(this._emitters.values());
        emitters.forEach((emitter: any) => {
            emitter.update(dt);
        });
    }

    public emit(name: string): void {
        const emitter = this._emitters.get(name);
        if (emitter) {
            emitter.emit = true;
        }
    }

    public emitAll(): void {
        const emitters = Array.from(this._emitters.values());
        emitters.forEach((emitter: any) => {
            emitter.emit = true;
        });
    }
}
