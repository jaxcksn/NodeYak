/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */


/**
 * Contains the authorization required for making calls to the YikYak API.
 * 
 * @param authToken - The authorization token used by YikYak
 * @param refreshToken - The refresh token for getting a new Auth Token.
 * 
 * @remarks
 * The authorization token is directly linked to the account you are going to be posting to the API from.
 * 
 */
export type YakAuthorization = {
    /** The authorization token used by YikYak. You can leave this blank if you just have a refresh token. */
    authToken: string;
    /** The refresh token for getting a new Auth Token. */
    refreshToken: string;
};

/**
 * Represents a geographic point to post a yikyak from.
 */
export type GeographicPoint = {
    /** The latitude of the point */
    lat: number;
    /** The longitude of the point */
    lon: number;
}


/**
 * Represents the contents of a Yak to post.
 * 
 * @param text - The textual content of the Yak
 * @param userEmoji - The emoji to use as the poster.
 * @param isIncognito - Should the users emoji be shown on the Yak?
 * @param firstColor - The first color of the gradient behind the user emoji. As a hex code.
 * @param secondColor - The second color of the gradient behind the user emoji. As a hex code.
 * @param postedFrom - The geographic point to which the Yak is posted.
 * @param locations - The names of the locations the Yak is posted near.
 */
export type Yak = {
    /** The textual content of the Yak
     * @remarks
     * This currently has a limit of 200 characters per post.
     */
    text: string;
    /** The emoji to use as the poster. */
    userEmoji: string;
    /** Should the users emoji be shown on the Yak? */
    isIncognito: boolean;
    /** The first color of the gradient behind the user emoji. As a hex code. */
    firstColor: string;
    /** The second color of the gradient behind the user emoji. As a hex code. */
    secondColor: string;
    /** The geographic point to which the Yak is posted. */
    postedFrom: GeographicPoint;
    /** 
     * The names of the locations the Yak is posted near. 
     * @remarks
     * This isn't very well documented, so I normally just do the city + state to post to.
     * For example: "Houston, TX" or "Boston, MA"
     */
    locations: [string];

}


export class NodeYak {
    /** 
     * The authorization to use when posting to the API.
     */
    readonly auth: YakAuthorization; 

    constructor(auth: YakAuthorization) {
        this.auth = auth;
    }


    createYak(yak: Yak ) {
        console.log(yak.text)
    }
}


