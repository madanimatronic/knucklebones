import { nanoid } from 'nanoid';
import { FC } from 'react';
import s from './PlayerField.module.scss';

interface PlayerFieldProps {
  fieldData: number[][];
}

export const PlayerField: FC<PlayerFieldProps> = ({ fieldData }) => {
  return (
    <div className={s.field}>
      {fieldData.map((column) => (
        <div key={nanoid()} className={s.column}>
          {column.map((value) => (
            <div key={nanoid()} className={s.square}>
              {value}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
