/// <reference path='../../_all.ts' />

namespace ngOAuth2 {
    'use strict';

    /**
     * Services that persists and retrieves TODOs from localStorage.
     */
    export class Storage implements IStorage {
        // TODO: Complete Storage, add injections etc.

        constructor() {
            return;
        }
        public get(key: string): string {
            return 'hello';
        }

        public put(key: string, value: string) {
            return;
        }

        public clear(key: string) {
            return;
        }
    }
}
