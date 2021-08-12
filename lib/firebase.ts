import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

// Auth exports
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

// Firestore exports
export const firestore = firebase.firestore();
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const fromMillis = firebase.firestore.Timestamp.fromMillis;

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    lastmodifiedAT: data?.lastmodifiedAt.toMillis() || 0,
  };
}

// Types
export type FirestoreTimestamp = firebase.firestore.Timestamp;
export type FirestoreFieldValue = firebase.firestore.FieldValue;
export type FirebaseUser = firebase.User;
export type FirestoreDocumentData =
  firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>;

export function serializePostDocData(doc: FirestoreDocumentData): {
  [key: string]: any;
} {
  const data = doc.data();
  return {
    ...data,

    // Firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    lastmodifiedAt: data?.lastmodifiedAt.toMillis() || 0,
  };
}

/**
 * Throws an error if the currentUser does not exist on the request
 * Used in apis in this app
 */
function validateUser(req: Request) {
  const user = req["currentUser"];

  if (!user) {
    throw new Error(
      "You must be logged in to make this request. i.e Authroization: Bearer <token>"
    );
  }

  return user;
}
