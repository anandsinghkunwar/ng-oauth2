import {Config} from '../constants/ConfigDefaults';
import {IStorage} from '../interfaces/IStorage';
/**
 * Services that persists and retrieves TODOs from localStorage.
 */
export class Storage implements IStorage {
    // TODO: Complete Storage, add injections etc.
    public static $inject = ['$window', 'config'];

    private config: Config;
    private $window: any;

    constructor($window: angular.IWindowService, config: Config) {
        this.config = config;
        this.$window = $window;
        console.log(this.config);
        if (this.config.storageType !== 'localStorage' &&
            this.config.storageType !== 'sessionStorage') {
            throw 'Error due to invalid storage type(1)';
        }
    }
    public get(key: string): string {
        let storage = null;
        switch (this.config.storageType) {
            case 'localStorage':
                storage = this.$window.localStorage;
                break;

            case 'sessionStorage':
                storage = this.$window.sessionStorage;
                break;

            default:
                throw 'Error due to invalid storage type(2)';
        }
        return storage[key];
    }

    public put(key: string, value: string) {
        let storage = null;
        switch (this.config.storageType) {
            case 'localStorage':
                storage = this.$window.localStorage;
                break;

            case 'sessionStorage':
                storage = this.$window.sessionStorage;
                break;

            default:
                throw 'Error due to invalid storage type';
        }
        storage[key] = value;
        return;
    }

    public isSet(key: string) {
        let storage = null;
        switch (this.config.storageType) {
            case 'localStorage':
                storage = this.$window.localStorage;
                break;

            case 'sessionStorage':
                storage = this.$window.sessionStorage;
                break;

            default:
                throw 'Error due to invalid storage type';
        }
        return (storage.getItem(key) === null) ? false : true;
    }

    public clear(key: string) {
        let storage = null;
        switch (this.config.storageType) {
            case 'localStorage':
                storage = this.$window.localStorage;
                break;

            case 'sessionStorage':
                storage = this.$window.sessionStorage;
                break;

            default:
                throw 'Error due to invalid storage type';
        }
        // TODO: Surrond in try catch
        storage.removeItem(key);
        return;
    }
}
