import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../../services/prismic';
import Article from '../../components/Article';
import { ArticleProps, PostProps } from '../../types';

export default function Post({ post, preview }: ArticleProps): JSX.Element {
  // TODO
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Article post={post} preview={preview} />
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

  const post: PostProps = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    prev_post: prevPost,
    next_post: nextPost,
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
  return { props: { post, preview } };
};
