// TEMP!!!
// Временное сохранение очень плохой реализации knucklebones

export interface IPlayer {
  id: number;
  name: string;
  field: number[][];
}

export interface IGame {
  getAvailableColumns: (player: IPlayer) => number[]; // Возвращает индексы доступных колонок
  isRunning: () => boolean; // Проверка продолжительности игры
  calculatePlayerPoints: (player: IPlayer) => number;
  calculateGameResult: () => string; // Подсчёт результата игры
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

export class Player implements IPlayer {
  id: number;
  name: string;
  field: number[][] = [[], [], []];

  constructor(userId: number, userName: string) {
    this.id = userId;
    this.name = userName;
  }
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

  calculatePlayerPoints(player: IPlayer): number {
    return player.field.reduce(
      (fieldSum, column) =>
        fieldSum + column.reduce((columnSum, value) => columnSum + value, 0),
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
