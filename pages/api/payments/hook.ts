import { NextApiRequest, NextApiResponse } from "next";

import { runAsync } from "../../../backend/firebase";
import { handleStripeWebhook } from "../../../backend/webhook";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  next: Function
) {
  if (req.method === "POST") {
    handleStripeWebhook(req, res);
  }
}
