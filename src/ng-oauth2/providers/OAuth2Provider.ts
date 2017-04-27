import {Config} from '../constants/ConfigDefaults';
import {IOAuth2Provider} from '../interfaces/IOAuth2Provider';

/**
 * Service Provider for Configurations of the Module
 */
export class OAuth2Provider implements ng.IServiceProvider, IOAuth2Provider {
    public static $inject = ['config'];
    private config: Config;

    public constructor(config: Config) {
        this.config  = config;
    }

    public configure(config: any) {
        // TODO: Neet to properly configure stuff
        // this.config = Config.getConfig();
    }

    public $get() {
        return {
            login: () => {
                // console.log('In Login');
            },
            logout: () => {
                // console.log('In Logout');
            }
        };
    }

}

OAuth2Provider.prototype.$get.$inject = ['main'];
