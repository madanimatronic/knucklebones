import clsx from 'clsx';
import { FC } from 'react';
import { Dice } from '../Dice';
import s from './PlayerWidgets.module.scss';

interface PlayerWidgetsProps {
  playerName: string;
  playerPoints: number;
  diceValue: number;
  isMainPlayer?: boolean;
  className?: string;
  isDiceHidden?: boolean;
}

export const PlayerWidgets: FC<PlayerWidgetsProps> = ({
  playerName,
  playerPoints,
  diceValue,
  isMainPlayer = false,
  className: additionalClassName,
  isDiceHidden = false,
}) => {
  return (
    <div
      className={clsx(
        s.playerWidgets,
        { [s.reversed]: !isMainPlayer },
        additionalClassName,
      )}
    >
      <p className={s.stats}>
        {playerName}
        <br />
        {playerPoints}
      </p>
      <div className={clsx(s.board, { [s.mainPlayer]: isMainPlayer })}>
        <Dice
          className={clsx({ [s.hidden]: isDiceHidden })}
          value={diceValue}
        />
      </div>
    </div>
  );
};
