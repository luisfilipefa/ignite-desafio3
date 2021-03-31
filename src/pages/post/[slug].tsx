import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiUser, FiCalendar } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  // TODO
  return (
    <>
      <Head>
        <title>{post.data.title} | Spacetraveling</title>
      </Head>

      <header className={styles.headerContainer}>
        <div>
          <img src={post.data.banner.url} alt="banner" />
        </div>
        <h1>{post.data.title}</h1>
        <div className={`${commonStyles.container} ${styles.infoContainer}`}>
          <p>
            <FiCalendar />
            {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
              locale: ptBR,
            })}
          </p>
          <p>
            <FiUser />
            {post.data.author}
          </p>
        </div>
      </header>

      <main className={commonStyles.container}>
        <article className={styles.post}>
          <h2
            dangerouslySetInnerHTML={{
              __html: post.data.content[0].heading,
            }}
          />
          <div
            dangerouslySetInnerHTML={{
              __html: RichText.asHtml(post.data.content[0].body[0].text),
            }}
          />
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.predicates.at('document.type', 'posts'),
    {}
  );

  // TODO
  return {
    paths: [{ params: { slug: posts.results[0].uid } }],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post: Post = {
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: [
        {
          heading: response.data.content[0].heading,
          body: [
            {
              text: response.data.content[0].body,
            },
          ],
        },
      ],
    },
  };

  // TODO
  return { props: { post } };
};
