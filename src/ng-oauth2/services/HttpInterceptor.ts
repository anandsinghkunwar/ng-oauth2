/// <reference path='../../_all.ts' />

namespace ngOAuth2 {
    'use strict';

    /**
     * Services that persists and retrieves TODOs from localStorage.
     */
    export class HttpInterceptor implements IHttpInterceptor {

        public static $inject = [
            '$scope'
        ];
        private STORAGE_ID = 'todos-angularjs-typescript';

        constructor(
            private $scope: ng.IScope
        ) {

        }

        public get(): string {
            return 'hello';
        }

        public put(todos: string) {
            localStorage.setItem(this.STORAGE_ID, todos);
        }
    }
}
