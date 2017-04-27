
/**
 * Services that intercepts HTTP/s requests and adds the header field in them
 */
export class HttpInterceptor implements ng.IHttpInterceptor {

    public static Factory(): HttpInterceptor {
        // TODO: Add any dependencies by injections
        return new HttpInterceptor();
    }

    constructor() {
        return;
    }

    /**
     * For modifying outgoing requests to the server
     */
    // TODO: Investigate if public/private/protected
    public request = (config: ng.IRequestConfig): ng.IRequestConfig => {

        // TODO: Check if config contains a skipping authorization and modify config
        config.headers['Test'] = 'Hello';
        return config;
    }
}
