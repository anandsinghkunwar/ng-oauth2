(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConfigDefaults_1 = require("./ng-oauth2/constants/ConfigDefaults");
var OAuth2Provider_1 = require("./ng-oauth2/providers/OAuth2Provider");
var HttpInterceptor_1 = require("./ng-oauth2/services/HttpInterceptor");
var OAuth2_1 = require("./ng-oauth2/services/OAuth2");
var Popup_1 = require("./ng-oauth2/services/Popup");
var Shared_1 = require("./ng-oauth2/services/Shared");
var Storage_1 = require("./ng-oauth2/services/Storage");
/**
 * The main ng-oauth2 app module.
 *
 */
var lib = angular.module('ngOAuth2', [])
    .provider('$oauth2', ['config', function (config) { return new OAuth2Provider_1.OAuth2Provider(config); }])
    .constant('config', ConfigDefaults_1.Config.getConfig())
    .service('popup', Popup_1.Popup)
    .service('shared', Shared_1.Shared)
    .service('main', OAuth2_1.OAuth2)
    .service('storage', Storage_1.Storage)
    .service('httpInterceptor', HttpInterceptor_1.HttpInterceptor)
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push(HttpInterceptor_1.HttpInterceptor.Factory);
    }]);

},{"./ng-oauth2/constants/ConfigDefaults":2,"./ng-oauth2/providers/OAuth2Provider":3,"./ng-oauth2/services/HttpInterceptor":4,"./ng-oauth2/services/OAuth2":6,"./ng-oauth2/services/Popup":7,"./ng-oauth2/services/Shared":8,"./ng-oauth2/services/Storage":10}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class for Default Constants of the Module
 */
var Config = (function () {
    function Config() {
        this.baseUrl = 'http://localhost:3000';
        this.loginMethod = 'POST';
        this.loginUrl = '/login';
        this.loginEventName = 'oauth2:login';
        this.signupMethod = 'POST';
        this.signupUrl = '/signup';
        this.logoutUrl = '/logout';
        this.logoutEventName = 'oauth2:logout';
        this.storageType = 'localStorage';
        this.tokenName = 'AccessToken';
        this.refreshTokenName = 'RefreshToken';
        this.tokenHeader = 'Authorization';
        this.tokenType = 'Bearer';
        this.providers = {
            facebook: {
                name: 'facebook',
                url: '/auth/facebook',
                authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
                redirectUri: window.location.origin + '/',
                requiredUrlParams: ['display', 'scope', 'app_id', 'redirect_uri'],
                responseParams: ['code'],
                scope: ['email'],
                scopeDelimiter: ',',
                display: 'popup',
                oauthType: '2.0',
                popupOptions: { width: 580, height: 400 }
            },
            google: {
                name: 'google',
                url: '/auth/google',
                authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
                redirectUri: window.location.origin,
                requiredUrlParams: ['scope', 'response_type'],
                optionalUrlParams: ['display', 'state', 'client_id', 'redirect_uri'],
                responseParams: ['code'],
                scope: ['profile', 'email'],
                scopePrefix: 'openid',
                scopeDelimiter: ' ',
                display: 'popup',
                oauthType: '2.0',
                responseType: 'token',
                popupOptions: { width: 452, height: 633 }
            }
        };
    }
    Config.getConfig = function () {
        return new Config();
    };
    return Config;
}());
exports.Config = Config;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Service Provider for Configurations of the Module
 */
var OAuth2Provider = (function () {
    function OAuth2Provider(config) {
        this.config = config;
    }
    OAuth2Provider.prototype.configure = function (config) {
        angular.extend(this.config, config);
    };
    OAuth2Provider.prototype.configureFacebook = function (config) {
        angular.extend(this.config.providers.facebook, config);
    };
    OAuth2Provider.prototype.configureGoogle = function (config) {
        angular.extend(this.config.providers.google, config);
    };
    OAuth2Provider.prototype.$get = function (main) {
        return {
            login: function (type, user) { return main.login(type, user); },
            logout: function () {
                console.log('In Logout');
            }
        };
    };
    return OAuth2Provider;
}());
OAuth2Provider.$inject = ['config'];
exports.OAuth2Provider = OAuth2Provider;
OAuth2Provider.prototype.$get.$inject = ['main'];

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Services that intercepts HTTP/s requests and adds the header field in them
 */
var HttpInterceptor = (function () {
    function HttpInterceptor(storage, config) {
        var _this = this;
        /**
         * For modifying outgoing requests to the server
         */
        // TODO: Investigate if public/private/protected
        this.request = function (config) {
            var configCopy = config;
            if (configCopy['token'] === false ||
                _this.storage.isSet(_this.config.tokenName) === false) {
                return config;
            }
            config.headers[_this.config.tokenHeader] = _this.config.tokenType
                + ' '
                + _this.storage.get(_this.config.tokenName);
            return config;
        };
        this.storage = storage;
        this.config = config;
    }
    HttpInterceptor.Factory = function (storage, config) {
        return new HttpInterceptor(storage, config);
    };
    return HttpInterceptor;
}());
HttpInterceptor.$inject = ['storage'];
exports.HttpInterceptor = HttpInterceptor;
HttpInterceptor.Factory.$inject = ['storage', 'config'];

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Service that start the local oAuth2 authentication process
 */
var LocalOAuth2 = (function () {
    function LocalOAuth2($http, $q, config, shared) {
        this.$http = $http;
        this.$q = $q;
        this.config = config;
        this.shared = shared;
    }
    LocalOAuth2.prototype.login = function (user) {
        var _this = this;
        var deferred = this.$q.defer();
        var httpOptions = {};
        httpOptions.url = this.config.baseUrl + this.config.loginUrl;
        httpOptions.data = user;
        httpOptions.method = this.config.loginMethod;
        this.$http(httpOptions).then(function (response) {
            _this.shared.setToken(response);
            deferred.resolve(response);
        }, function (errorResponse) {
            deferred.reject(errorResponse);
        });
        return deferred.promise;
    };
    LocalOAuth2.prototype.signup = function (user) {
        var _this = this;
        var httpOptions = {};
        httpOptions.url = this.config.baseUrl + this.config.signupUrl;
        httpOptions.data = user;
        httpOptions.method = this.config.signupMethod;
        // TODO: Repair this maybe
        return this.$http(httpOptions).then(function (response) {
            _this.shared.setToken(response);
            return response;
        });
    };
    return LocalOAuth2;
}());
// TODO: Complete Storage, add injections etc.
LocalOAuth2.$inject = ['$http', '$q', 'config', 'shared'];
exports.LocalOAuth2 = LocalOAuth2;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LocalOAuth2_1 = require("./LocalOAuth2");
var SocialOAuth2_1 = require("./SocialOAuth2");
/**
 * Service that start the oAuth2 authentication process
 */
var OAuth2 = (function () {
    function OAuth2($q, $http, config, shared, popup) {
        this.$q = $q;
        this.$http = $http;
        this.config = config;
        this.shared = shared;
        this.popup = popup;
    }
    OAuth2.prototype.login = function (type, user) {
        var deferred = this.$q.defer();
        var provider = null;
        switch (type) {
            // TODO: Is there a better way to do this?
            case 'social':
                provider = new SocialOAuth2_1.SocialOAuth2(this.$http, this.$q, this.config, this.shared, this.popup);
                break;
            case 'local':
                provider = new LocalOAuth2_1.LocalOAuth2(this.$http, this.$q, this.config, this.shared);
                break;
            default:
                throw 'Not Known Type of Login';
        }
        provider.login(user)
            .then(function (response) {
            deferred.resolve(response);
        }, function (errorResponse) {
            // TODO: Add event broadcasts
            deferred.reject();
        });
        return deferred.promise;
    };
    return OAuth2;
}());
// TODO: Complete Storage, add injections etc.
OAuth2.$inject = ['$q', '$http', 'config', 'shared', 'popup'];
exports.OAuth2 = OAuth2;

},{"./LocalOAuth2":5,"./SocialOAuth2":9}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Totally Taken from sahat's satellizer
 */
function getFullUrlPath(location) {
    var isHttps = location.protocol === 'https:';
    return location.protocol + '//' + location.hostname +
        ':' + (location.port || (isHttps ? '443' : '80')) +
        (/^\//.test(location.pathname) ? location.pathname : '/' + location.pathname);
}
exports.getFullUrlPath = getFullUrlPath;
function parseQueryString(str) {
    var obj = {};
    var key;
    var value;
    angular.forEach((str || '').split('&'), function (keyValue) {
        if (keyValue) {
            value = keyValue.split('=');
            key = decodeURIComponent(value[0]);
            obj[key] = angular.isDefined(value[1]) ? decodeURIComponent(value[1]) : true;
        }
    });
    return obj;
}
exports.parseQueryString = parseQueryString;
var Popup = (function () {
    // private defaults: { redirectUri: string };
    function Popup($interval, $window, $q) {
        this.$interval = $interval;
        this.$window = $window;
        this.$q = $q;
        this.popup = null;
        // this.defaults = {redirectUri: null};
        // this.defaults.redirectUri = null;
    }
    Popup.prototype.stringifyOptions = function (options) {
        var parts = [];
        angular.forEach(options, function (value, key) {
            parts.push(key + '=' + value);
        });
        return parts.join(',');
    };
    Popup.prototype.open = function (url, name, popupOptions, redirectUri, dontPoll) {
        var width = popupOptions.width || 500;
        var height = popupOptions.height || 500;
        var options = this.stringifyOptions({
            width: popupOptions.width || 500,
            height: popupOptions.height || 500,
            top: this.$window.screenY + ((this.$window.outerHeight - height) / 2.5),
            left: this.$window.screenX + ((this.$window.outerWidth - width) / 2)
        });
        var popupName = this.$window['cordova'] ||
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
        }
        else {
            if (url === 'about:blank') {
                this.popup.location = url;
            }
            return this.polling(redirectUri);
        }
    };
    Popup.prototype.polling = function (redirectUri) {
        var _this = this;
        return this.$q(function (resolve, reject) {
            var redirectUriParser = document.createElement('a');
            redirectUriParser.href = redirectUri;
            var redirectUriPath = getFullUrlPath(redirectUriParser);
            var polling = _this.$interval(function () {
                if (!_this.popup || _this.popup.closed || _this.popup.closed === undefined) {
                    _this.$interval.cancel(polling);
                    reject(new Error('The popup window was closed'));
                }
                try {
                    var popupWindowPath = getFullUrlPath(_this.popup.location);
                    if (popupWindowPath === redirectUriPath) {
                        if (_this.popup.location.search || _this.popup.location.hash) {
                            var query = parseQueryString(_this.popup.location.search.substring(1).replace(/\/$/, ''));
                            var hash = parseQueryString(_this.popup.location.hash.substring(1).replace(/[\/$]/, ''));
                            var params = angular.extend({}, query, hash);
                            if (params.error) {
                                reject(new Error(params.error));
                            }
                            else {
                                resolve(params);
                            }
                        }
                        else {
                            reject(new Error('OAuth redirect has occurred but no query or hash parameters were found. ' +
                                'They were either not set during the redirect, or were removed—typically by a ' +
                                'routing library—before Satellizer could read it.'));
                        }
                        _this.$interval.cancel(polling);
                        _this.popup.close();
                    }
                }
                catch (error) {
                    // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
                    // A hack to get around same-origin security policy errors in IE.
                }
            }, 500);
        });
    };
    Popup.prototype.eventListener = function (redirectUri) {
        var _this = this;
        return this.$q(function (resolve, reject) {
            _this.popup.addEventListener('loadstart', function (event) {
                if (event.url.indexOf(redirectUri) !== 0) {
                    return;
                }
                var parser = document.createElement('a');
                parser.href = event.url;
                if (parser.search || parser.hash) {
                    var query = parseQueryString(parser.search.substring(1).replace(/\/$/, ''));
                    var hash = parseQueryString(parser.hash.substring(1).replace(/[\/$]/, ''));
                    var params = angular.extend({}, query, hash);
                    if (params.error) {
                        reject(new Error(params.error));
                    }
                    else {
                        resolve(params);
                    }
                    _this.popup.close();
                }
            });
            _this.popup.addEventListener('loaderror', function () {
                reject(new Error('Authorization failed'));
            });
            _this.popup.addEventListener('exit', function () {
                reject(new Error('The popup window was closed'));
            });
        });
    };
    return Popup;
}());
Popup.$inject = ['$interval', '$window', '$q'];
exports.Popup = Popup;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Shared = (function () {
    function Shared($rootScope, config, storage) {
        this.$rootScope = $rootScope;
        this.config = config;
        this.storage = storage;
    }
    Shared.prototype.setToken = function (response) {
        var broadcast = false;
        if ('access_token' in response.data) {
            if (this.storage.isSet(this.config.tokenName) === false) {
                broadcast = true;
            }
            this.storage.put(this.config.tokenName, response.data['access_token']);
        }
        if ('refresh_token' in response.data) {
            this.storage.put(this.config.refreshTokenName, response.data['refresh_token']);
        }
        if (broadcast === true) {
            this.$rootScope.$broadcast(this.config.loginEventName);
        }
    };
    Shared.prototype.unsetToken = function () {
        var broadcast = false;
        // FIXME: Hack maybe
        if (this.storage.isSet(this.config.tokenName) === true) {
            this.storage.clear(this.config.tokenName);
            broadcast = true;
        }
        if (this.storage.isSet(this.config.refreshTokenName) === true) {
            this.storage.clear(this.config.tokenName);
        }
        if (broadcast === true) {
            this.$rootScope.$broadcast(this.config.logoutEventName);
        }
    };
    return Shared;
}());
exports.Shared = Shared;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Service that start the social aAuth2 authentication process
 */
var SocialOAuth2 = (function () {
    function SocialOAuth2($http, $q, config, shared, popup) {
        this.$http = $http;
        this.$q = $q;
        this.config = config;
        this.shared = shared;
        this.popup = popup;
        this.provider = '';
    }
    SocialOAuth2.camelCase = function (name) {
        return name.replace(/([\:\-\_]+(.))/g, function (_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        });
    };
    SocialOAuth2.prototype.login = function (user) {
        var _this = this;
        this.provider = user.provider;
        var config = this.config;
        return this.$q(function (resolve, reject) {
            var _a = config.providers[_this.provider], name = _a.name, state = _a.state, popupOptions = _a.popupOptions, redirectUri = _a.redirectUri, responseType = _a.responseType;
            var url = [config.providers[_this.provider].authorizationEndpoint, _this.buildQueryString()].join('?');
            _this.popup.open(url, name, popupOptions, redirectUri)
                .then(function (oauth) {
                if (responseType === 'token' || !config.providers[_this.provider].url) {
                    return resolve(oauth);
                }
                console.log(oauth);
                resolve(_this.exchangeForToken(oauth.code));
            }).catch(function (error) { return reject(error); });
        });
    };
    SocialOAuth2.prototype.exchangeForToken = function (code) {
        var _this = this;
        // const payload = angular.extend({}, userData);
        var deferred = this.$q.defer();
        var payload = {};
        var config = this.config;
        angular.forEach(config.providers[this.provider].responseParams, function (value, key) {
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
        var exchangeForTokenUrl = config.baseUrl + config.providers[this.provider].url;
        this.$http.post(exchangeForTokenUrl, payload).then(function (response) {
            console.log('Success', response);
            _this.shared.setToken(response);
            deferred.resolve(response);
        }, function (errorResponse) {
            console.log(errorResponse);
            deferred.reject(errorResponse);
        });
        return deferred.promise;
    };
    SocialOAuth2.prototype.buildQueryString = function () {
        var _this = this;
        var keyValuePairs = [];
        var urlParamsCategories = ['defaultUrlParams', 'requiredUrlParams', 'optionalUrlParams'];
        var config = this.config;
        angular.forEach(urlParamsCategories, function (paramsCategory) {
            angular.forEach(config.providers[_this.provider][paramsCategory], function (paramName) {
                var camelizedName = SocialOAuth2.camelCase(paramName);
                var paramValue = angular.isFunction(config.providers[_this.provider][paramName]) ?
                    config.providers[_this.provider][paramName]() :
                    config.providers[_this.provider][camelizedName];
                if (paramName === 'redirect_uri' && !paramValue) {
                    return;
                }
                if (paramName === 'scope' && Array.isArray(paramValue)) {
                    paramValue = paramValue.join(config.providers[_this.provider].scopeDelimiter);
                    if (config.providers[_this.provider].scopePrefix) {
                        paramValue = [config.providers[_this.provider].scopePrefix, paramValue]
                            .join(config.providers[_this.provider].scopeDelimiter);
                    }
                }
                keyValuePairs.push([paramName, paramValue]);
            });
        });
        return keyValuePairs.map(function (pair) { return pair.join('='); }).join('&');
    };
    return SocialOAuth2;
}());
// TODO: Complete Storage, add injections etc.
SocialOAuth2.$inject = ['$http', '$q', 'config', 'shared', 'popup'];
exports.SocialOAuth2 = SocialOAuth2;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Services that persists and retrieves TODOs from localStorage.
 */
var Storage = (function () {
    function Storage($window, config) {
        this.config = config;
        this.$window = $window;
        console.log(this.config);
        if (this.config.storageType !== 'localStorage' &&
            this.config.storageType !== 'sessionStorage') {
            throw 'Error due to invalid storage type(1)';
        }
    }
    Storage.prototype.get = function (key) {
        var storage = null;
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
    };
    Storage.prototype.put = function (key, value) {
        var storage = null;
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
    };
    Storage.prototype.isSet = function (key) {
        var storage = null;
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
    };
    Storage.prototype.clear = function (key) {
        var storage = null;
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
    };
    return Storage;
}());
// TODO: Complete Storage, add injections etc.
Storage.$inject = ['$window', 'config'];
exports.Storage = Storage;

},{}]},{},[1]);
