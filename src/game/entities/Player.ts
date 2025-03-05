export interface IPlayer {
  id: number;
  name: string;
  field: number[][];
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
