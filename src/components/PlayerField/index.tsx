import clsx from 'clsx';
import { nanoid } from 'nanoid';
import { FC, MouseEvent } from 'react';
import { Dice } from '../Dice';
import s from './PlayerField.module.scss';

interface PlayerFieldProps {
  fieldData: number[][];
  calculateColumnPointsFunction: (column: number[]) => number;
  calculateFieldDuplicatesFunction: (field: (number | null)[][]) => number[][];
  isInteractive?: boolean;
  availableColumns?: number[];
  columnClickCallback?: (columnIndex: number) => void;
  isMainPlayer?: boolean;
  className?: string;
}

// TODO: цвета можно сделать через calculateFieldDuplicates
// например, если элементу соответствует 2 из calculateFieldDuplicates, то
// значит, что он повторяется дважды и присваиваем ему класс с синим цветом
export const PlayerField: FC<PlayerFieldProps> = ({
  fieldData,
  calculateColumnPointsFunction,
  calculateFieldDuplicatesFunction,
  isInteractive = false,
  availableColumns,
  columnClickCallback,
  isMainPlayer = false,
  className: additionalClassName,
}) => {
  // TODO: сделать оптимизацию объявлений функций и подсчётов (useMemo и т.д.)
  const handleColumnClick = (evt: MouseEvent<HTMLDivElement>) => {
    if (isInteractive && columnClickCallback) {
      const target = evt.currentTarget as HTMLDivElement;
      columnClickCallback(Number(target.id));
    }
  };
  const columnPoints = fieldData.map((column) =>
    calculateColumnPointsFunction(column),
  );
  // Каждый элемент в колонке - это кол-во повторений этого же элемента в колонке исходного поля
  const fieldDuplications = calculateFieldDuplicatesFunction(fieldData);
  // Форматированные данные для рендера (TODO: можно вынести в функцию)
  const formattedFieldData = fieldData.map((column) => {
    const formattedColumn = [];
    for (let i = 0; i < fieldData.length; i++) {
      formattedColumn.push(column[i] ? column[i] : null);
    }
    return formattedColumn;
  });
  return (
    <div
      className={clsx(
        s.field,
        { [s.mainPlayer]: isMainPlayer },
        additionalClassName,
      )}
    >
      <div
        className={clsx(s.columnPointsContainer, { [s.upper]: isMainPlayer })}
      >
        {columnPoints.map((value) => (
          <div key={nanoid()} className={s.value}>
            {value}
          </div>
        ))}
      </div>
      {formattedFieldData.map((column, colIndex) => (
        <div
          key={nanoid()}
          id={isInteractive ? String(colIndex) : undefined}
          onClick={
            availableColumns
              ? availableColumns.includes(colIndex)
                ? handleColumnClick
                : undefined
              : handleColumnClick
          }
          className={clsx(
            s.column,
            { [s.reversed]: !isMainPlayer },
            isInteractive &&
              (availableColumns
                ? availableColumns.includes(colIndex) && s.interactive
                : s.interactive),
          )}
        >
          {column.map((value, squareIndex) =>
            value !== null ? (
              <div key={nanoid()} className={s.square}>
                <Dice
                  className={clsx({
                    [s.double]: fieldDuplications[colIndex][squareIndex] === 2,
                    [s.triple]: fieldDuplications[colIndex][squareIndex] === 3,
                  })}
                  value={value}
                />
              </div>
            ) : (
              <div key={nanoid()} className={s.square}></div>
            ),
          )}
        </div>
      ))}
    </div>
  );
};
