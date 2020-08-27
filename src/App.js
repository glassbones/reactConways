import React, { useState, useCallback, useEffect, useRef } from "react";
import produce from 'immer';
import useWindowDimensions from './utils/useWindow';

//init vars
//const colNum = 50
//const rowNum = 32
const cellSize = 30
const updateSpeed = 500
// [0,1] [0,-1] [1,-1] [-1,1] [1,1] [-1,-1] [1,0],[-1,0]
const ops = Array(9).fill(1).map( (i,num) => [Math.floor(num/3) - 1 ,num % 3 - 1] )
const gridStyle = () => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${rowNum}, ${cellSize}px)`,
  }
)
const cellStyle = (bool) => ({
    width: cellSize,
    height: cellSize,
    backgroundColor: bool ? undefined : "black",
    border: "solid 1px black"
  }
)


// App
const App = () => {
  const { height, width } = useWindowDimensions();
  const [colNum, setColNum] = useState(50)
  const [rowNum, setRowNum] = useState(10)

  //create state for grid. (colNum x rowNum)
  const [grid, setGrid] = useState(Array.from({length: colNum}).map(() => Array.from({length: rowNum}).fill(0)))
  //create state for start/stop button 
  const [isActive, setIsActive] = useState(false)
  // really ugly statemanagement to avoid loop during simulate()
  const activeRef = useRef(isActive)
  activeRef.current = isActive

  

  // game logic loop
  const simulate = useCallback(() => {
    if (!activeRef.current) return;

    setGrid((currentGrid) => (
      produce(currentGrid, gridClone =>{
        //for each cell
        for(let row = 0; row < rowNum; row++){
          for(let col = 0; col < colNum; col++){
            let neighbors = 0;
            // itterate through neighbors via the opps array
            ops.forEach(([x,y]) => {
              const neighborX = row + x
              const neighborY = col + y
              // make sure neighbors arent out of bounds (outside the grid)
              if ( ( neighborX >= 0 && neighborX < rowNum ) && ( neighborY >= 0 && neighborY < colNum ) ){
                // add neighbor (int values 0 or 1) to the neighbor count
                neighbors += currentGrid[neighborX][neighborY]
              }
            })
            // if 1 or 4 neighbors cell dies next gen 💩
            if (neighbors < 2 || neighbors > 3) gridClone[row][col] = 0
            // if current cell is dead and has 3 neighbors it is born next gen 👍
            else if (currentGrid[row][col] === 0 && neighbors === 3) gridClone[row][col] = 1
          }
        }
      })
    )) 
    //delay before updating
    setTimeout(simulate, updateSpeed); 
  },[]);


  
  return (
    <div>
      <div>
        width: {width} ~ height: {height}
      </div>
      <div style={gridStyle()}>
        {grid.map((row, rowIdx) =>
          row.map((col, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              onClick={()=> {
                //onclick clone the grid -------> in clone set cell to !cell ------> returns as setState(clonedState) 🙂 THANKS IMMER!
                setGrid(produce(grid, gridClone => {gridClone[rowIdx][colIdx] ^= 1}))
              }}
              // if (cell logic here to change background color if not)
              style={cellStyle(grid[rowIdx][colIdx])}           
            />
          ))   
        )}
      </div>

      <button //start button
        onClick={()=> {
          //ugly start/stop logic on click
          setIsActive(!isActive)
          if (!isActive){
            activeRef.current = true
            simulate()
          }
        }}>
        {isActive ? 'stop' : 'start' }
      </button>


    </div>
  )
}
export default App;
