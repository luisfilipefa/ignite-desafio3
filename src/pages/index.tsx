import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import Prismic from '@prismicio/client';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiUser, FiCalendar } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
  preview: boolean;
}

export default function Home({
  postsPagination,
  preview,
}: HomeProps): JSX.Element {
  // TODO
  // [x] Armazenar posts num estado
  // [x] Armazenar o valor de next_page num estado
  // [x] Usar useEffect para setar o estado inicial dos posts como sendo o retorno de getStatic Props
  // [x] Listar todos os posts
  // [x] Formatar datas usando date-fns
  // [x] Renderizar botao de exibir mais posts caso exista uma next_page
  // [x] Renderizar posts da next_page no clique do botao

  const { next_page, results } = postsPagination;
  const [posts, setPosts] = useState<Post[]>([]);
  const [urlNextPage, setUrlNextPage] = useState('');

  useEffect(() => {
    setUrlNextPage(next_page);
    setPosts(results);
  }, []);

  const handleClick = async (): Promise<void> => {
    const response = await fetch(next_page);
    const data = await response.json();

    setUrlNextPage(data.next_page);
    setPosts([...posts, ...data.results]);
  };

  return (
    <>
      <Head>
        <script
          async
          defer
          src="https://static.cdn.prismic.io/prismic.js?new=true&repo=ignite-desafio3"
        />
      </Head>
      <main className={commonStyles.container}>
        <div className={styles.posts}>
          {posts.map(post => {
            return (
              <Link key={post.uid} href={`/post/${post.uid}`}>
                <a>
                  <strong>{post.data.title}</strong>
                  <p>{post.data.subtitle}</p>
                  <div className={styles.infoContainer}>
                    <p>
                      <FiCalendar />
                      <time>
                        {format(
                          new Date(post.first_publication_date),
                          'dd MMM yyyy',
                          { locale: ptBR }
                        )}
                      </time>
                    </p>
                    <p>
                      <FiUser />
                      {post.data.author}
                    </p>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
        {!urlNextPage ? (
          ''
        ) : (
          <button
            type="button"
            onClick={() => handleClick()}
            className={styles.showMoreButton}
          >
            Carregar mais posts
          </button>
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

export const getStaticProps: GetStaticProps<HomeProps> = async ({
  preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.predicates.at('document.type', 'posts'),
    {
      ref: previewData ? previewData.ref : null,
      pageSize: 1,
      page: 1,
      fetchLinks: [
        'posts.uid',
        'posts.first_publication_date',
        'posts.data.title',
        'posts.data.subtitle',
        'posts.data.author',
      ],
    }
  );

  const results = postsResponse.results.map(result => {
    return {
      uid: result.uid,
      first_publication_date: result.first_publication_date,
      data: {
        title: result.data.title,
        subtitle: result.data.subtitle,
        author: result.data.author,
      },
    };
  });

  const postsPagination = {
    next_page: postsResponse.next_page,
    results,
  };

  // TODO
  // [x] Realizar query na API do Prismic e retornar todos os posts (contendo apenas as informacoes necessarias usando fetch no objeto de parametros da query)
  // [x] Criar um novo objeto contendo os results (posts) e a next_page (string)
  // [x] Retornar objeto nas props

  return { props: { postsPagination, preview }, revalidate: 60 * 60 * 24 };
};
