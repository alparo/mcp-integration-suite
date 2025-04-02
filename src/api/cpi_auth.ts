import { DestinationAuthToken } from "@sap-cloud-sdk/connectivity";

let tokenCache: {
	token: DestinationAuthToken;
	expiresAt: number;
} | null = null;

// TODO: handle CSRF
export const getOAuthTokenCPI = async (): Promise<DestinationAuthToken> => {
    // Check if token is expired
    const now = Date.now();
    if (tokenCache && tokenCache.expiresAt > now + 5 * 60 * 1000) {
        return tokenCache.token;
    }
;
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.CPI_OAUTH_CLIENT_ID as string);
    params.append("client_secret", process.env.CPI_OAUTH_CLIENT_SECRET as string);

    const response = await fetch(process.env.CPI_OAUTH_TOKEN_URL as string, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
    });

    if (!response.ok) {
        throw new Error(
            `OAuth Token Fehler: ${response.status} ${response.statusText}`
        );
    }

    const data = await response.json();

    // create token
    const token = {
        value: data.access_token,
        type: data.token_type,
        expiresIn: data.expires_in,
        http_header: {
            key: "Authorization",
            value: `Bearer ${data.access_token}`,
        },
        error: null,
    };

    // save token to cache
    tokenCache = {
        token,
        expiresAt: now + data.expires_in * 1000,
    };

    return token;
};