import {Config} from '../constants/ConfigDefaults';
import {IOAuth2Provider} from '../interfaces/IOAuth2Provider';
import {OAuth2} from '../services/OAuth2';
import {Shared} from '../services/Shared';

/**
 * Service Provider for Configurations of the Module
 */
export class OAuth2Provider implements angular.IServiceProvider, IOAuth2Provider {
    public static $inject = ['config'];
    private config: Config;

    public constructor(config: Config) {
        this.config = config;
    }

    public configure(config: any) {
        angular.extend(this.config, config);
    }

    public configureFacebook(config: any) {
        angular.extend(this.config.providers.facebook, config);
    }

    public configureGoogle(config: any) {
        angular.extend(this.config.providers.google, config);
    }

    public $get($http: angular.IHttpService,
                $rootScope: angular.IRootScopeService,
                main: OAuth2,
                config: Config,
                shared: Shared) {
        return {
            login: (type: string, user: any) => main.login(type, user),
            logout: () => {
                // HACK FIXME
                $http({
                    method: config.logoutMethod,
                    url: config.baseUrl + config.logoutUrl
                })
                    .then((response) => {
                        shared.unsetToken();
                    }, (errorResponse) => {
                        console.log(errorResponse);
                        $rootScope.$broadcast(config.logoutFailureEventName, errorResponse);
                    });
                console.log('In Logout');
            }
        };
    }

}

OAuth2Provider.prototype.$get.$inject = ['$http', '$rootScope', 'main', 'config', 'shared'];
