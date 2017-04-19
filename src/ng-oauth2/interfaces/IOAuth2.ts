/// <reference path='../../_all.ts' />

namespace ngOAuth2 {
    export interface IOAuth2 {
        get(key: string): string;
        put(key: string, value: string): any;
        clear(key: string): any;
    }
}
