import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/future/image";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { BoxedLayout } from "../../components/BoxedLayout";
import { newContentfulClient } from "../../contentful/client";

interface BlogPost {
  readonly title: string;
  readonly content: string;
  readonly publication_date: string;
  readonly coverart_url: string;
  readonly coverart_alt: string;
}

interface BlogPostPageProps {
  readonly blogPost: BlogPost;
}

interface BlogPostPageSsrParams extends ParsedUrlQuery {
  readonly id: string;
}

const contentfulClient = newContentfulClient(
  process.env.CONTENTFUL_GRAPHQL_API_URL,
  process.env.CONTENTFUL_CONTENT_DELIVERY_API_KEY
);

const BlogPostPage: NextPage<BlogPostPageProps> = ({
  blogPost,
}: BlogPostPageProps) => {
  return (
    <>
      <Head>
        <title>{`${blogPost.title} - Contentful + NextJS Spike`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <BoxedLayout maxStretch="768px" className="pt-12 md:pt-24">
        <div className="flex flex-col gap-8 sm:gap-16">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold !leading-tight text-gray-900 dark:text-gray-200 sm:text-6xl">
              {blogPost.title}
            </h1>
            <p className="text-sm font-medium text-gray-400 dark:text-gray-600">
              {blogPost.publication_date}
            </p>
          </div>

          <div className="flex flex-col gap-8 sm:gap-16">
            <div className="relative aspect-video h-auto w-full min-w-[50%] overflow-hidden rounded">
              <Image
                src={blogPost.coverart_url}
                alt={blogPost.coverart_alt}
                fill
              />
            </div>

            <BoxedLayout maxStretch="600px" className="!p-0">
              <div className="prose">{blogPost.content}</div>
            </BoxedLayout>
          </div>
        </div>
      </BoxedLayout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths<BlogPostPageSsrParams> =
  async function () {
    const blogPostsQueryResult = await contentfulClient.GetBlogPosts();

    const blogPostIds =
      blogPostsQueryResult.entryCollection?.items.map((item) => item?.sys.id) ||
      [];

    const blogPostPaths = blogPostIds
      .filter(Boolean)
      .map((id) => ({ params: { id: String(id) } }));

    return {
      paths: blogPostPaths,
      fallback: "blocking",
    };
  };

export const getStaticProps: GetStaticProps<
  BlogPostPageProps,
  BlogPostPageSsrParams
> = async function ({ params }) {
  if (!params) {
    throw new Error("No static paths were generated");
  }

  const blogPostQueryResult = await contentfulClient.GetBlogPostById({
    postId: params.id,
  });

  if (!blogPostQueryResult.post) {
    return {
      notFound: true,
    };
  }

  const blogPost: BlogPost = {
    title: blogPostQueryResult.post?.title || "<untitled>",
    content: blogPostQueryResult.post?.content || "<nothing>",
    publication_date:
      new Date(blogPostQueryResult.post?.publicationDate).toLocaleDateString(
        "en-US"
      ) || "<never>",
    coverart_url: blogPostQueryResult.post.coverart?.url || "",
    coverart_alt: blogPostQueryResult.post.coverart?.title || "",
  };

  return {
    props: {
      blogPost,
    },
  };
};

export default BlogPostPage;
