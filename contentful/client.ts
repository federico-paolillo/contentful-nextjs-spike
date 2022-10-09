import { GraphQLClient } from "graphql-request";
import { getSdk, Sdk } from "./gql.g";

export function newContentfulClient(gqlApiUrl: string, apiToken: string): Sdk {
  const graphqlClient = new GraphQLClient(gqlApiUrl, {
    headers: { Authorization: `Bearer ${apiToken}` },
  });

  return getSdk(graphqlClient);
}
