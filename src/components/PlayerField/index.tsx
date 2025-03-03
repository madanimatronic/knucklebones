import clsx from 'clsx';
import { nanoid } from 'nanoid';
import { FC, MouseEvent } from 'react';
import s from './PlayerField.module.scss';

interface PlayerFieldProps {
  fieldData: number[][];
  isInteractive?: boolean;
  availableColumns?: number[];
  columnClickCallback?: (columnIndex: number) => void;
  isMainPlayer?: boolean;
}

export const PlayerField: FC<PlayerFieldProps> = ({
  fieldData,
  isInteractive = false,
  availableColumns,
  columnClickCallback,
  isMainPlayer = false,
}) => {
  const handleColumnClick = (evt: MouseEvent<HTMLDivElement>) => {
    if (isInteractive && columnClickCallback) {
      const target = evt.currentTarget as HTMLDivElement;
      columnClickCallback(Number(target.id));
    }
  };
  // Форматированные данные для рендера
  const formattedFieldData = fieldData.map((column) => {
    const formattedColumn = [];
    for (let i = 0; i < fieldData.length; i++) {
      formattedColumn.push(column[i] ? column[i] : null);
    }
    return formattedColumn;
  });
  return (
    <div className={clsx(s.field, { [s.mainPlayer]: isMainPlayer })}>
      {formattedFieldData.map((column, index) => (
        <div
          key={nanoid()}
          id={isInteractive ? String(index) : undefined}
          onClick={
            availableColumns
              ? availableColumns.includes(index)
                ? handleColumnClick
                : undefined
              : handleColumnClick
          }
          className={clsx(
            s.column,
            { [s.reversed]: !isMainPlayer },
            isInteractive &&
              (availableColumns
                ? availableColumns.includes(index) && s.interactive
                : s.interactive),
          )}
        >
          {column.map((value) =>
            value !== null ? (
              <div key={nanoid()} className={s.square}>
                {value}
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
