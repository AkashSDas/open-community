import { NextApiRequest, NextApiResponse } from "next";

import { createSubscription, listSubscriptions } from "../../../../backend/billing";
import { auth, decodeJWT, runAsync, validateUser } from "../../../../backend/firebase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  next: Function
) {
  if (req.method === "POST") {
    if (req.headers?.authorization?.startsWith("Bearer ")) {
      const idToken = req.headers.authorization.split("Bearer ")[1];

      try {
        // auth.verifyIdToken(idToken) will return current user's
        // auth record from firebase which contains uid, email, etc...
        const decodeToken = await auth.verifyIdToken(idToken);

        // setting the decodeToken as user property on the req
        req["currentUser"] = decodeToken;

        const user = validateUser(req);
        const { plan, payment_method } = req.body;
        const subscription = await createSubscription(
          user.uid,
          plan,
          payment_method
        );
        res.send(subscription);
      } catch (err) {
        console.log(err);
      }
    }
  } else if (req.method === "GET") {
    if (req.headers?.authorization?.startsWith("Bearer ")) {
      const idToken = req.headers.authorization.split("Bearer ")[1];

      try {
        // auth.verifyIdToken(idToken) will return current user's
        // auth record from firebase which contains uid, email, etc...
        const decodeToken = await auth.verifyIdToken(idToken);

        // setting the decodeToken as user property on the req
        req["currentUser"] = decodeToken;

        const user = validateUser(req);
        const subscriptions = await listSubscriptions(user.uid);
        res.send(subscriptions.data);
      } catch (err) {
        console.log(err);
      }
    }
  }
}
