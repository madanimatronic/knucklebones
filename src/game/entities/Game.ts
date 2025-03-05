import { IPlayer } from './Player';

export interface IGame {
  // Возвращает индексы доступных колонок
  getAvailableColumns: (player: IPlayer) => number[];
  // Проверка продолжительности игры
  isRunning: (...players: IPlayer[]) => boolean;
  // Возвращает массив, где каждый элемент - это кол-во повторений
  // элемента на том же месте в исходной колонке (null для пустых клеток)
  calculateColumnDuplicates: (column: (number | null)[]) => number[];
  // Аналогично calculateColumnDuplicates, но возвращает поле повторений
  calculateFieldDuplicates: (field: (number | null)[][]) => number[][];
  calculateColumnPoints: (column: number[]) => number;
  calculatePlayerPoints: (player: IPlayer) => number;
  // Подсчёт результата игры
  calculateGameResult: (...players: IPlayer[]) => string;
  throwDice: () => number;
  // Возвращает новые поля игроков или undefined при ошибке
  pushDiceInColumn: (
    pushPlayer: IPlayer,
    columnIndex: number,
    diceValue: number,
    otherPlayer: IPlayer,
  ) =>
    | {
        pushPlayerField: number[][];
        otherPlayerField: number[][];
      }
    | undefined;
}

export class Game implements IGame {
  getAvailableColumns(player: IPlayer): number[] {
    const result: number[] = [];
    player.field.forEach((column, index) => {
      if (column.length < 3) result.push(index);
    });
    return result;
  }

  isRunning(...players: IPlayer[]): boolean {
    for (const player of players) {
      if (this.getAvailableColumns(player).length === 0) return false;
    }
    return true;
  }

  calculateColumnDuplicates(column: (number | null)[]): number[] {
    const duplicates = new Map<number | null, number>();
    column.forEach((value) => {
      duplicates.set(value, (duplicates.get(value) || 0) + 1);
    });
    return column.map((value) => duplicates.get(value)!);
  }

  calculateFieldDuplicates(field: (number | null)[][]): number[][] {
    return field.map((column) => this.calculateColumnDuplicates(column));
  }

  calculateColumnPoints(column: number[]): number {
    let points = 0;
    // Каждому элементу в колонке соответствует значение из duplicates,
    // означающее сколько раз этот элемент встречается в колонке
    const duplicates = this.calculateColumnDuplicates(column);
    // Счётчик повторений
    let duplicatesCount = 0;

    // Проходим по массиву duplicates и высчитываем очки
    // в соответствии с количеством повторений данного элемента в колонке
    for (let i = 0; i < duplicates.length; i++) {
      // Счётчик повторений не может быть больше, чем самих элементов
      // в колонке
      if (duplicatesCount + duplicates[i] <= column.length) {
        duplicatesCount += duplicates[i];
        switch (duplicates[i]) {
          case 1:
            points += column[i];
            break;
          case 2:
            points += column[i] * 4;
            break;
          case 3:
            points += column[i] * 9;
            break;
        }
      }
      if (duplicatesCount === column.length) break;
    }

    return points;
  }

  calculatePlayerPoints(player: IPlayer): number {
    return player.field.reduce(
      (accum, column) => accum + this.calculateColumnPoints(column),
      0,
    );
  }

  calculateGameResult(...players: IPlayer[]): string {
    // Защита
    if (players.length < 2) return 'error: less than 2 players';

    if (
      this.calculatePlayerPoints(players[0]) >
      this.calculatePlayerPoints(players[1])
    ) {
      return `${players[0].name} wins!`;
    } else if (
      this.calculatePlayerPoints(players[0]) ===
      this.calculatePlayerPoints(players[1])
    ) {
      return 'Draw!';
    } else {
      return `${players[1].name} wins!`;
    }
  }

  throwDice(): number {
    return Math.floor(Math.random() * 6 + 1);
  }

  pushDiceInColumn(
    pushPlayer: IPlayer,
    columnIndex: number,
    diceValue: number,
    otherPlayer: IPlayer,
  ):
    | {
        pushPlayerField: number[][];
        otherPlayerField: number[][];
      }
    | undefined {
    // Защита
    if (!this.getAvailableColumns(pushPlayer).includes(columnIndex)) {
      console.error('Error: unavailable column push attempt');
      return;
    }

    // Копируем поля игроков
    const result = {
      pushPlayerField: pushPlayer.field.map((column) => [...column]),
      otherPlayerField: otherPlayer.field.map((column) => [...column]),
    };

    result.pushPlayerField[columnIndex].push(diceValue);

    const mirroredIndex = result.otherPlayerField.length - 1 - columnIndex;
    result.otherPlayerField[mirroredIndex] = result.otherPlayerField[
      mirroredIndex
    ].filter((dice) => dice !== diceValue);

    return result;
  }
}
