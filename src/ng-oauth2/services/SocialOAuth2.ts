import {ISocialOAuth2} from '../interfaces/ISocialOAuth2';

/**
 * Service that start the social aAuth2 authentication process
 */
export class SocialOAuth2 implements ISocialOAuth2 {
    // TODO: Complete Storage, add injections etc.

    constructor() {
        return;
    }
    public get(key: string): string {
        return 'hello';
    }

    public put(key: string, value: string) {
        return;
    }

    public clear(key: string) {
        return;
    }
}
