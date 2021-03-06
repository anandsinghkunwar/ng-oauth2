import { Config } from './ng-oauth2/constants/ConfigDefaults';
import { OAuth2Provider } from './ng-oauth2/providers/OAuth2Provider';
import { HttpInterceptor } from './ng-oauth2/services/HttpInterceptor';
import { OAuth2 } from './ng-oauth2/services/OAuth2';
import { Popup } from './ng-oauth2/services/Popup';
import { Shared } from './ng-oauth2/services/Shared';
import { Storage } from './ng-oauth2/services/Storage';

/**
 * The main ng-oauth2 app module.
 *
 */
let lib = angular.module('ngOAuth2', [])
    .provider('$oauth2', ['config', (config: Config) => new OAuth2Provider(config)])
    .constant('config', Config.getConfig())
    .service('popup', Popup)
    .service('shared', Shared)
    .service('main', OAuth2)
    .service('storage', Storage)
    .service('httpInterceptor', HttpInterceptor)
    .config(['$httpProvider', ($httpProvider: angular.IHttpProvider) => {
        $httpProvider.interceptors.push(HttpInterceptor.Factory);
    }]);
