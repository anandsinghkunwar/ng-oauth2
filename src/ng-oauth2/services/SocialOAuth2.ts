import {ISocialOAuth2} from '../interfaces/ISocialOAuth2';

/**
 * Service that start the social aAuth2 authentication process
 */
export class SocialOAuth2 implements ISocialOAuth2 {
    // TODO: Complete Storage, add injections etc.
    public static $inject = ['$http'];

    private $http: angular.IHttpService;

    constructor($http: angular.IHttpService) {
        this.$http = $http;
    }

    public login(user: any): angular.IHttpPromise<any> {
        return this.$http({method: 'GET', url: '/'});
    }
}
