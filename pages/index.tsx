import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { newContentfulClient } from "../contentful/client";
import styles from "../styles/Home.module.css";

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
  return (
    <div className={styles.container}>
      <Head>
        <title>Contentful + NextJS Spike</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>A blog</h1>
        <ul>
          {blogPostDetails.map((blogPostDetail) => (
            <li key={blogPostDetail.id}>
              <Link href={`posts/${blogPostDetail.id}`}>
                {blogPostDetail.title}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
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
