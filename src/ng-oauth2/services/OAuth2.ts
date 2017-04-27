import { Config } from '../constants/ConfigDefaults';
import { IOAuth2 } from '../interfaces/IOAuth2';
import { LocalOAuth2 } from './LocalOAuth2';
import { SocialOAuth2 } from './SocialOAuth2';

/**
 * Service that start the oAuth2 authentication process
 */
export class OAuth2 implements IOAuth2 {
    // TODO: Complete Storage, add injections etc.
    public static $inject = ['$q', '$http', 'config'];

    private $q: angular.IQService;
    private $http: angular.IHttpService;
    private config: Config;

    constructor($q: angular.IQService, $http: angular.IHttpService, config: Config) {
        this.$q = $q;
        this.$http = $http;
        this.config = config;
    }

    public login(type: string, user: any): angular.IPromise<{}> {
        let deferred = this.$q.defer();
        let provider = null;

        switch (type) {
            // TODO: Is there a better way to do this?
            case 'social':
                provider = new SocialOAuth2();
                break;

            case 'local':
                provider = new LocalOAuth2();
                break;

            default:
                throw 'Not Known Type of Login';
        }

        /* provider.start(xyz).then({
            do something
            deferred.resolve();
        }, {
            do something again
            deferred.reject();
        })*/
        return deferred.promise;
    }
}
