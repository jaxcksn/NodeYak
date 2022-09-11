/* eslint-disable functional/prefer-readonly-type */
/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-class */

import axios from "axios";
import dayjs from "dayjs";
import jwt_decode from "jwt-decode";


const YakBackend = axios.create({
    baseURL: "https://api.yikyak.com/graphql/",
    timeout: 1000,
    headers: {
        'User-Agent': 'YikYak/92 CFNetwork/1385 Darwin/22.0.0',
    }
})


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

type DecodedAuthToken = {
    iss: string;
    aud: string;
    auth_time: number;
    user_id: string;
    sub: string;
    iat: number;
    exp: number;
    phone_number: string;
    firebase: {
        identities: {
            phone: [number]
        }
    }
}

type TokenData = {
    expires_in: string;
    token_type: string;
    refresh_token: string;
    id_token: string;
    user_id: string;
    project_id: string;
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
    auth: YakAuthorization; 

    constructor(auth: YakAuthorization) {
        this.auth = auth;
    }

    /**
     * This checks to see if the authorization token is expired, and if so, it uses the refresh
     * token to get a new authorization token.
     */
    private async checkAuthorizationToken() {
        if(this.auth.authToken !== '') {
            const decodedToken: DecodedAuthToken = await jwt_decode(this.auth.authToken);
            const expiresAt = dayjs.unix(decodedToken.exp);

            if(!dayjs().isAfter(expiresAt)) {
              return;
            }
        }

        const tokenResponse = await axios.post('https://securetoken.googleapis.com/v1/token?key=AIzaSyCg5PmGOUQPAG_FeZQZ5O42xAIolkmSjaA',
        `refresh_token=${this.auth.refreshToken}&grant_type=refresh_token`,{
            headers: {
                'User-Agent': 'FirebaseAuth.iOS/9.0.0 com.yikyak.2/1.6.3 iPhone/16.0 hw/iPhone13_3',
                'x-ios-bundle-identifier': 'com.yikyak.2',
                'x-client-version': 'iOS/FirebaseSDK/9.0.0/FirebaseCore-iOS'
            }
        })

        const data: TokenData = tokenResponse.data;
        this.auth = {
            authToken: data.id_token,
            refreshToken: data.refresh_token
        }
        
        return;
    }

    /**
     * Post a new Yak
     * @param yak The yak to post.
     */
    async createYak(yak: Yak ) {
        try {
            await this.checkAuthorizationToken();
        } catch(e) {
            if(axios.isAxiosError(e)) {
                console.error(`Error using refresh token:\nERROR ${e.response.status}: ${e.response.statusText} - ${e.message}`);
            } else {
                console.error("An unexpected error occured while checking authorization:")
                console.error(e)
            }
            return;
        }

        try {
            const payload = {
                operationName: "CreateYak",
                query:
                  "mutation CreateYak($input: CreateYakInput!) {\n  createYak(input: $input) {\n    __typename\n    errors {\n      __typename\n      code\n      field\n      message\n    }\n    yak {\n      __typename\n      id\n      text\n      interestAreas\n      distance\n      userColor\n      secondaryUserColor\n      userEmoji\n    }\n  }\n}",
                variables: {
                  input: {
                    interestAreas: yak.locations,
                    isIncognito: yak.isIncognito,
                    point: `POINT(${yak.postedFrom.lat} ${yak.postedFrom.lon})`,
                    secondaryUserColor: yak.secondColor,
                    text: yak.text,
                    userColor: yak.firstColor,
                    userEmoji: yak.userEmoji,
                    videoId: '',
                  },
                }
            }

            const yakResponse = await YakBackend.post('', payload ,{
                headers: {
                    Authorization: this.auth.authToken,
                    'Content-Type': 'application/json',
                    Location: `POINT(${yak.postedFrom.lat} ${yak.postedFrom.lon})`,
                }
            });

            if(yakResponse.status === 200) {
                console.log('Successfully posted a new Yak.')
            }
           
        } catch(e) {
            console.error(e);
            return;
        }
        
    }
}


