import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/future/image";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { BoxedLayout } from "../../components/BoxedLayout";
import { newContentfulClient } from "../../contentful/client";

interface BlogPost {
  title: string;
  content: string;
}

interface BlogPostPageProps {
  blogPost: BlogPost;
}

interface BlogPostPageSsrParams extends ParsedUrlQuery {
  id: string;
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
        <title>{blogPost.title} - Contentful + NextJS Spike</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <BoxedLayout maxStretch="768px" className="pt-12 md:pt-24">
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-4">
            <h1 className="!leading-tight text-5xl sm:text-6xl text-gray-700 dark:text-gray-200 font-bold">
              {blogPost.title}
            </h1>
            <p className="text-gray-500 dark:text-gray-600 text-sm font-medium">
              12 October 2022
            </p>
          </div>

          <div className="flex flex-col gap-16">
            <div className="relative h-auto w-full aspect-video rounded overflow-hidden min-w-[50%]">
              <Image src="/images/cover2.png" alt="Post image" fill />
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
    title: blogPostQueryResult.post?.title || "",
    content: blogPostQueryResult.post?.content || "",
  };

  return {
    props: {
      blogPost,
    },
  };
};

export default BlogPostPage;
