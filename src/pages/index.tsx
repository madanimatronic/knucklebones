import { PlayerField } from '@/components/PlayerField';
import { PlayerWidgets } from '@/components/PlayerWidgets';
import { Seo } from '@/components/Seo';
import { Game } from '@/game/entities/Game';
import { Player } from '@/game/entities/Player';
import { reverseField } from '@/game/utils/utils';
import s from '@/styles/Home.module.scss';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';

// TODO: хорошим и современным способом разделить логику и UI
// В компонентах и не только - это вынести логику в кастомный хук (если будет нужно)
// TODO: подумать над тестами и storybook в проекте (если будет уместно)
// TODO: не забыть про подсчёт очков в колонках и увеличении очков
// при комбинациях кубиков

// TODO: пройти по всем файлам стилей и вынести цвета в константы
// TODO: переписать README

// Задержка хода бота в МС
const botDelay = 1000;

export default function Home() {
  // TODO: возможно стоит сделать методы Game статическими и тогда
  // не надо будет создавать объект класса
  const game = useMemo(() => new Game(), []);
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
    const newIsGameRunningState = game.isRunning(playerState, botState);
    setIsGameRunning(newIsGameRunningState);
    // TODO: вынести в функцию это и обработку хода игрока
    if (isBotMove && newIsGameRunningState) {
      // Ход бота (временно, для теста)
      const newDiceState = game.throwDice();
      setDiceState(newDiceState);
      setTimeout(() => {
        const updatedFields = game.pushDiceInColumn(
          botState,
          game.getAvailableColumns(botState)[
            Math.floor(
              Math.random() * game.getAvailableColumns(botState).length,
            )
          ],
          newDiceState,
          playerState,
        );

        if (updatedFields) {
          setPlayerState({
            ...playerState,
            field: updatedFields.otherPlayerField,
          });
          setBotState({
            ...botState,
            field: updatedFields.pushPlayerField,
          });
          setIsBotMove(false);
        }

        setDiceState(game.throwDice());
      }, botDelay);
    }
  }, [playerState.field, botState.field]);

  return (
    <>
      <Seo
        headTitle='My page'
        metaDescription='some description'
        iconLink='/favicon.ico'
      />
      <div className={s.page}>
        <main className={s.main}>
          <PlayerWidgets
            className={clsx(s.widgets, s.playerWidgets)}
            playerName={playerState.name}
            playerPoints={game.calculatePlayerPoints(playerState)}
            diceValue={diceState}
            isDiceHidden={!isGameRunning || isBotMove}
            isMainPlayer
          />
          <PlayerField
            className={s.playerField}
            fieldData={playerState.field}
            calculateColumnPointsFunction={game.calculateColumnPoints.bind(
              game,
            )}
            calculateFieldDuplicatesFunction={game.calculateFieldDuplicates.bind(
              game,
            )}
            isMainPlayer
            isInteractive={isGameRunning && !isBotMove}
            availableColumns={game.getAvailableColumns(playerState)}
            columnClickCallback={(colIndex) => {
              const updatedFields = game.pushDiceInColumn(
                playerState,
                colIndex,
                diceState,
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
          <div className={s.gameResultContainer}>
            <p className={s.message}>
              {isGameRunning
                ? undefined
                : game.calculateGameResult(playerState, botState)}
            </p>
            <button
              className={clsx(s.restartButton, { [s.hidden]: isGameRunning })}
              inert={isGameRunning}
              onClick={() => {
                setPlayerState({ ...playerState, field: [[], [], []] });
                setBotState({ ...botState, field: [[], [], []] });
                setDiceState(game.throwDice());
                setIsBotMove(Math.random() >= 0.5 ? true : false);
                setIsGameRunning(true);
              }}
            >
              New Game
            </button>
          </div>
          <PlayerField
            className={s.botField}
            fieldData={reverseField(botState.field)}
            calculateColumnPointsFunction={game.calculateColumnPoints.bind(
              game,
            )}
            calculateFieldDuplicatesFunction={game.calculateFieldDuplicates.bind(
              game,
            )}
          />
          <PlayerWidgets
            className={clsx(s.widgets, s.botWidgets)}
            playerName={botState.name}
            playerPoints={game.calculatePlayerPoints(botState)}
            diceValue={diceState}
            isDiceHidden={!isGameRunning || !isBotMove}
          />
        </main>
      </div>
    </>
  );
}
