import {Config} from '../constants/ConfigDefaults';
import {IOAuth2Provider} from '../interfaces/IOAuth2Provider';
import {OAuth2} from '../services/OAuth2';

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

    public $get(main: OAuth2) {
        return {
            login: (type: string, user: any) => main.login(type, user),
            logout: () => {
                console.log('In Logout');
            }
        };
    }

}

OAuth2Provider.prototype.$get.$inject = ['main'];
