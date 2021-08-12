import { NextApiRequest, NextApiResponse } from "next";

import { auth, validateUser } from "../../../backend/firebase";
import { createPaymentIntentAndCharge } from "../../../backend/payments";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  next: Function
) {
  if (req.method === "POST") {
    // Charging the user for one time membership

    if (req.headers?.authorization?.startsWith("Bearer ")) {
      const idToken = req.headers.authorization.split("Bearer ")[1];

      try {
        // auth.verifyIdToken(idToken) will return current user's
        // auth record from firebase which contains uid, email, etc...
        const decodeToken = await auth.verifyIdToken(idToken);

        // setting the decodeToken as user property on the req
        req["currentUser"] = decodeToken;

        const user = validateUser(req);
        const { plan, payment_method, amount, userId, receipt_email } =
          req.body;

        const paymentIntent = await createPaymentIntentAndCharge(
          amount,
          userId,
          payment_method,
          receipt_email,
          plan
        );
        res.send(paymentIntent);
      } catch (err) {
        console.log(err);
      }
    }
  }
}
