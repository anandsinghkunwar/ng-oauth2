import {ILocalOAuth2} from '../interfaces/ILocalOAuth2';

/**
 * Service that start the social aAuth2 authentication process
 */
export class LocalOAuth2 implements ILocalOAuth2 {
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
