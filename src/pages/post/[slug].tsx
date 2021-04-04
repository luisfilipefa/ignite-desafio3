import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  uid: string;
  first_publication_date: string | null;
  last_publication_date: string | null;
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

interface NavPost {
  uid: string;
  title: string;
}
interface PostProps {
  post: Post;
  prevPost: NavPost;
  nextPost: NavPost;
  preview: boolean;
}

export default function Post({
  post,
  prevPost,
  nextPost,
  preview,
}: PostProps): JSX.Element {
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
        <script
          async
          defer
          src="https://static.cdn.prismic.io/prismic.js?new=true&repo=ignite-desafio3"
        />
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
          <p>
            <FiClock />
            {`${readingTime} min`}
          </p>
          <p>
            * editado em{' '}
            {format(
              new Date(post.last_publication_date),
              'dd MMM yyyy, HH:MM',
              {
                locale: ptBR,
              }
            )}
          </p>
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
        {prevPost || nextPost ? (
          <div className={styles.navPosts}>
            {prevPost && prevPost.uid !== post.uid && (
              <div>
                <p>{prevPost.title}</p>{' '}
                <Link href={`/post/${prevPost.uid}`}>
                  <a>Post anterior</a>
                </Link>
              </div>
            )}
            {nextPost && nextPost.uid !== post.uid && (
              <div>
                <p>{nextPost.title}</p>{' '}
                <Link href={`/post/${nextPost.uid}`}>
                  <a>Post seguinte</a>
                </Link>
              </div>
            )}
          </div>
        ) : (
          ''
        )}
      </main>
      <div className={commonStyles.exitPreviewLink}>
        {!preview ? (
          ''
        ) : (
          <Link href="/api/exit-preview">
            <a>Sair do modo preview</a>
          </Link>
        )}
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.predicates.at('document.type', 'posts'),
    { pageSize: 20 }
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

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
  previewData,
}) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {
    ref: previewData ? previewData.ref : null,
  });

  const prevResponse = await prismic.query(
    Prismic.predicates.at('document.type', 'posts'),
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date desc]',
      fetch: ['posts.uid', 'posts.title'],
    }
  );

  const nextResponse = await prismic.query(
    Prismic.predicates.at('document.type', 'posts'),
    {
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date]',
      fetch: ['posts.uid', 'posts.title'],
    }
  );

  const prevPost =
    typeof prevResponse.results[0] === 'undefined'
      ? null
      : {
          uid: prevResponse.results[0].uid,
          title: prevResponse.results[0].data.title,
        };

  const nextPost =
    typeof nextResponse.results[0] === 'undefined'
      ? null
      : {
          uid: nextResponse.results[0].uid,
          title: nextResponse.results[0].data.title,
        };

  const post: Post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
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
  return { props: { post, prevPost, nextPost, preview } };
};
