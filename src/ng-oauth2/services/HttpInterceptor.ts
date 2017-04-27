import {Config} from '../constants/ConfigDefaults';
import {Storage} from './Storage';

/**
 * Services that intercepts HTTP/s requests and adds the header field in them
 */
export class HttpInterceptor implements angular.IHttpInterceptor {
    public static $inject = ['storage'];

    public static Factory(storage: Storage, config: Config): HttpInterceptor {
        return new HttpInterceptor(storage, config);
    }

    private storage: Storage;
    private config: Config;

    constructor(storage: Storage, config: Config) {
        this.storage = storage;
        this.config = config;
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
}

HttpInterceptor.Factory.$inject = ['storage', 'config'];
