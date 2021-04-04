import Link from 'next/link';

import { ArticleNavProps } from '../../../types';
import styles from './articleNav.module.scss';

const ArticleNav = ({
  uid,
  prev_post,
  next_post,
}: ArticleNavProps): JSX.Element => {
  return (
    <>
      {prev_post || next_post ? (
        <div className={styles.navPosts}>
          {prev_post && prev_post.uid !== uid && (
            <div>
              <p>{prev_post.title}</p>{' '}
              <Link href={`/post/${prev_post.uid}`}>
                <a>Post anterior</a>
              </Link>
            </div>
          )}
          {next_post && next_post.uid !== uid && (
            <div>
              <p>{next_post.title}</p>{' '}
              <Link href={`/post/${next_post.uid}`}>
                <a>Post seguinte</a>
              </Link>
            </div>
          )}
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default ArticleNav;
