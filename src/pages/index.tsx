import { PlayerField } from '@/components/PlayerField';
import { PlayerWidgets } from '@/components/PlayerWidgets';
import { Seo } from '@/components/Seo';
import { Game } from '@/game/entities/Game';
import { IPlayer, Player } from '@/game/entities/Player';
import { reverseField } from '@/game/utils/utils';
import s from '@/styles/Home.module.scss';
import clsx from 'clsx';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';

// TODO: хорошим и современным способом разделить логику и UI
// В компонентах и не только - это вынести логику в кастомный хук (если будет нужно)
// TODO: подумать над тестами и storybook в проекте (если будет уместно)
// TODO: не забыть про подсчёт очков в колонках и увеличении очков
// при комбинациях кубиков

// TODO: пройти по всем файлам стилей и вынести цвета в константы
// TODO: переписать README
// TODO: проверить страницу на скролл при разных разрешениях экрана

// Задержка хода бота в МС
const botDelay = 100;

export default function Home() {
  // TODO: возможно стоит сделать методы Game статическими и тогда
  // не надо будет создавать объект класса
  const game = useMemo(() => new Game(), []);
  const [playerState, setPlayerState] = useState(
    new Player(1, 'Super Main Player', true),
  );
  const [botState, setBotState] = useState(new Player(2, 'Bot1'));

  const [diceState, setDiceState] = useState(1);

  const [isBotMove, setIsBotMove] = useState(false);

  const [isGameRunning, setIsGameRunning] = useState(true);

  // TODO: подумать как побороть моргание экрана при загрузке страницы
  // (или можно сделать лоадер при загрузке страницы)
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Добавляет кубик в колонку активного игрока и обновляет поля игроков
  // Также переключает ход, определяет новое состояние игры и кидает кубик
  // для хода другого игрока
  const handlePlayerMove = useCallback(
    (
      activePlayerState: IPlayer,
      columnIndex: number,
      otherPlayerState: IPlayer,
    ) => {
      const updatedFields = game.pushDiceInColumn(
        activePlayerState,
        columnIndex,
        diceState,
        otherPlayerState,
      );

      if (updatedFields) {
        const newPlayerState = {
          ...playerState,
          field: activePlayerState.isControllable
            ? updatedFields.pushPlayerField
            : updatedFields.otherPlayerField,
        };
        const newBotState = {
          ...botState,
          field: activePlayerState.isControllable
            ? updatedFields.otherPlayerField
            : updatedFields.pushPlayerField,
        };
        setPlayerState(newPlayerState);
        setBotState(newBotState);

        setIsBotMove(activePlayerState.isControllable);

        const newIsGameRunningState = game.isRunning(
          newPlayerState,
          newBotState,
        );
        setIsGameRunning(newIsGameRunningState);

        setDiceState(game.throwDice());
      }
    },
    [game, playerState, botState, diceState],
  );

  useEffect(() => {
    setDiceState(game.throwDice());
    setIsBotMove(Math.random() >= 0.5);
    // console.log(window.matchMedia('(prefers-color-scheme: light)'));

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

    const handleChange = (evt: MediaQueryListEvent) =>
      setIsDarkMode(!evt.matches);

    if (mediaQuery.matches) {
      setIsDarkMode(false);
    }
    // Срабатывает когда пользователь меняет предпочтение темы без перезагрузки
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    // Логика хода бота
    if (isBotMove && isGameRunning) {
      setTimeout(() => {
        handlePlayerMove(
          botState,
          game.getAvailableColumns(botState)[
            Math.floor(
              Math.random() * game.getAvailableColumns(botState).length,
            )
          ],
          playerState,
        );
      }, botDelay);
    }
  }, [isBotMove, isGameRunning]);

  return (
    <>
      <Seo
        headTitle='My page'
        metaDescription='some description'
        iconLink='/favicon.ico'
      />
      <div className={clsx(s.page, isDarkMode ? s.dark : s.light)}>
        <main className={s.main}>
          {/* TODO: Обернуть Image в кнопку для доступности и 
          стилизовать обводку при выборе через tab */}
          <Image
            className={s.themeButton}
            src={isDarkMode ? '/light-mode.svg' : '/dark-mode.svg'}
            onClick={() => setIsDarkMode(!isDarkMode)}
            alt='theme-mode button'
            width={50}
            height={50}
            priority
          />
          <PlayerWidgets
            className={s.playerWidgets}
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
              handlePlayerMove(playerState, colIndex, botState);
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
                setIsBotMove(Math.random() >= 0.5);
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
            className={s.botWidgets}
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
