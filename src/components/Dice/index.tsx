import clsx from 'clsx';
import { nanoid } from 'nanoid';
import { FC } from 'react';
import s from './Dice.module.scss';

// Ключ - грань кубика
// Значение - массив точек
// Каждой точке соответствует строка и колонка
// в grid (для grid-row, grid-column)
export const diceGridPatterns: Record<number, number[][]> = {
  1: [[2, 2]],
  2: [
    [1, 3],
    [3, 1],
  ],
  3: [
    [1, 3],
    [2, 2],
    [3, 1],
  ],
  4: [
    [1, 1],
    [1, 3],
    [3, 1],
    [3, 3],
  ],
  5: [
    [1, 1],
    [1, 3],
    [2, 2],
    [3, 1],
    [3, 3],
  ],
  6: [
    [1, 1],
    [1, 3],
    [2, 1],
    [2, 3],
    [3, 1],
    [3, 3],
  ],
};

interface DiceProps {
  // От 1 до 6 вкл.
  value: number;
  className?: string;
}

export const Dice: FC<DiceProps> = ({
  value,
  className: additionalClassName,
}) => {
  if (value < 1 || value > 6) {
    console.error(
      `Error: dice value should be between 1 and 6. Value: ${value}`,
    );
    return;
  }

  const dots = [];
  for (let i = 0; i < value; i++) {
    dots.push(
      <div
        key={nanoid()}
        className={s.dot}
        style={{
          gridRow: diceGridPatterns[value][i][0],
          gridColumn: diceGridPatterns[value][i][1],
        }}
      />,
    );
  }
  return <div className={clsx(s.dice, additionalClassName)}>{dots}</div>;
};
