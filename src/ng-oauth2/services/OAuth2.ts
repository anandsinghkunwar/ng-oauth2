import { IOAuth2 } from '../interfaces/IOAuth2';
import { LocalOAuth2 } from './LocalOAuth2';
import { SocialOAuth2 } from './SocialOAuth2';

/**
 * Service that start the oAuth2 authentication process
 */
export class OAuth2 implements IOAuth2 {
    // TODO: Complete Storage, add injections etc.
    public static $inject = ['$q', '$http'];

    private $q: ng.IQService;
    private $http: ng.IHttpService;

    constructor($q: ng.IQService, $http: ng.IHttpService) {
        this.$q = $q;
        this.$http = $http;
        return;
    }

    public login(type: string, user: any): ng.IPromise<{}> {
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
