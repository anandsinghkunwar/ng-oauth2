/// <reference path='../../_all.ts' />

namespace ngOAuth2 {
    export interface IHttpInterceptor {
        get (): string;
        put(todos: string): any;
    }
}
