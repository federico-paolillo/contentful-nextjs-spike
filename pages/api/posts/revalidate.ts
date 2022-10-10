import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const maybeRevalidationToken =
    req.headers[process.env.REVALIDATE_KEY_HEADER_NAME];

  if (!maybeRevalidationToken) {
    return res.status(400).end();
  }

  if (Array.isArray(maybeRevalidationToken)) {
    return res.status(400).end();
  }

  if (maybeRevalidationToken !== process.env.REVALIDATE_KEY) {
    return res.status(401).end();
  }

  await res.revalidate("/index");

  return res.status(204).end();
}
