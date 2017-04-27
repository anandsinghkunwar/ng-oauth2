import {Storage} from './Storage';

/**
 * Services that intercepts HTTP/s requests and adds the header field in them
 */
export class HttpInterceptor implements angular.IHttpInterceptor {
    public static $inject = ['storage'];

    public static Factory(storage: Storage): HttpInterceptor {
        return new HttpInterceptor(storage);
    }

    private storage: Storage;

    constructor(storage: Storage) {
        this.storage = storage;
    }

    /**
     * For modifying outgoing requests to the server
     */
    // TODO: Investigate if public/private/protected
    public request = (config: angular.IRequestConfig): angular.IRequestConfig => {
        console.log(this.storage);
        if (config.data['token'] === false) {
            return config;
        }
        // If does not have token as false
        config.headers['Test'] = 'Hello';
        // console.log(config);
        return config;
    }
}

HttpInterceptor.Factory.$inject = ['storage'];
