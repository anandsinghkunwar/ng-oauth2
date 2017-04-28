import {Config} from '../constants/ConfigDefaults';
import {ISocialOAuth2} from '../interfaces/ISocialOAuth2';
import {Popup} from './Popup';
import {Shared} from './Shared';

/**
 * Service that start the social aAuth2 authentication process
 */
export class SocialOAuth2 implements ISocialOAuth2 {
    // TODO: Complete Storage, add injections etc.
    public static $inject = ['$http', '$q', 'config', 'shared', 'popup'];

    public static camelCase(name: string): string {
      return name.replace(/([\:\-\_]+(.))/g, (_, separator, letter, offset) => {
        return offset ? letter.toUpperCase() : letter;
      });
    }

    private $http: angular.IHttpService;
    private $q: angular.IQService;
    private config: Config;
    private shared: Shared;
    private popup: Popup;
    private provider: string;

    constructor($http: angular.IHttpService,
                $q: angular.IQService,
                config: Config,
                shared: Shared,
                popup: Popup) {
        this.$http = $http;
        this.$q = $q;
        this.config = config;
        this.shared = shared;
        this.popup = popup;
        this.provider = '';
    }

    public login(user: any): angular.IHttpPromise<any> {
        this.provider = user.provider;
        let config: any = this.config;
        return this.$q((resolve, reject) => {
            const { name, state, popupOptions, redirectUri, responseType } = config.providers[this.provider];
            const url = [config.providers[this.provider].authorizationEndpoint, this.buildQueryString()].join('?');

            this.popup.open(url, name, popupOptions, redirectUri)
                .then((oauth: any): void | angular.IPromise<any> | angular.IHttpPromise<any> => {
                    if (responseType === 'token' || !config.providers[this.provider].url) {
                        return resolve(oauth);
                    }
                    console.log(oauth);
                    resolve(this.exchangeForToken(oauth.code));
                }).catch((error) => reject(error));
        });

    }

    public exchangeForToken(code: string): angular.IHttpPromise<any> {
        // const payload = angular.extend({}, userData);
        let deferred = this.$q.defer();
        let payload: any = {};
        let config: any = this.config;

        angular.forEach(config.providers[this.provider].responseParams, (value, key) => {
            switch (key) {
                case 'code':
                    payload[value] = code;
                    break;
                case 'clientId':
                    payload[value] = config.clientId;
                    break;
                case 'redirectUri':
                    payload[value] = config.redirectUri;
                    break;
                default:
                    // TODO: Fix this
                    payload[value] = code;
            }
        });

        let exchangeForTokenUrl = config.baseUrl + config.providers[this.provider].url;

        this.$http.post(exchangeForTokenUrl, payload).then(
            (response: any) => {
                console.log('Success', response);
                this.shared.setToken(response);
                deferred.resolve(response);
            },
            (errorResponse: any) => {
                console.log(errorResponse);
                deferred.reject(errorResponse);
            }
        );

        return deferred.promise;
    }

    public buildQueryString(): string {
        const keyValuePairs: any = [];
        const urlParamsCategories: any = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];
        let config: any = this.config;

        angular.forEach(urlParamsCategories, (paramsCategory) => {
            angular.forEach(config.providers[this.provider][paramsCategory], (paramName) => {
                const camelizedName = SocialOAuth2.camelCase(paramName);
                let paramValue = angular.isFunction(config.providers[this.provider][paramName]) ?
                                 config.providers[this.provider][paramName]() :
                                 config.providers[this.provider][camelizedName];

                if (paramName === 'redirect_uri' && !paramValue) {
                    return;
                }

                if (paramName === 'scope' && Array.isArray(paramValue)) {
                    paramValue = paramValue.join(config.providers[this.provider].scopeDelimiter);
                    if (config.providers[this.provider].scopePrefix) {
                        paramValue = [config.providers[this.provider].scopePrefix, paramValue]
                                        .join(config.providers[this.provider].scopeDelimiter);
                    }
                }

                keyValuePairs.push([paramName, paramValue]);
            });
        });

        return keyValuePairs.map((pair: any) => pair.join('=')).join('&');
    }

}
