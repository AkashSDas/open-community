import * as firebaseAdmin from "firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";

// Initialize Firebase Admin resources

export const db = firebaseAdmin.firestore();
export const auth = firebaseAdmin.auth();

/**
 * Decodes the JSON Web Token sent via the frontend app
 * Makes the currentUser (firebase) data available on the body.
 */
export async function decodeJWT(
  req: NextApiRequest,
  res: NextApiResponse,
  next: Function
) {
  if (req.headers?.authorization?.startsWith("Bearer ")) {
    const idToken = req.headers.authorization.split("Bearer ")[1];

    try {
      // auth.verifyIdToken(idToken) will return current user's
      // auth record from firebase which contains uid, email, etc...
      const decodeToken = await auth.verifyIdToken(idToken);

      // setting the decodeToken as user property on the req
      req["currentUser"] = decodeToken;
    } catch (err) {
      console.log(err);
    }
  }

  next();
}

/**
 * Catch async errors when awaiting promises
 */
export function runAsync(callback: Function) {
  return (req: NextApiRequest, res: NextApiResponse, next: Function) => {
    callback(req, res, next).catch(next);
  };
}

/**
 * Throws an error if the currentUser does not exist on the request
 */
export function validateUser(req: NextApiRequest) {
  const user = req["currentUser"];

  if (!user) {
    throw new Error(
      "You must be logged in to make this request. i.e Authroization: Bearer <token>"
    );
  }

  return user;
}
