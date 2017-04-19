/// <reference path='_all.ts' />

/**
 * The main ng-oauth2 app module.
 *
 * @type {angular.Module}
 */
namespace ngOAuth2 {
    'use strict';

    let lib = angular.module('ngOAuth2', [])
            .service('httpInterceptor', HttpInterceptor)
            .service('storage', Storage)
            .service('main', OAuth2);
}
