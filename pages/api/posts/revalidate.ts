import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const maybeRevalidationToken =
    req.headers[process.env.REVALIDATE_KEY_HEADER_NAME];

  if (!maybeRevalidationToken) {
    res.status(400);
    return;
  }

  if (Array.isArray(maybeRevalidationToken)) {
    res.status(400);
    return;
  }

  if (maybeRevalidationToken !== process.env.REVALIDATE_KEY) {
    res.status(401);
    return;
  }

  await res.revalidate("/");

  res.status(204);
}
