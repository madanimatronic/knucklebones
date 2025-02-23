import { Seo } from '@/components/Seo';
import s from '@/styles/Home.module.scss';

export default function Home() {
  return (
    <>
      <Seo
        headTitle='My page'
        metaDescription='some description'
        iconLink='/favicon.ico'
      />
      <div className={s.page}>
        <main className={s.main}>
          <p className={s.test}>pizza</p>
        </main>
      </div>
    </>
  );
}
