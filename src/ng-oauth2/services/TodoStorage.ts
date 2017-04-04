/// <reference path='../../_all.ts' />

namespace ngOAuth2 {
    'use strict';

    /**
     * Services that persists and retrieves TODOs from localStorage.
     */
    export class TodoStorage implements ITodoStorage {

        private STORAGE_ID = 'todos-angularjs-typescript';

        public get (): string {
            return 'hello';
        }

        public put(todos: string) {
            localStorage.setItem(this.STORAGE_ID, todos);
        }
    }
}
