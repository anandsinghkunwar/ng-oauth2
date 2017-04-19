/// <reference path='../../_all.ts' />

namespace ngOAuth2 {
    export interface IStorage {
        get(key: string): string;
        put(key: string, value: string): any;
        clear(key: string): any;
    }
}
