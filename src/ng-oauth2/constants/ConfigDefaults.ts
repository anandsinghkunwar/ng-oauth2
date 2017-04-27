/**
 * Class for Default Constants of the Module
 */
export class Config {
    public static getConfig() {
        return new Config();
    }

    public loginUrl = '/auth/login';
    public signupUrl = '/auth/signup';
    public unlinkUrl = '/auth/unlink/';
    public storageType = 'localStorage';
    public tokenName = 'AccessToken';
    public tokenHeader = 'Authorization';
    public tokenType = 'Bearer';

}
