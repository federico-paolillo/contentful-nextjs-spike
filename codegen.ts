import dotenv from "dotenv";
import type { CodegenConfig } from "@graphql-codegen/cli";

dotenv.config({
  path: ".env.local",
  override: false,
});

const config: CodegenConfig = {
  schema: [
    {
      [process.env.CONTENTFUL_GRAPHQL_API_URL]: {
        headers: {
          Authorization: `Bearer ${process.env.CONTENTFUL_CONTENT_DELIVERY_API_KEY}`,
        },
      },
    },
  ],
  documents: ["contentful/queries/*.graphql"],
  generates: {
    "contentful/gql.g.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
    },
  },
};

export default config;
