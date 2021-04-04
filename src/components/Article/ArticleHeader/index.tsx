import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import { ArticleHeaderProps } from '../../../types';
import styles from './articleHeader.module.scss';
import commonStyles from '../../../styles/common.module.scss';

const ArticleHeader = ({
  title,
  author,
  banner_url,
  first_publication_date,
  last_publication_date,
  readingTime,
}: ArticleHeaderProps): JSX.Element => {
  return (
    <header className={styles.headerContainer}>
      <div>
        <img src={banner_url} alt="banner" />
      </div>
      <h1>{title}</h1>
      <div className={`${commonStyles.container} ${styles.infoContainer}`}>
        <p>
          <FiCalendar />
          {format(new Date(first_publication_date), 'dd MMM yyyy', {
            locale: ptBR,
          })}
        </p>
        <p>
          <FiUser />
          {author}
        </p>
        <p>
          <FiClock />
          {`${readingTime} min`}
        </p>
        <p>
          * editado em{' '}
          {format(new Date(last_publication_date), 'dd MMM yyyy, HH:MM', {
            locale: ptBR,
          })}
        </p>
      </div>
    </header>
  );
};

export default ArticleHeader;
