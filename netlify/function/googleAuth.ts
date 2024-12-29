import { google } from "googleapis";

export default async (request: Request) => {
  // The request contains the authData we defined earlier in the component.
  const data = await request.json();
  const { clientId, scopes, clientSecret, env } = data;
  //

  // Pass your credentials and the respective redirect URI.
  // Notice that if you are testing in dev, it will work with the localhost
  // and when used in prod, the site's URL will be used.
  const oauth = new google.auth.OAuth2(clientId, clientSecret, env);
  const url = oauth.generateAuthUrl({
    scope: scopes,
  });

  return new Response(JSON.stringify(url), { status: 200 });
};
