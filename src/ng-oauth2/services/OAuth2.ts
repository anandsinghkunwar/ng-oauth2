import { Config } from '../constants/ConfigDefaults';
import { IOAuth2 } from '../interfaces/IOAuth2';
import { LocalOAuth2 } from './LocalOAuth2';
import { Shared } from './Shared';
import { SocialOAuth2 } from './SocialOAuth2';

/**
 * Service that start the oAuth2 authentication process
 */
export class OAuth2 implements IOAuth2 {
    // TODO: Complete Storage, add injections etc.
    public static $inject = ['$q', '$http', 'config', 'shared'];

    private $q: angular.IQService;
    private $http: angular.IHttpService;
    private config: Config;
    private shared: Shared;

    constructor($q: angular.IQService,
                $http: angular.IHttpService,
                config: Config,
                shared: Shared) {
        this.$q = $q;
        this.$http = $http;
        this.config = config;
        this.shared = shared;
    }

    public login(type: string, user: any): angular.IPromise<{}> {
        let deferred = this.$q.defer();
        let provider = null;

        switch (type) {
            // TODO: Is there a better way to do this?
            case 'social':
                provider = new SocialOAuth2(this.$http);
                break;

            case 'local':
                provider = new LocalOAuth2(this.$http, this.config, this.shared);
                break;

            default:
                throw 'Not Known Type of Login';
        }
        provider.login(user)
            .then((response) => {
                deferred.resolve(response);
            },
            (errorResponse) => {
                // TODO: Add event broadcasts
                deferred.reject();
            });

        return deferred.promise;
    }
}
