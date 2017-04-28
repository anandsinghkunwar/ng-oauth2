/**
 * Class for Default Constants of the Module
 */
export class Config {
    public static getConfig() {
        return new Config();
    }

    public baseUrl = 'http://localhost:3000';
    public loginMethod = 'POST';
    public loginUrl = '/login';
    public loginEventName = 'oauth2:login';
    public signupMethod = 'POST';
    public signupUrl = '/signup';
    public logoutUrl = '/logout';
    public logoutEventName = 'oauth2:logout';
    public storageType = 'localStorage';
    public tokenName = 'AccessToken';
    public refreshTokenName = 'RefreshToken';
    public tokenHeader = 'Authorization';
    public tokenType = 'Bearer';

    public providers = {
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
