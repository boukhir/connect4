import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  /** Variable that stores the state of the dark mode switch **/
  darkModeChecked: boolean = false;

  /** Initialized game board that can contain 3 types of strings : emptyCell, redPawn or yellowPawn **/
  board: string[][] = [
    ['emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell'],

    ['emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell'],

    ['emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell'],

    ['emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell'],

    ['emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell'],

    ['emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell']
  ];

  /** Variables that store the indices of the rows and columns that make up the board **/
  rows: number[] = [0, 1, 2, 3, 4, 5];
  columns: number[] = [0, 1, 2, 3, 4, 5, 6];

  /** Variable that stores the state of the game **/
  gameStarted: boolean = true;

  /** Variable that stores the reference of the current player's turn :
   * player 1 = false
   * player 2 = true
   * Initialized with a random value **/
  turn: boolean = Math.round(Math.random() * 1) == 1 ? true : false;

  /** Variable that stores the reference of the message to be displayed :
   *  firstGame = "The game automatically started! Player X was randomly chosen to start!"
   *  turnInfo = "Player X, it's your turn!"
   *  gameOverWinner = "Player X won the game!"
   *  gameOverTie = "All cells are filled, the game ends in a draw!"
   *  newGame = "A new game has started! Player X was randomly chosen to start!"
   *  tryAgain = "Player X, please choose a column with at least one empty cell!"
   * Initialized with "firstGame" value **/
  message: string = "firstGame";

  /** Method that checks if there are any free cells to continue the game. **/
  freeCellsLeft(): boolean {
    for (let i = 0; i < 6; i++) {
      if (this.board[i].includes("emptyCell")) {
        return true;
      }
    }
    return false;
  }

  /** Method that allows to drop a pawn in the lowest empty cell of the chosen column.
   * The game must have started to drop a pawn.
   * If an empty cell is found, its state is changed to the color of the player who dropped the pawn, the turn is changed, and the next user is informed of his turn.
   * This method also checks if there is a winner each time it's called**/
  dropPawn(chosenColumn: number): void {
    if (!this.freeCellsLeft()) {
      this.gameOver("tie");
      console.log("no more cells");
    }
    if (this.gameStarted) {
      let rowsOfTheColumn: number = this.rows.length - 1;
      while (rowsOfTheColumn >= 0) {
        if (this.board[rowsOfTheColumn][chosenColumn] == 'emptyCell') {
          this.board[rowsOfTheColumn][chosenColumn] = this.turn ? 'redPawn' : 'yellowPawn';
          this.turn = !this.turn;
          this.message = "turnInfo";
          rowsOfTheColumn = -1;
        }
        rowsOfTheColumn--;
        if (rowsOfTheColumn == 0) {
          this.message = "tryAgain";
        }
      }
    }
    this.checkWinner();
  }

  /** Method that changes the state of the game and informs the player about it**/
  gameOver(gameResult: string): void {
    if (gameResult == "winner") {
      this.message = "gameOverWinner";
    } else if (gameResult == "tie") {
      this.message = "gameOverTie";
    }
    this.gameStarted = false;
  }

  /** Method that resets the state of the game, the board, the turn and the message to show **/
  newGame(): void {
    this.gameStarted = true;
    this.board = [
      ['emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell'],

      ['emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell'],

      ['emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell'],

      ['emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell'],

      ['emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell'],

      ['emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell', 'emptyCell']
    ];
    this.turn = Math.round(Math.random() * 1) == 1 ? true : false;
    this.message = "newGame";
  }

  /** Method that checks if a series of 4 pawns of the same color are lined up on the board**/
  checkWinner(): void {
    // Horizontal check
    for (let row = 0; row <= this.rows.length - 1; row++) {
      for (let column = 0; column < this.columns.length - 3; column++) {
        if (this.board[row][column] != 'emptyCell') {
          if (this.board[row][column] == this.board[row][column + 1] &&
            this.board[row][column + 1] == this.board[row][column + 2] &&
            this.board[row][column + 2] == this.board[row][column + 3]) {
            for (let i = 0; i < 4; i++) {
              this.board[row][column + i] = this.turn ? 'yellowPawnWinner' : 'redPawnWinner';
            }
            this.gameOver("winner");
          }
        }
      }
    }
    //Vertical check
    for (let column = 0; column < this.columns.length; column++) {
      for (let row = 0; row <= this.rows.length - 4; row++) {
        if (this.board[row][column] != 'emptyCell') {
          if (this.board[row][column] == this.board[row + 1][column] &&
            this.board[row + 1][column] == this.board[row + 2][column] &&
            this.board[row + 2][column] == this.board[row + 3][column]) {
            for (let i = 0; i < 4; i++) {
              this.board[row + i][column] = this.turn ? 'yellowPawnWinner' : 'redPawnWinner';
            }
            this.gameOver("winner");
          }
        }
      }
    }
    // Ascending diagonal check
    for (let column = 0; column < this.columns.length - 3; column++) {
      for (let row = 0; row <= this.rows.length - 4; row++) {
        if (this.board[row][column] != 'emptyCell') {
          if (this.board[row][column] == this.board[row + 1][column + 1] &&
            this.board[row + 1][column + 1] == this.board[row + 2][column + 2] &&
            this.board[row + 2][column + 2] == this.board[row + 3][column + 3]) {
            for (let i = 0; i < 4; i++) {
              this.board[row + i][column + i] = this.turn ? 'yellowPawnWinner' : 'redPawnWinner';
            }
            this.gameOver("winner");
          }
        }
      }
    }
    // Descending diagonal check
    for (let column = 3; column < this.columns.length; column++) {
      for (let row = 0; row <= this.rows.length - 4; row++) {
        if (this.board[row][column] != 'emptyCell') {
          if (this.board[row][column] == this.board[row + 1][column - 1] &&
            this.board[row + 1][column - 1] == this.board[row + 2][column - 2] &&
            this.board[row + 2][column - 2] == this.board[row + 3][column - 3]) {
            for (let i = 0; i < 4; i++) {
              this.board[row + i][column - i] = this.turn ? 'yellowPawnWinner' : 'redPawnWinner';
            }
            this.gameOver("winner");
          }
        }
      }
    }
  }

}
