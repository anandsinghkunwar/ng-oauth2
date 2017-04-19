/// <reference path='../../_all.ts' />

namespace ngOAuth2 {
    'use strict';

    /**
     * Services that persists and retrieves TODOs from localStorage.
     */
    export class HttpInterceptor implements angular.IHttpInterceptor {

        public static Factory(): HttpInterceptor {
            // TODO: Add any dependencies by injections
            return new HttpInterceptor();
        }

        constructor() {
            return;
        }

        /*
         * For modifying outgoing requests to the server
         */
        // TODO: Investigate if public/private/protected
        public request = (config: angular.IRequestConfig): angular.IRequestConfig => {

          // TODO: Check if config contains a skipping authorization and modify config

          return config;
        }
    }
}
