import clsx from 'clsx';
import { FC } from 'react';
import s from './PlayerWidgets.module.scss';

interface PlayerWidgetsProps {
  playerName: string;
  playerPoints: number;
  diceValue: number;
  isMainPlayer?: boolean;
}

export const PlayerWidgets: FC<PlayerWidgetsProps> = ({
  playerName,
  playerPoints,
  diceValue,
  isMainPlayer = false,
}) => {
  return (
    <div className={clsx(s.playerWidgets, { [s.reversed]: !isMainPlayer })}>
      <p className={s.stats}>
        {playerName}
        <br />
        {playerPoints}
      </p>
      <div className={clsx(s.board, { [s.mainPlayer]: isMainPlayer })}>
        {diceValue}
      </div>
    </div>
  );
};
