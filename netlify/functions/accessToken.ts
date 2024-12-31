import { google } from "googleapis";

export default async (request: Request) => {
  const data = await request.json();
  const { code, clientId, clientSecret, env } = data;

  // Use the google auth to authenticate yourself against the server.
  const oauth = new google.auth.OAuth2(clientId, clientSecret, env);

  // Retrieve the tokens with the given code from the parameters
  const { tokens } = await oauth.getToken(code);

  // Very important to set the credentials or else Google will not know that
  // the permission was given.
  oauth.setCredentials(tokens);

  return new Response(JSON.stringify(tokens.access_token), { status: 200 });
};
