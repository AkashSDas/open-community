import { NextApiRequest, NextApiResponse } from "next";

import { createSubscription } from "../../../backend/billing";
import { createSetupIntent, listPaymentMethods } from "../../../backend/customers";
import { auth, validateUser } from "../../../backend/firebase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  next: Function
) {
  if (req.method === "POST") {
    // Save a card on the customer record with a SetupIntent
    if (req.headers?.authorization?.startsWith("Bearer ")) {
      const idToken = req.headers.authorization.split("Bearer ")[1];

      try {
        // auth.verifyIdToken(idToken) will return current user's
        // auth record from firebase which contains uid, email, etc...
        const decodeToken = await auth.verifyIdToken(idToken);

        // setting the decodeToken as user property on the req
        req["currentUser"] = decodeToken;

        const user = validateUser(req);
        const setupIntent = await createSetupIntent(user.uid);
        res.send(setupIntent);
      } catch (err) {
        console.log(err);
      }
    }
  } else if (req.method === "GET") {
    // Retrieve all cards attached to a customer
    if (req.headers?.authorization?.startsWith("Bearer ")) {
      const idToken = req.headers.authorization.split("Bearer ")[1];

      try {
        // auth.verifyIdToken(idToken) will return current user's
        // auth record from firebase which contains uid, email, etc...
        const decodeToken = await auth.verifyIdToken(idToken);

        // setting the decodeToken as user property on the req
        req["currentUser"] = decodeToken;

        const user = validateUser(req);
        const wallet = await listPaymentMethods(user.uid);
        res.send(wallet.data);
      } catch (err) {
        console.log(err);
      }
    }
  }
}
