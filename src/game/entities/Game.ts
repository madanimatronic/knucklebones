// export class Game {

// }

// TEMP!!!
// Временное сохранение очень плохой реализации knucklebones

interface IPlayer {
  id: number;
  name: string;
  field: number[][];
}

interface IGame {
  players: IPlayer[];
  getAvailableColumns: (player: IPlayer) => number[]; // Возвращает индексы доступных колонок
  isRunning: () => boolean; // Проверка продолжительности игры
  calculatePlayerPoints: (player: IPlayer) => number;
  calculateGameResult: () => string; // Подсчёт результата игры
  throwDice: () => number;
  pushDiceInColumn: (
    pushPlayer: IPlayer,
    columnIndex: number,
    diceValue: number,
  ) => void;
}

class Player implements IPlayer {
  id: number;
  name: string;
  field: number[][] = [[], [], []];

  constructor(userId: number, userName: string) {
    this.id = userId;
    this.name = userName;
  }
}

class Game implements IGame {
  players: IPlayer[];

  constructor(players: IPlayer[]) {
    this.players = players;
  }

  getAvailableColumns(player: IPlayer): number[] {
    const result: number[] = [];
    player.field.forEach((column, index) => {
      if (column.length < 3) result.push(index);
    });
    return result;
  }

  isRunning(): boolean {
    for (const player of this.players) {
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

  calculateGameResult(): string {
    // Защита
    if (this.players.length < 2) return 'error: less than 2 players';

    if (
      this.calculatePlayerPoints(this.players[0]) >
      this.calculatePlayerPoints(this.players[1])
    ) {
      return `${this.players[0].name} wins!`;
    } else if (
      this.calculatePlayerPoints(this.players[0]) ===
      this.calculatePlayerPoints(this.players[1])
    ) {
      return 'Draw!';
    } else {
      return `${this.players[1].name} wins!`;
    }
  }

  throwDice(): number {
    return Math.floor(Math.random() * 6 + 1);
  }

  pushDiceInColumn(
    pushPlayer: IPlayer,
    columnIndex: number,
    diceValue: number,
  ): void {
    // Защита
    if (!this.getAvailableColumns(pushPlayer).includes(columnIndex)) {
      console.error('Error: unavailable column push attempt');
      return;
    }

    pushPlayer.field[columnIndex].push(diceValue);

    this.players.forEach((player) => {
      if (player.id !== pushPlayer.id) {
        const mirroredIndex = player.field.length - 1 - columnIndex;
        player.field[mirroredIndex] = player.field[mirroredIndex].filter(
          (dice) => dice !== diceValue,
        );
      }
    });
  }
}

const mainPlayer = new Player(1, 'Super Main Player');
const bot = new Player(2, 'Bot1');

const game = new Game([mainPlayer, bot]);

let currentActivePlayer =
  game.players[Math.floor(Math.random() * game.players.length)];

for (let i = 0; i < 35; i++) {
  if (game.isRunning()) {
    // Проверка на не главного игрока
    if (currentActivePlayer.id !== 1) {
      const availableColumns = game.getAvailableColumns(currentActivePlayer);
      game.pushDiceInColumn(
        currentActivePlayer,
        availableColumns[Math.floor(Math.random() * availableColumns.length)],
        game.throwDice(),
      );
      currentActivePlayer = mainPlayer;
    } else {
      const diceValue = game.throwDice();
      const selectedColumn = Number(
        prompt(
          `dice value: ${diceValue}, your field: ${JSON.stringify(currentActivePlayer.field)}, bot field: ${JSON.stringify(bot.field)}; select column: ${game.getAvailableColumns(currentActivePlayer)}`,
          '',
        ),
      );
      game.pushDiceInColumn(currentActivePlayer, selectedColumn, diceValue);
      currentActivePlayer = bot;
    }
  } else {
    console.log(game.calculateGameResult());
    console.log('mainPlayer field:', mainPlayer.field);
    console.log('Bot field', bot.field);
    break;
  }
}
