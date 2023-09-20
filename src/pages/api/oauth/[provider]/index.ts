import grant from "grant";
import { NextApiRequest, NextApiResponse } from "next";
import { getEnvironmentWebsiteUrl } from "../../../../utils";

export const grantConfig = {
  defaults: {
    origin: getEnvironmentWebsiteUrl(),
    prefix: "/api/oauth",
    transport: "state",
    response: ["tokens", "raw", "jwt", "profile"],
  },
  google: {
    key: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    scope: [
      "openid",
      "email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    nonce: true,
    prompt: "consent",
    custom_params: { access_type: "offline" },
    callback: `${getEnvironmentWebsiteUrl()}/api/oauth/google/callback`,
  },
};

const grantInstance = grant.vercel({
  config: grantConfig,
  session: { secret: "grant" },
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await grantInstance(req, res);
};

export default handler;
