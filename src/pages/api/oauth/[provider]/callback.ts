import grant from "grant";
import { setCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";

import { grantConfig } from ".";
import { getEnvironmentServerUrl } from "../../../../utils";

const grantInstance = grant.vercel({
  config: grantConfig,
  session: { secret: "grant" },
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // create session
    const response = await grantInstance(req, res);

    const {
      profile: { name, email, picture },
    } = response.response;

    //
    const loginWithGoogle = await fetch(
      `${getEnvironmentServerUrl()}/loginWithGoogle`,
      {
        method: "POST",
        body: JSON.stringify({ name, email, picture }),
      }
    );
    const { jwt, firstTimeSignIn } = await loginWithGoogle.json();

    // maxAge is in seconds
    setCookie("jwt", jwt, { req, res, maxAge: 60 * 60 * 24 });

    return res.redirect(firstTimeSignIn ? `/onboarding` : `/models`);
  } catch (err) {
    throw {
      error: `${err.message}. IF YOU SEE THIS ERROR, PLEASE EMAIL THE DEVELOPER ABOUT IT (youssef.elmahallawy01@gmail.com)`,
    };
  }
};

export default handler;
//
