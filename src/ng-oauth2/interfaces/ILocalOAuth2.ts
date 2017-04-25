export interface ILocalOAuth2 {
    get(key: string): string;
    put(key: string, value: string): any;
    clear(key: string): any;
}
