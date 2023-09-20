import { NextApiRequest, NextApiResponse } from "next";
import { getEnvironmentServerUrl } from "../../utils";
import { getCookie } from "cookies-next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // redirect if not logged in
    if (!req.headers.authorization.replace("Bearer ", ""))
      return res.status(401).send({ error: `Unauthenticated user.` });

    // if they have cookie, log them in
    const getSession = await fetch(`${getEnvironmentServerUrl()}/session`, {
      headers: { Authorization: `Bearer ${getCookie("jwt", { req, res })}` },
    });

    const session = await getSession.json();

    if (session.error) {
      let err = new Error();
      err.message = session.message;
      // @ts-expect-error
      err.status = session.statusCode;
      throw err;
    }

    return res.send(session);
  } catch (err) {
    return res.status(err.status).send(err);
  }
};
export default handler;
