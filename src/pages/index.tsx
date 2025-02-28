import { PlayerField } from '@/components/PlayerField';
import { Seo } from '@/components/Seo';
import { Game, Player } from '@/game/entities/Game';
import { reverseField } from '@/game/utils/utils';
import s from '@/styles/Home.module.scss';
import { useEffect, useState } from 'react';

// TODO: хорошим и современным способом разделить логику и UI
// В компонентах и не только - это вынести логику в кастомный хук (если будет нужно)
// TODO: подумать над тестами и storybook в проекте (если будет уместно)

export default function Home() {
  const test = [
    [1, 2, 3],
    [6, 4, 2],
    [3, 6, 1],
  ];

  // TODO: возможно стоит вынести в проп страницы
  // или как-то оптимизировать, чтобы избежать повторных объявлений
  const game = new Game();
  // const test = [
  //   [],
  //   [],
  //   [],
  // ];
  const [playerState, setPlayerState] = useState(
    new Player(1, 'Super Main Player'),
  );
  const [botState, setBotState] = useState(new Player(2, 'Bot1'));

  const [diceState, setDiceState] = useState(1);

  const [isBotMove, setIsBotMove] = useState(false);

  const [isGameRunning, setIsGameRunning] = useState(true);

  useEffect(() => {
    setDiceState(game.throwDice());
  }, []);

  useEffect(() => {
    const isGameRunning = game.isRunning(playerState, botState);
    setIsGameRunning(isGameRunning);
    // TODO: вынести в функцию это и обработку хода игрока
    if (isBotMove && isGameRunning) {
      // Ход бота (временно, для теста)
      const updatedFieldsTest = game.pushDiceInColumn(
        botState,
        game.getAvailableColumns(botState)[
          Math.floor(Math.random() * game.getAvailableColumns(botState).length)
        ],
        game.throwDice(),
        playerState,
      );

      if (updatedFieldsTest) {
        setPlayerState({
          ...playerState,
          field: updatedFieldsTest.otherPlayerField,
        });
        setBotState({
          ...botState,
          field: updatedFieldsTest.pushPlayerField,
        });
        setIsBotMove(false);
      }
    }
  }, [playerState.field, botState.field]);

  // Классы скорее всего надо будет переделать, т.к. с react это работает криво
  // Надо думать...
  // Возможно стоит написать класс, методы которого будут просто преобразовывать
  // и возвращать новое состояние игрока (и прочие состояния), которое будет юзать react.
  // Можно вместо класса просто сделать несколько функций, которые прнимают состояние
  // игрока/игроков и при необходимости ещё какие-то данные и возвращают новое состояние игрока или игры.
  // Короче, на входе какие-то данные, на выходе новое состояние какой-либо сущности
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
            <PlayerField
              fieldData={reverseField(botState.field)}
              isInteractive={false}
            />
            {/* TEST DIV WRAPPER */}
            <div>
              <PlayerField
                fieldData={playerState.field}
                isInteractive={isGameRunning}
                availableColumns={game.getAvailableColumns(playerState)}
                columnClickCallback={(colIndex) => {
                  const updatedFields = game.pushDiceInColumn(
                    playerState,
                    colIndex,
                    diceState,
                    // game.throwDice(),
                    botState,
                  );

                  if (updatedFields) {
                    setPlayerState({
                      ...playerState,
                      field: updatedFields.pushPlayerField,
                    });
                    setBotState({
                      ...botState,
                      field: updatedFields.otherPlayerField,
                    });

                    setIsBotMove(true);
                    setDiceState(game.throwDice());
                  }
                  console.log(colIndex);
                }}
              />
              <p>{diceState}</p>
              <p>{game.calculatePlayerPoints(playerState)} points</p>
              <p>
                {isGameRunning
                  ? undefined
                  : game.calculateGameResult(playerState, botState)}
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
