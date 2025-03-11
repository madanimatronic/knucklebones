export interface IPlayer {
  id: number;
  name: string;
  field: number[][];
  isControllable: boolean;
}

export class Player implements IPlayer {
  id: number;
  name: string;
  field: number[][] = [[], [], []];
  isControllable: boolean;

  constructor(
    userId: number,
    userName: string,
    isControllable: boolean = false,
  ) {
    this.id = userId;
    this.name = userName;
    this.isControllable = isControllable;
  }
}
