import React from "react";

const rowStyle = {
  display: "flex"
};

const squareStyle = {
  width: "60px",
  height: "60px",
  backgroundColor: "#ddd",
  margin: "4px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "20px",
  color: "white"
};

const boardStyle = {
  backgroundColor: "#eee",
  width: "208px",
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
  flexDirection: "column",
  border: "3px #eee solid"
};

const containerStyle = {
  display: "flex",
  alignItems: "center",
  flexDirection: "column"
};

const instructionsStyle = {
  marginTop: "5px",
  marginBottom: "5px",
  fontWeight: "bold",
  fontSize: "16px"
};

const buttonStyle = {
  marginTop: "15px",
  marginBottom: "16px",
  width: "80px",
  height: "40px",
  backgroundColor: "#8acaca",
  color: "white",
  fontSize: "16px"
};

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ clicked: true });
    this.props.onCellClick(this.props.row, this.props.column);
  }

  render() {
    return (
      <div className="square" onClick={this.handleClick} style={squareStyle}>
        {this.props.symbol !== null && this.props.symbol}
      </div>
    );
  }
}

const initialState = {
  cells: [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ],
  nextSymbol: "X",
  winner: "none"
};

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...initialState, score: { X: 0, 0: 0 } };
    this.onCellClick = this.onCellClick.bind(this);
    this.reset = this.reset.bind(this);
    this.checkHasWon = this.checkHasWon.bind(this);
  }

  reset() {
    this.setState(initialState);
  }

  checkHasWon(row, col) {
    if (
      this.hasWonOnRow(row) ||
      this.hasWonOnColum(col) ||
      ((col === row || (col === 2 && row === 0) || (col === 0 && row === 2)) &&
        this.hasWonOnDiag(row, col))
    ) {
      const { nextSymbol, score } = this.state;
      this.setState({ winner: nextSymbol });
      const newScore = score[nextSymbol] + 1;
      this.setState({ score: { ...score, [nextSymbol]: newScore } });
    }
  }

  hasWonOnRow(row) {
    const rowCells = [
      this.state.cells[row][0],
      this.state.cells[row][1],
      this.state.cells[row][2]
    ];
    return rowCells[0] === rowCells[1] && rowCells[1] === rowCells[2];
  }

  hasWonOnColum(col) {
    const colCells = [
      this.state.cells[0][col],
      this.state.cells[1][col],
      this.state.cells[2][col]
    ];
    return colCells[0] === colCells[1] && colCells[1] === colCells[2];
  }

  hasWonOnDiag(row, col) {
    const diagCells =
      row === col
        ? [
            this.state.cells[0][0],
            this.state.cells[1][1],
            this.state.cells[2][2]
          ]
        : [
            this.state.cells[2][0],
            this.state.cells[1][1],
            this.state.cells[0][2]
          ];
    return diagCells[0] === diagCells[1] && diagCells[1] === diagCells[2];
  }

  onCellClick(row, column) {
    if (this.state.cells[row][column] || this.state.winner !== "none") {
      return;
    }

    const newCells = [
      [...this.state.cells[0]],
      [...this.state.cells[1]],
      [...this.state.cells[2]]
    ];

    const nextSymbol = this.state.nextSymbol === "X" ? "0" : "X";
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (i === row && j === column) {
          newCells[i][j] = nextSymbol;
        }
      }
    }

    this.setState(
      {
        cells: newCells,
        nextSymbol
      },
      this.checkHasWon.bind(this, row, column)
    );
  }

  render() {
    const { cells, score, winner } = this.state;

    return (
      <div style={containerStyle} className="gameBoard">
        <div id="statusArea" className="status" style={instructionsStyle}>
          Next player: <span>X</span>
        </div>
        <div id="winnerArea" className="winner" style={instructionsStyle}>
          Winner: <span>{winner}</span>
        </div>
        <div>
          <span>X: {score.X}</span> <span>0: {score["0"]}</span>
        </div>
        <button style={buttonStyle} onClick={this.reset}>
          Reset
        </button>
        <div style={boardStyle}>
          {[0, 1, 2].map((rowIndex) => (
            <div className="board-row" key={rowIndex} style={rowStyle}>
              {[0, 1, 2].map((colIndex) => (
                <Square
                  column={colIndex}
                  key={colIndex}
                  onCellClick={this.onCellClick}
                  row={rowIndex}
                  symbol={cells[rowIndex][colIndex]}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nextSymbol: "X"
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ nextSymbol: this.state.nextSymbol === "X" ? "0" : "X" });
  }

  render() {
    return (
      <div className="game">
        <div className="game-board" onClick={this.handleClick}>
          <Board />
        </div>
      </div>
    );
  }
}

export default Game;
