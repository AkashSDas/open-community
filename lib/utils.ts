export const convertSecToJsxTime = (time: number) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date(time);
  return `${date.getDay()} ${monthNames[date.getMonth()].slice(
    0,
    3
  )}, ${date.getFullYear()}`;
};

import { auth } from "./firebase";

const API = process.env.NEXT_PUBLIC_BASE_URL;

/**
 * A helper function to fetch data from your API
 */

export async function fetchFromAPI(
  endpointURL: string,
  opts: {
    method: string;
    body: any;
  }
) {
  const { method, body } = { ...opts };

  /**
   * Once the user is logged in, firebase creates a JWT with the
   * user's details in the frontend
   *
   * We can authenticate request that goes to the backend API by
   * setting this token as a header on the request
   */

  const user = auth.currentUser;
  const token = user && (await user.getIdToken());

  const res = await fetch(`${API}${endpointURL}`, {
    method,
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      "Content-Type": "application/json",

      // Below is the standard format for JWT authentication
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}
