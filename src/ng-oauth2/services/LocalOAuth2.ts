import {Config} from '../constants/ConfigDefaults';
import {ILocalOAuth2} from '../interfaces/ILocalOAuth2';
import {Shared} from './Shared';

/**
 * Service that start the local oAuth2 authentication process
 */
export class LocalOAuth2 implements ILocalOAuth2 {
    // TODO: Complete Storage, add injections etc.
    public static $inject = ['$http', 'config', 'shared'];

    private config: Config;
    private $http: angular.IHttpService;
    private shared: Shared;

    constructor($http: angular.IHttpService, config: Config, shared: Shared) {
        this.$http = $http;
        this.config = config;
        this.shared = shared;
    }
    public login(user: any): angular.IHttpPromise<any> {
        let httpOptions: any = {};
        httpOptions.url = this.config.baseUrl + this.config.loginUrl;
        httpOptions.data = user;
        httpOptions.method = this.config.loginMethod;

        return this.$http(httpOptions).then((response) => {
            this.shared.setToken(response);
            return response;
        });
    }

    public signup(user: any): angular.IHttpPromise<any> {
        let httpOptions: any = {};
        httpOptions.url = this.config.baseUrl + this.config.signupUrl;
        httpOptions.data = user;
        httpOptions.method = this.config.signupMethod;

        // TODO: Repair this maybe
        return this.$http(httpOptions).then((response) => {
            this.shared.setToken(response);
            return response;
        });
    }
}
