/**
 * Totally Taken from sahat's satellizer
 */
export function getFullUrlPath(location: any) {
    const isHttps = location.protocol === 'https:';
    return location.protocol + '//' + location.hostname +
        ':' + (location.port || (isHttps ? '443' : '80')) +
        (/^\//.test(location.pathname) ? location.pathname : '/' + location.pathname);
}

export function parseQueryString(str: string) {
    let obj: any = {};
    let key;
    let value;
    angular.forEach((str || '').split('&'), (keyValue) => {
        if (keyValue) {
            value = keyValue.split('=');
            key = decodeURIComponent(value[0]);
            obj[key] = angular.isDefined(value[1]) ? decodeURIComponent(value[1]) : true;
        }
    });
    return obj;
}

export interface IPopup {
    open(url: string, name: string, popupOptions: { width: number, height: number }, redirectUri: string): void;
    stringifyOptions(options: any): string;
    polling(redirectUri: string): angular.IPromise<any>;
    eventListener(redirectUri: string): angular.IPromise<any>;
}

export class Popup implements IPopup {
    public static $inject = ['$interval', '$window', '$q'];

    public popup: any;
    private url: string;
    // private defaults: { redirectUri: string };

    constructor(private $interval: angular.IIntervalService,
                private $window: angular.IWindowService,
                private $q: angular.IQService) {
        this.popup = null;
        // this.defaults = {redirectUri: null};
        // this.defaults.redirectUri = null;
    }

    public stringifyOptions(options: any): string {
        let parts: any = [];
        angular.forEach(options, (value, key) => {
            parts.push(key + '=' + value);
        });
        return parts.join(',');
    }

    public open(url: string,
                name: string,
                popupOptions: { width: number, height: number },
                redirectUri: string,
                dontPoll?: boolean): angular.IPromise<any> {
        let width: number = popupOptions.width || 500;
        let height: number = popupOptions.height || 500;

        const options = this.stringifyOptions({
            width: popupOptions.width || 500,
            height: popupOptions.height || 500,
            top: this.$window.screenY + ((this.$window.outerHeight - height) / 2.5),
            left: this.$window.screenX + ((this.$window.outerWidth - width) / 2)
        });

        const popupName = this.$window['cordova'] ||
                          this.$window.navigator.userAgent.indexOf('CriOS') > -1 ? '_blank' : name;

        this.popup = this.$window.open(url, popupName, options);

        if (this.popup && this.popup.focus) {
            this.popup.focus();
        }

        if (dontPoll) {
            return;
        }

        if (this.$window['cordova']) {
            return this.eventListener(redirectUri);
        } else {
            if (url === 'about:blank') {
                this.popup.location = url;
            }
            return this.polling(redirectUri);
        }

    }

    public polling(redirectUri: string): angular.IPromise<any> {
        return this.$q((resolve, reject) => {
            const redirectUriParser = document.createElement('a');
            redirectUriParser.href = redirectUri;
            const redirectUriPath = getFullUrlPath(redirectUriParser);

            const polling = this.$interval(() => {
                if (!this.popup || this.popup.closed || this.popup.closed === undefined) {
                    this.$interval.cancel(polling);
                    reject(new Error('The popup window was closed'));
                }

                try {
                    const popupWindowPath = getFullUrlPath(this.popup.location);

                    if (popupWindowPath === redirectUriPath) {
                        if (this.popup.location.search || this.popup.location.hash) {
                            const query = parseQueryString(this.popup.location.search.substring(1).replace(/\/$/, ''));
                            const hash = parseQueryString(this.popup.location.hash.substring(1).replace(/[\/$]/, ''));
                            const params = angular.extend({}, query, hash);

                            if (params.error) {
                                reject(new Error(params.error));
                            } else {
                                resolve(params);
                            }
                        } else {
                            reject(new Error(
                                'OAuth redirect has occurred but no query or hash parameters were found. ' +
                                'They were either not set during the redirect, or were removed—typically by a ' +
                                'routing library—before Satellizer could read it.'
                            ));
                        }

                        this.$interval.cancel(polling);
                        this.popup.close();
                    }
                } catch (error) {
                    // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
                    // A hack to get around same-origin security policy errors in IE.
                }
            }, 500);
        });
    }

    public eventListener(redirectUri: any): angular.IPromise<any> {
        return this.$q((resolve, reject) => {
            this.popup.addEventListener('loadstart', (event: any) => {
                if (event.url.indexOf(redirectUri) !== 0) {
                    return;
                }

                const parser = document.createElement('a');
                parser.href = event.url;

                if (parser.search || parser.hash) {
                    const query = parseQueryString(parser.search.substring(1).replace(/\/$/, ''));
                    const hash = parseQueryString(parser.hash.substring(1).replace(/[\/$]/, ''));
                    const params = angular.extend({}, query, hash);

                    if (params.error) {
                        reject(new Error(params.error));
                    } else {
                        resolve(params);
                    }

                    this.popup.close();
                }
            });

            this.popup.addEventListener('loaderror', () => {
                reject(new Error('Authorization failed'));
            });

            this.popup.addEventListener('exit', () => {
                reject(new Error('The popup window was closed'));
            });
        });
    }
}
