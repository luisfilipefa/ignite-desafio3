import { useEffect, useState } from 'react';
import Head from 'next/head';

import commonStyles from '../../styles/common.module.scss';
import styles from './article.module.scss';
import { ArticleProps } from '../../types';
import Preview from '../Preview';
import ArticleHeader from './ArticleHeader';
import ArticleNav from './ArticleNav';
import Utterances from './Utterances';

const Article = ({ post, preview }: ArticleProps): JSX.Element => {
  const [contentSize, setContentSize] = useState(0);

  useEffect(() => {
    const wordsInBody = post.data.content[0].body.toString().split(' ').length;
    const wordsInHeading = post.data.content[0].heading.split(' ').length;

    setContentSize(wordsInBody + wordsInHeading);
  }, []);

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

      <ArticleHeader
        title={post.data.title}
        author={post.data.author}
        banner_url={post.data.banner.url}
        first_publication_date={post.first_publication_date}
        last_publication_date={post.last_publication_date}
        content_size={contentSize}
      />

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

        <ArticleNav
          uid={post.uid}
          prev_post={post.prev_post}
          next_post={post.next_post}
        />
      </main>

      <section id="posts-section">
        <Utterances />
      </section>

      <Preview preview={preview} />
    </>
  );
};

export default Article;
