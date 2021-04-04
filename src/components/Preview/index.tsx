import Link from 'next/link';

import { PreviewProps } from '../../types';
import styles from './preview.module.scss';

const Preview = ({ preview }: PreviewProps): JSX.Element => {
  return (
    <div className={styles.exitPreviewLink}>
      {!preview ? (
        ''
      ) : (
        <Link href="/api/exit-preview">
          <a>Sair do modo preview</a>
        </Link>
      )}
    </div>
  );
};

export default Preview;
