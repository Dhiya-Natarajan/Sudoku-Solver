import React, { useState, useCallback } from 'react';
import './SudokuSolver.css';


function SudokuSolver() {
  // Initialize empty 9x9 board
  const [board, setBoard] = useState(
    Array(9).fill().map(() => Array(9).fill(0))
  );
  
  // Tracking solutions and status
  const [solutions, setSolutions] = useState([]);
  const [status, setStatus] = useState('');

  // Check if a value can be placed in a specific cell
  const check = useCallback((board, val, row, col) => {
    // Check row
    for (let c = 0; c < 9; c++) {
      if (c !== col && board[row][c] === val) return false;
    }

    // Check column
    for (let r = 0; r < 9; r++) {
      if (r !== row && board[r][col] === val) return false;
    }

    // Check 3x3 square
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if ((startRow + i === row && startCol + j === col)) continue;
        if (board[startRow + i][startCol + j] === val) return false;
      }
    }

    return true;
  }, []);

  // Solve Sudoku recursively
  const solveRecursive = useCallback((initialBoard) => {
    const solutions = [];
    const board = initialBoard.map(row => [...row]);

    const solve = (row, col) => {
      // Move to next row if column is complete
      if (col === 9) {
        solve(row + 1, 0);
        return;
      }

      // Reached end of board, solution found
      if (row === 9) {
        solutions.push(board.map(row => [...row]));
        return;
      }

      // If cell is empty, try filling with values
      if (board[row][col] === 0) {
        for (let val = 1; val <= 9; val++) {
          if (check(board, val, row, col)) {
            board[row][col] = val;
            solve(row, col + 1);
            board[row][col] = 0;
          }
        }
      } else {
        // If cell is pre-filled, validate and move to next cell
        if (check(board, board[row][col], row, col)) {
          solve(row, col + 1);
        }
      }
    };

    solve(0, 0);
    return solutions;
  }, [check]);

  // Update a cell's value
  const updateCell = (row, col, value) => {
    const newBoard = [...board];
    newBoard[row][col] = value === '' ? 0 : parseInt(value);
    setBoard(newBoard);
  };

  // Solve the Sudoku
  const solveSudoku = () => {
    setSolutions([]);
    setStatus('');

    try {
      const foundSolutions = solveRecursive(board);
      
      if (foundSolutions.length === 0) {
        setStatus('No solution exists');
      } else {
        setSolutions(foundSolutions);
        setStatus(`${foundSolutions.length} solution(s) found`);
      }
    } catch (error) {
      setStatus('Error solving Sudoku');
      console.error(error);
    }
  };

  // Reset the board
  const resetBoard = () => {
    setBoard(Array(9).fill().map(() => Array(9).fill(0)));
    setSolutions([]);
    setStatus('');
  };

  return (
    <div className="sudoku-solver">
      <h1>Sudoku Solver</h1>
      
      {/* Sudoku Input Grid */}
      <div className="sudoku-grid">
        {board.map((row, rowIndex) => 
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="number"
              min="0"
              max="9"
              value={cell || ''}
              onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
              className="sudoku-cell"
            />
          ))
        )}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button onClick={solveSudoku} className="solve-btn">
          Solve Sudoku
        </button>
        <button onClick={resetBoard} className="reset-btn">
          Reset Board
        </button>
      </div>

      {/* Status Message */}
      {status && (
        <div className={`status-message ${solutions.length ? 'success' : 'error'}`}>
          {status}
        </div>
      )}

      {/* Solutions Display */}
      {solutions.length > 0 && (
        <div className="solutions">
          <h2>Solutions:</h2>
          {solutions.map((solution, idx) => (
            <div key={idx} className="solution-board">
              {solution.map((row, rowIndex) => 
                row.map((cell, colIndex) => (
                  <div 
                    key={`${rowIndex}-${colIndex}`} 
                    className="solution-cell"
                  >
                    {cell}
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SudokuSolver;