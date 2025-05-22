export interface ILoaderBehaviour {
    build(key: string, name: string, bundle: any): void;
}
