import { Config } from '../constants/ConfigDefaults';
import { IOAuth2 } from '../interfaces/IOAuth2';
import { LocalOAuth2 } from './LocalOAuth2';
import { Popup } from './Popup';
import { Shared } from './Shared';
import { SocialOAuth2 } from './SocialOAuth2';

/**
 * Service that start the oAuth2 authentication process
 */
export class OAuth2 implements IOAuth2 {
    // TODO: Complete Storage, add injections etc.
    public static $inject = ['$q', '$http', 'config', 'shared', 'popup'];

    private $q: angular.IQService;
    private $http: angular.IHttpService;
    private config: Config;
    private shared: Shared;
    private popup: Popup;

    constructor($q: angular.IQService,
                $http: angular.IHttpService,
                config: Config,
                shared: Shared,
                popup: Popup) {
        this.$q = $q;
        this.$http = $http;
        this.config = config;
        this.shared = shared;
        this.popup = popup;
    }

    public login(type: string, user: any): angular.IPromise<{}> {
        let deferred = this.$q.defer();
        let provider = null;

        switch (type) {
            // TODO: Is there a better way to do this?
            case 'social':
                provider = new SocialOAuth2(this.$http, this.$q, this.config, this.shared, this.popup);
                break;

            case 'local':
                provider = new LocalOAuth2(this.$http, this.$q, this.config, this.shared);
                break;

            default:
                throw 'Not Known Type of Login';
        }
        provider.login(user)
            .then((response: any) => {
                deferred.resolve(response);
            },
            (errorResponse: any) => {
                // TODO: Add event broadcasts
                deferred.reject();
            });

        return deferred.promise;
    }
}
