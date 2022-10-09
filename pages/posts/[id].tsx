import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
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

const BlogPostPage = ({ blogPost }: BlogPostPageProps) => {
  return (
    <>
      <h2>{blogPost.title}</h2>
      <p>{blogPost.content}</p>
    </>
  );
};

export const getStaticPaths: GetStaticPaths<BlogPostPageSsrParams> =
  async function () {
    var blogPostsQueryResult = await contentfulClient.GetBlogPosts();

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
    throw new Error(`Blog Post ${params.id} is missing`);
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
