import { useState, useRef } from 'react';
import styled from 'styled-components';
import html2canvas from 'html2canvas';

const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

const Input = styled.textarea`
  width: 100%;
  height: 100px;
  margin: 1rem 0;
  padding: 0.5rem;
  font-family: 'Courier New', monospace;
`;

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin: 1rem;

  &:hover {
    background-color: #45a049;
  }
`;

const PuzzleContainer = styled.div`
  position: relative;
  margin: 2rem auto;
  background-color: white;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(15, 1fr);
  gap: 1px;
  background-color: #000;
  padding: 1px;
  margin: 0 auto;
  max-width: 600px;
  position: relative;
`;

const Cell = styled.div`
  background-color: white;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Caveat', cursive;
  font-size: 1.2rem;
`;

const WordOverlay = styled.div`
  position: absolute;
  height: 2px;
  background: #808080;
  transform-origin: left center;
  pointer-events: none;
  z-index: 2;
`;

const Title = styled.h1`
  font-family: 'Caveat', cursive;
  color: #333;
`;

const WordList = styled.div`
  margin: 2rem auto;
  max-width: 600px;
  text-align: left;
  padding: 1rem;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`;

const WordItem = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
  font-family: 'Caveat', cursive;
  font-size: 1.2rem;
  
  input[type="checkbox"] {
    margin-right: 1rem;
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

function App() {
  const [words, setWords] = useState('');
  const [puzzle, setPuzzle] = useState([]);
  const [wordPositions, setWordPositions] = useState({});
  const [wordDirections, setWordDirections] = useState({});
  const [foundWords, setFoundWords] = useState({});
  const puzzleRef = useRef(null);
  const gridRef = useRef(null);

  const generatePuzzle = () => {
    const wordList = words.split(',').map(word => word.trim().toUpperCase());
    const gridSize = 15;
    const grid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
    const positions = {};
    const directions = {};
    
    // Place words in the grid
    wordList.forEach(word => {
      let placed = false;
      while (!placed) {
        const direction = Math.floor(Math.random() * 8); // 0-7 for 8 directions
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);
        
        if (canPlaceWord(grid, word, row, col, direction)) {
          const wordCells = placeWord(grid, word, row, col, direction);
          positions[word] = wordCells;
          directions[word] = direction;
          placed = true;
        }
      }
    });

    // Fill empty spaces with random letters
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (grid[i][j] === '') {
          grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    setPuzzle(grid);
    setWordPositions(positions);
    setWordDirections(directions);
    setFoundWords({});
  };

  const canPlaceWord = (grid, word, row, col, direction) => {
    const gridSize = grid.length;
    const wordLength = word.length;
    
    // Check if word fits in the grid
    for (let i = 0; i < wordLength; i++) {
      let newRow = row;
      let newCol = col;
      
      switch (direction) {
        case 0: newRow -= i; break; // up
        case 1: newRow -= i; newCol += i; break; // up-right
        case 2: newCol += i; break; // right
        case 3: newRow += i; newCol += i; break; // down-right
        case 4: newRow += i; break; // down
        case 5: newRow += i; newCol -= i; break; // down-left
        case 6: newCol -= i; break; // left
        case 7: newRow -= i; newCol -= i; break; // up-left
      }
      
      if (newRow < 0 || newRow >= gridSize || newCol < 0 || newCol >= gridSize) {
        return false;
      }
      
      if (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[i]) {
        return false;
      }
    }
    
    return true;
  };

  const placeWord = (grid, word, row, col, direction) => {
    const wordLength = word.length;
    const cells = [];
    
    for (let i = 0; i < wordLength; i++) {
      let newRow = row;
      let newCol = col;
      
      switch (direction) {
        case 0: newRow -= i; break;
        case 1: newRow -= i; newCol += i; break;
        case 2: newCol += i; break;
        case 3: newRow += i; newCol += i; break;
        case 4: newRow += i; break;
        case 5: newRow += i; newCol -= i; break;
        case 6: newCol -= i; break;
        case 7: newRow -= i; newCol -= i; break;
      }
      
      grid[newRow][newCol] = word[i];
      cells.push({ row: newRow, col: newCol });
    }
    
    return cells;
  };

  const getOverlayStyle = (word) => {
    if (!gridRef.current || !wordPositions[word]) return {};
    
    const cells = wordPositions[word];
    const direction = wordDirections[word];
    const gridRect = gridRef.current.getBoundingClientRect();
    const cellSize = gridRect.width / 15; // 15x15 grid
    
    const firstCell = cells[0];
    const lastCell = cells[cells.length - 1];
    
    const startX = firstCell.col * cellSize + cellSize / 2;
    const startY = firstCell.row * cellSize + cellSize / 2;
    const endX = lastCell.col * cellSize + cellSize / 2;
    const endY = lastCell.row * cellSize + cellSize / 2;
    
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
    
    return {
      width: `${length}px`,
      left: `${startX}px`,
      top: `${startY}px`,
      transform: `rotate(${angle}deg)`,
    };
  };

  const downloadPuzzle = async () => {
    if (puzzleRef.current) {
      const canvas = await html2canvas(puzzleRef.current);
      const link = document.createElement('a');
      link.download = 'word-puzzle.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleWordFound = (word) => {
    setFoundWords(prev => ({
      ...prev,
      [word]: !prev[word]
    }));
  };

  return (
    <AppContainer>
      <Title>Word Puzzle Generator</Title>
      <p>Enter words separated by commas:</p>
      <Input
        value={words}
        onChange={(e) => setWords(e.target.value)}
        placeholder="Enter words separated by commas..."
      />
      <Button onClick={generatePuzzle}>Generate Puzzle</Button>
      {puzzle.length > 0 && (
        <>
          <PuzzleContainer ref={puzzleRef}>
            <Grid ref={gridRef}>
              {puzzle.map((row, i) =>
                row.map((cell, j) => (
                  <Cell key={`${i}-${j}`}>
                    {cell}
                  </Cell>
                ))
              )}
              {Object.entries(foundWords).map(([word, found]) => 
                found && (
                  <WordOverlay
                    key={word}
                    style={getOverlayStyle(word)}
                  />
                )
              )}
            </Grid>
          </PuzzleContainer>
          <WordList>
            <h3>Words to Find:</h3>
            {words.split(',').map((word, index) => (
              <WordItem key={index}>
                <input
                  type="checkbox"
                  checked={foundWords[word.trim().toUpperCase()] || false}
                  onChange={() => handleWordFound(word.trim().toUpperCase())}
                />
                {word.trim()}
              </WordItem>
            ))}
          </WordList>
          <Button onClick={downloadPuzzle}>Download Puzzle</Button>
        </>
      )}
    </AppContainer>
  );
}

export default App; 