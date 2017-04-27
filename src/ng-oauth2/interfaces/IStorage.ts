export interface IStorage {
    get(key: string): string;
    put(key: string, value: string): any;
    isSet(key: string): boolean;
    clear(key: string): any;
}
