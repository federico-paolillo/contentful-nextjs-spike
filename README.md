# Contentful + NextJS Spike

Contentful headless CMS plugged into NextJS using Contentful Content Delivery GraphQL API

## Overview

Grabs content from [Contentful](https://www.contentful.com/) and puts it in web pages using [NextJS](https://nextjs.org/).  
The application mainly uses [SSR](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props) and has [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration) enabled, so you can update content without rebuilding.

Integration with Contentful uses the [Content Delivery GraphQL API](https://www.contentful.com/developers/docs/references/graphql/). To speed-up development and avoid mistakes the application is using [`@graphql-codegen`](https://www.the-guild.dev/graphql/codegen) to automagically generate TypeScript type definitions and operations. All GraphQL API calls are made with [`graphql-request`](https://github.com/prisma-labs/graphql-request).

`@graphql-codegen` is configured by `codegen.ts` to use three plugins: [`typescript`](https://www.the-guild.dev/graphql/codegen/plugins/typescript/typescript), [`typescript-operations`](https://www.the-guild.dev/graphql/codegen/plugins/typescript/typescript-operations) and [`typescript-graphql-requests`](https://www.the-guild.dev/graphql/codegen/plugins/typescript/typescript-graphql-request).  
We are not using the client preset because it severely [limits the configuration options](https://github.com/dotansimha/graphql-code-generator/blob/d00c9867d3a568ccae099237400851281d05cff6/packages/presets/client/src/index.ts#L72) that can be passed to it. Additionally, specifying again the same plugins declared in the preset will duplicate the generated TypeScript definitions. `typescript-graphql-request` can [output only to a single file](https://github.com/dotansimha/graphql-code-generator/blob/d00c9867d3a568ccae099237400851281d05cff6/packages/plugins/typescript/graphql-request/src/index.ts#L45), in our case it is `contentful/gql.g.ts`.

Configuration is loaded using [`dotenv`](https://github.com/motdotla/dotenv), you have to setup a file named `.env.local` that has the actual configuration values. See `.env.example` for the list of entries that you need to configure. Environment variables are typed through `dotenv.d.ts`, these typings are manual so watch your typos.

There is one [API Route](https://nextjs.org/docs/api-routes/introduction) available under `posts/revalidate?id=<blog_post_id>` that is used to trigger [on-demand revalidation](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#on-demand-revalidation) (using Incremental Static Regeneration) of Blog Posts pages and the index page to keep everything up-to-date with Contentful without rebuilding.  
This API Route is called automatically by [Contentful Web Hooks](https://www.contentful.com/developers/docs/concepts/webhooks/) and uses [Webhooks URL Transformation](https://www.contentful.com/developers/docs/references/content-management-api/#url-transformation) to provide the id of the Entry that was changed as query parameter `id`.  
This API Route is "authenticated" using a secret token that must be passed via HTTP Header. The secret token value and header name is configured through `.env.local`.

It goes without saying that you _have to_ use my Contenful CMS space or create your own space and mimic my data, see: `contentful/queries` to get an idea of the Content Types that you need to have.

The application uses [Tailwind CSS](https://tailwindcss.com/) for styling.

## Run

Setup a `.env.local` file using `.env.example` as basis and then run `npm run dev`  
Alternatively, you can visit [the site deployed on Vercel](https://contentful-nextjs-spike.vercel.app/).
