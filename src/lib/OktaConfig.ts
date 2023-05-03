export const OktaConfig = {
    clientId: "0oa96xwubvWP38hOP5d7",
    issuer: "https://dev-35898807.okta.com/oauth2/default",
    redirectUri: "http://localhost:3000/login/callback",
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
}