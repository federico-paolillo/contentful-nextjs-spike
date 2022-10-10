import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const maybeRevalidationToken =
    req.headers[process.env.REVALIDATE_KEY_HEADER_NAME];

  if (!maybeRevalidationToken) {
    return res.status(400);
  }

  if (Array.isArray(maybeRevalidationToken)) {
    return res.status(400);
  }

  if (maybeRevalidationToken !== process.env.REVALIDATE_KEY) {
    res.status(401);
  }

  await res.revalidate("/index");

  return res.status(204);
}
