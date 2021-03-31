import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import Header from '../../components/Header';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  uid: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
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
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  const wordsInBody = post.data.content[0].body.toString().split(' ').length;
  const wordsInHeading = post.data.content[0].heading.split(' ').length;
  const readingTime = Math.ceil((wordsInBody + wordsInHeading) / 200);

  return (
    <>
      <Head>
        <title>{post.data.title} | Spacetraveling</title>
      </Head>

      <Header />

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
          <p>
            <FiClock />4 min
            {/* {`${readingTime} min`} */}
          </p>
          <p className={styles.test}>Proin et varius</p>
          <p className={styles.test}>Cras laoreet mi</p>
        </div>
      </header>

      <main className={commonStyles.container}>
        <article className={styles.post}>
          <h2
            dangerouslySetInnerHTML={{
              __html: String(post.data.content.map(item => item.heading)),
            }}
          />
          <div
            dangerouslySetInnerHTML={{
              __html: String(post.data.content.map(item => item.body)),
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
    { pageSize: 20, page: 1 }
  );

  const paths = posts.results.map(result => {
    return { params: { slug: result.uid } };
  });

  // TODO
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  const post: Post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(item => {
        item.body = RichText.asHtml(item.body);
        return item;
      }),
    },
  };

  // TODO
  return { props: { post } };
};
