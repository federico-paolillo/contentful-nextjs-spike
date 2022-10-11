import { NextApiRequest, NextApiResponse } from "next";

const REVALIDATE_KEY_HEADER_NAME =
  process.env.REVALIDATE_KEY_HEADER_NAME.toLowerCase();

//See: https://www.contentful.com/developers/docs/references/content-management-api/#headers

const CONTENTFUL_TOPIC_HEADER_NAME = "x-contentful-topic";
const CONTENTFUL_TOPIC_ENTRY_PUBLISH = "ContentManagement.Entry.publish";

//This query parameter is defined in my Contentful Web Hook definition

const CONTENTFUL_WEBHOOK_ID_QUERY_PARAMETER = "id";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(404).end();
  }

  const maybeRevalidationToken = req.headers[REVALIDATE_KEY_HEADER_NAME];

  if (!maybeRevalidationToken) {
    return res.status(401).end();
  }

  if (Array.isArray(maybeRevalidationToken)) {
    return res.status(400).end();
  }

  if (maybeRevalidationToken !== process.env.REVALIDATE_KEY) {
    return res.status(403).end();
  }

  const postId = req.query[CONTENTFUL_WEBHOOK_ID_QUERY_PARAMETER];
  const topicType = req.headers[CONTENTFUL_TOPIC_HEADER_NAME];

  const isPublish = topicType === CONTENTFUL_TOPIC_ENTRY_PUBLISH;

  console.log(postId);
  console.log(topicType);

  if (postId && isPublish) {
    await res.revalidate(`/posts/${postId}`);
  }

  await res.revalidate("/");

  return res.status(204).end();
}
