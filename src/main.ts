/// <reference path='_all.ts' />

/**
 * The main ng-oauth2 app module.
 *
 * @type {angular.Module}
 */
module todos {
    'use strict';

    var ngOAuth2 = angular.module('ngOAuth2', [])
            .service('todoStorage', TodoStorage);
}
