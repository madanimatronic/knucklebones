import { PlayerField } from '@/components/PlayerField';
import { Seo } from '@/components/Seo';
import { reverseField } from '@/game/utils/utils';
import s from '@/styles/Home.module.scss';

export default function Home() {
  const test = [
    [1, 2, 3],
    [6, 4, 2],
    [3, 6, 1],
  ];
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
          <button
            style={{ width: '100px' }}
            onClick={() => {
              console.log(Math.floor(Math.random() * 6 + 1));
            }}
          >
            roll
          </button>
          <div className={s.gameContainer}>
            <PlayerField fieldData={reverseField(test)} />
            <PlayerField fieldData={test} />
          </div>
        </main>
      </div>
    </>
  );
}
