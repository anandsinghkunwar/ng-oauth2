/// <reference path='../../_all.ts' />

module todos {
    'use strict';

    /**
     * Services that persists and retrieves TODOs from localStorage.
     */
    export class TodoStorage implements ITodoStorage {

        STORAGE_ID = 'todos-angularjs-typescript';

        get (): string {
            return 'hello';
        }

        put(todos: string) {
            localStorage.setItem(this.STORAGE_ID, todos);
        }
    }
}
