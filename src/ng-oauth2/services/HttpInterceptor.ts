import {Config} from '../constants/ConfigDefaults';
import {Storage} from './Storage';

/**
 * Services that intercepts HTTP/s requests and adds the header field in them
 */
export class HttpInterceptor implements angular.IHttpInterceptor {
    public static $inject = ['$rootScope', '$q', 'storage', 'config'];

    public static Factory($rootScope: angular.IRootScopeService,
                          $q: angular.IQService,
                          storage: Storage,
                          config: Config): HttpInterceptor {
        return new HttpInterceptor($rootScope, $q, storage, config);
    }

    private storage: Storage;
    private config: Config;
    private $rootScope: angular.IRootScopeService;
    private $q: angular.IQService;

    constructor($rootScope: angular.IRootScopeService,
                $q: angular.IQService,
                storage: Storage,
                config: Config) {
        this.storage = storage;
        this.config = config;
        this.$rootScope = $rootScope;
        this.$q = $q;
    }

    /**
     * For modifying outgoing requests to the server
     */
    // TODO: Investigate if public/private/protected
    public request = (config: angular.IRequestConfig): angular.IRequestConfig => {
        let configCopy: any = config;

        if (configCopy['token'] === false ||
            this.storage.isSet(this.config.tokenName) === false) {
            return config;
        }
        config.headers[this.config.tokenHeader] = this.config.tokenType
            + ' '
            + this.storage.get(this.config.tokenName);

        return config;
    }
    public responseError = (responseFailure: any): angular.IPromise<any> => {
        if (responseFailure.status === 401) {
            // FIXME HACK
            console.log(responseFailure);
            if (responseFailure.config.url === this.config.baseUrl + this.config.loginUrl) {
                this.$rootScope.$broadcast(this.config.loginEventFailureName, responseFailure);
            } else {
                this.$rootScope.$broadcast(this.config.tokenErrorEventName, responseFailure);
            }
        }
        return this.$q.reject(responseFailure);
    }
}

HttpInterceptor.Factory.$inject = ['$rootScope', '$q', 'storage', 'config'];
