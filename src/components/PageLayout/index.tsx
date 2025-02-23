import { FC, ReactNode } from 'react';
import s from './PageLayout.module.scss';

interface PageLayoutProps {
  children: ReactNode;
}

// Может пригодиться для применения каких-то общих
// стилей и разметки на страницах
// Можно сделать разные PageLayout или использовать пропсы
export const PageLayout: FC<PageLayoutProps> = ({ children }) => {
  return <div className={s.root}>{children}</div>;
};
