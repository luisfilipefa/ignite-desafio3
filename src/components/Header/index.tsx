import Link from 'next/link';

import commonStyles from '../../styles/common.module.scss';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  // TODO
  // [x] Criar header contendo a logo
  // [x] Redirecionar para a home quando clicar na logo
  // [x] Renderizar o Header no _app
  return (
    <header className={`${commonStyles.container} ${styles.container}`}>
      <div className={styles.content}>
        <Link href="/">
          <a>
            <img src="/Logo.svg" alt="logo" />
          </a>
        </Link>
      </div>
    </header>
  );
}
