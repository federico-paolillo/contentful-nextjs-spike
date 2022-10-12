import type { GetStaticProps, NextPage } from "next";
import Image from "next/future/image";
import Head from "next/head";
import Link from "next/link";
import { BoxedLayout } from "../components/BoxedLayout";
import { newContentfulClient } from "../contentful/client";

interface BlogPostDetail {
  id: string;
  title: string;
  teaser: string;
  publicationDate: Date;
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
          <h1 className="text-5xl font-bold text-gray-700 dark:text-gray-200 sm:text-7xl">
            A blog ✨
          </h1>

          <Link href={`posts/${firstBlogPostDetail.id}`}>
            <div className="flex cursor-pointer flex-col gap-4 sm:gap-8 md:flex-row lg:gap-12">
              <div className="relative aspect-video h-auto w-full min-w-[50%] overflow-hidden rounded">
                <Image src="/images/cover1.png" alt="Post image" fill />
              </div>

              <div className="flex flex-col gap-2 sm:gap-4">
                <p className="text-sm font-medium text-gray-400 dark:text-gray-600">
                  {new Date(
                    firstBlogPostDetail.publicationDate
                  ).toLocaleDateString("en-US")}
                </p>

                <h2 className="text-4xl font-semibold leading-tight text-gray-900 dark:text-gray-50 sm:text-5xl">
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
                  <div className="flex cursor-pointer flex-col items-center gap-4">
                    <div className="relative aspect-video h-auto w-full overflow-hidden rounded">
                      <Image src="/images/cover2.png" alt="Post image" fill />
                    </div>
                    <div className="flex w-full flex-col gap-1.5">
                      <p className="text-sm font-medium text-gray-400 dark:text-gray-600">
                        {new Date(
                          blogPostDetail.publicationDate
                        ).toLocaleDateString("en-US")}
                      </p>

                      <h2 className="text-ellipsis text-xl font-semibold text-gray-900 dark:text-gray-50 sm:text-2xl">
                        {blogPostDetail.title}
                      </h2>

                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-lg">
                        {blogPostDetail.teaser}
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
      teaser: item?.teaser || "Untitled",
      publicationDate: item?.publicationDate || new Date(),
      id: item?.sys.id || "<nowhere>",
    })) || [];

  const sortedBlogPostDetails = blogPostDetails.sort((a, b) => {
    if (new Date(a.publicationDate) < new Date(b.publicationDate)) {
      return 1;
    } else {
      return -1;
    }
  });

  return {
    props: {
      blogPostDetails: sortedBlogPostDetails,
    },
  };
};

export default Home;
