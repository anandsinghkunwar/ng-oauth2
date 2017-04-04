/// <reference path='../../_all.ts' />

namespace ngOAuth2 {
    export interface ITodoStorage {
        get (): string;
        put(todos: string): any;
    }
}
