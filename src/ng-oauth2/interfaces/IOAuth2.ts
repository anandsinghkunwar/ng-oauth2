export interface IOAuth2 {
    login(type: string, user: any): ng.IPromise<{}>;
}
