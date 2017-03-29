/// <reference path='_all.ts' />

/**
 * The main TodoMVC app module.
 *
 * @type {angular.Module}
 */
module todos {
    'use strict';

    var ngOAuth2 = angular.module('todomvc', [])
            .service('todoStorage', TodoStorage);
}
