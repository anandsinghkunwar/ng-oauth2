import { Config } from './ng-oauth2/constants/ConfigDefaults';
import { OAuth2Provider } from './ng-oauth2/providers/OAuth2Provider';
import { HttpInterceptor } from './ng-oauth2/services/HttpInterceptor';
import { OAuth2 } from './ng-oauth2/services/OAuth2';
import { Storage } from './ng-oauth2/services/Storage';

/**
 * The main ng-oauth2 app module.
 *
 */

let lib = ng.module('ngOAuth2', [])
    .provider('$oauth2', OAuth2Provider)
    .constant('config', Config.getConfig)
    .service('httpInterceptor', HttpInterceptor)
    .service('storage', Storage)
    .service('main', OAuth2);
