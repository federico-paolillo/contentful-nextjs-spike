import type { GetStaticProps, NextPage } from "next";
import Image from "next/future/image";
import Head from "next/head";
import Link from "next/link";
import { BoxedLayout } from "../components/BoxedLayout";
import { newContentfulClient } from "../contentful/client";

interface BlogPostDetail {
  id: string;
  title: string;
}

interface HomePageProps {
  blogPostDetails: BlogPostDetail[];
}

const contentfulClient = newContentfulClient(
  process.env.CONTENTFUL_GRAPHQL_API_URL,
  process.env.CONTENTFUL_CONTENT_DELIVERY_API_KEY
);

const Home: NextPage<HomePageProps> = ({ blogPostDetails }) => {
  const [firstBlogPostDetail, ...otherBlogPostDetails] = blogPostDetails;

  return (
    <>
      <Head>
        <title>Contentful + NextJS Spike</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <BoxedLayout>
        <div className="flex flex-col gap-20">
          <h1 className="text-5xl sm:text-7xl text-gray-700 dark:text-gray-200 font-bold">
            A blog ✨
          </h1>

          <Link href={`posts/${firstBlogPostDetail.id}`}>
            <div className="flex flex-col md:flex-row gap-4 md:gap-12 cursor-pointer">
              <div className="relative h-auto w-full aspect-video rounded overflow-hidden min-w-[50%]">
                <Image src="/images/cover1.png" alt="Post image" fill />
              </div>

              <div className="flex flex-col gap-2 sm:gap-4">
                <p className="text-gray-500 dark:text-gray-600 text-sm font-medium">
                  12 October 2022
                </p>

                <h2 className="text-4xl sm:text-5xl leading-tight text-gray-900 dark:text-gray-50 font-semibold">
                  {firstBlogPostDetail.title}
                </h2>
              </div>
            </div>
          </Link>

          <ul className="grid grid-cols-12 gap-8">
            {otherBlogPostDetails.map((blogPostDetail) => (
              <li
                key={blogPostDetail.id}
                className="col-span-12 sm:col-span-6 md:col-span-4"
              >
                <Link href={`posts/${blogPostDetail.id}`}>
                  <div className="flex flex-col gap-4 items-center cursor-pointer">
                    <div className="relative h-auto w-full aspect-video rounded overflow-hidden">
                      <Image src="/images/cover2.png" alt="Post image" fill />
                    </div>
                    <div className="flex flex-col w-full gap-1.5">
                      <p className="text-gray-500 dark:text-gray-600 text-sm font-medium">
                        12 October 2022
                      </p>

                      <h2 className="text-ellipsis text-xl sm:text-2xl text-gray-900 dark:text-gray-50 font-semibold">
                        {blogPostDetail.title}
                      </h2>

                      <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-lg font-medium">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed ut imperdiet nunc. Nulla facilisi.
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </BoxedLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async function () {
  const blogPosts = await contentfulClient.GetBlogPosts();

  const blogPostDetails: BlogPostDetail[] =
    blogPosts.entryCollection?.items.map((item) => ({
      title: item?.title || "Untitled",
      id: item?.sys.id || "<nowhere>",
    })) || [];

  return {
    props: {
      blogPostDetails,
    },
  };
};

export default Home;
