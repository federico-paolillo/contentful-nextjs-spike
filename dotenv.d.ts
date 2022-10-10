declare namespace NodeJS {
  declare interface ProcessEnv {
    readonly CONTENTFUL_CONTENT_DELIVERY_API_KEY: string;
    readonly CONTENTFUL_GRAPHQL_API_URL: string;
    readonly REVALIDATE_KEY: string;
    readonly REVALIDATE_KEY_HEADER_NAME: string;
  }
}
