import {
	setTestDestination,
	getTestDestinationByAlias,
} from "@sap-cloud-sdk/test-util";
import {
	HttpDestinationOrFetchOptions,
	retrieveJwt,
	DestinationAuthToken,
} from "@sap-cloud-sdk/connectivity";
import "dotenv/config";

const destName = "TESTINATION";

// Cache für das Token
let tokenCache: {
	token: DestinationAuthToken;
	expiresAt: number;
} | null = null;

const getOAuthToken = async (): Promise<DestinationAuthToken> => {
	// Prüfen, ob ein gültiges Token im Cache ist (mit 5 Minuten Puffer)
	const now = Date.now();
	if (tokenCache && tokenCache.expiresAt > now + 5 * 60 * 1000) {
		return tokenCache.token;
	}
;
	const params = new URLSearchParams();
	params.append("grant_type", "client_credentials");
	params.append("client_id", process.env.OAUTH_CLIENT_ID as string);
	params.append("client_secret", process.env.OAUTH_CLIENT_SECRET as string);

	const response = await fetch(process.env.OAUTH_TOKEN_URL as string, {
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

	// Token erstellen
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

	// Token im Cache speichern
	tokenCache = {
		token,
		expiresAt: now + data.expires_in * 1000,
	};

	return token;
};

export const getCurrentDestionation =
	async (): Promise<HttpDestinationOrFetchOptions> => {
		return {
			authentication: "OAuth2ClientCredentials",
			isTrustingAllCertificates: false,
			url: process.env.API_BASE_URL as string,
			authTokens: [await getOAuthToken()],
		};
	};
