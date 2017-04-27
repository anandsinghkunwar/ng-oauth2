export interface ISocialOAuth2 {
    login(user: any): angular.IHttpPromise<any>;
}
