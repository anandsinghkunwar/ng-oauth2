export interface ILocalOAuth2 {

    login(user: any): angular.IHttpPromise<any>;

    signup(user: any): angular.IHttpPromise<any>;
}
