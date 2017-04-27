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
}
