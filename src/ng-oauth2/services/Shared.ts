import {Config} from '../constants/ConfigDefaults';
import {IShared} from '../interfaces/IShared';
import {Storage} from './Storage';

export class Shared implements IShared {
    private $rootScope: angular.IRootScopeService;
    private config: Config;
    private storage: Storage;

    public constructor($rootScope: angular.IRootScopeService,
                       config: Config,
                       storage: Storage) {
        this.$rootScope = $rootScope;
        this.config = config;
        this.storage = storage;
    }

    public setToken(response: any): any {
        let broadcast = false;
        if ('access_token' in response.data) {
            if (this.storage.isSet(this.config.tokenName) === false) {
                broadcast = true;
            }
            this.storage.put(this.config.tokenName,
                response.data['access_token']);
        }
        if ('refresh_token' in response.data) {
            this.storage.put(this.config.refreshTokenName,
                response.data['refresh_token']);
        }
        if (broadcast === true) {
            this.$rootScope.$broadcast(this.config.loginEventName, response);
        }
    }

    public unsetToken(): any {
        let broadcast = false;

        // FIXME: Hack maybe
        if (this.storage.isSet(this.config.tokenName) === true) {
            this.storage.clear(this.config.tokenName);
            broadcast = true;
        }
        if (this.storage.isSet(this.config.refreshTokenName) === true) {
            this.storage.clear(this.config.tokenName);
        }
        if (broadcast === true) {
            // FIXME
            this.$rootScope.$broadcast(this.config.logoutEventName, {});
        }
    }

    public isTokenSet(): boolean {
        return this.storage.isSet(this.config.tokenName);
    }
}
