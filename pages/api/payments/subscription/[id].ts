import { NextApiRequest, NextApiResponse } from "next";

import { cancelSubscription } from "../../../../backend/billing";
import { auth, validateUser } from "../../../../backend/firebase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  next: Function
) {
  const { id } = req.query;
  if (req.method === "PATCH") {
    if (req.headers?.authorization?.startsWith("Bearer ")) {
      const idToken = req.headers.authorization.split("Bearer ")[1];

      try {
        // auth.verifyIdToken(idToken) will return current user's
        // auth record from firebase which contains uid, email, etc...
        const decodeToken = await auth.verifyIdToken(idToken);

        // setting the decodeToken as user property on the req
        req["currentUser"] = decodeToken;

        // Unsubscribe or cancel a subscription
        const user = validateUser(req);
        res.send(await cancelSubscription(user.uid, id as string));
      } catch (err) {
        console.log(err);
      }
    }
  }
}
