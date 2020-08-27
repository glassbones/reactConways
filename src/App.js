import React, { useState, useCallback } from "react";
import produce from 'immer';

//init vars
const colNum = 50
const rowNum = 50
const cellSize = 15

const gridStyle = () => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${rowNum}, ${cellSize}px)`,
  }
)

//height: rowNum*cellSize,
//width: '100%',

// cell styling
const cellStyle = (bool) => ({
    width: cellSize,
    height: cellSize,
    backgroundColor: bool ? "pink" : undefined,
    border: "solid 1px grey"
  }
)

// [0,1] [0,-1] [1,-1] [-1,1] [1,1] [-1,-1] [1,0],[-1,0]
const ops = Array(9).fill(1).map( (i,num) => [Math.floor(num/3) - 1 ,num % 3 - 1] )

const App = () => {
  //create state for grid. (colNum x rowNum)
  const [grid, setGrid] = useState(Array.from({length: colNum}).map(() => Array.from({length: rowNum}).fill(0)))
  const [isActive, setIsActive] = useState(false)

  const simulate = useCallback(()=>{
    if (!isActive) return;

    setGrid((currentGrid) => {
      return produce(currentGrid, gridClone =>{
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
            if (neighbors < 2 || neighbors > 3) gridCopy[row][col] = 0
            // if current cell is dead and has 3 neighbors it is born next gen 👍
            else if (currentGrid[row][col] === 0 && neighbors === 3) gridClone[row][col] = 1
              
            
          }
        }
      })
    })


    //rate
    setTimeout(simulate, 1000)
  }, [isActive])
  //useEffect(() => running && runSimulation(), [running])

  return (
    <>
      <button onClick={()=> setIsActive(!isActive)}>
        {isActive ? 'stop' : 'start' }
      </button>

      <div style={gridStyle()}>

          {grid.map((row, rowIdx) =>
            row.map((col, colIdx) => (
              <div
                key={`${rowIdx}-${colIdx}`}
                onClick={()=> {
                  //onclick clone the grid -------> in clone set cell to !cell ------> returns as setState(clonedState) 🙂 THANKS IMMER!
                  setGrid(produce(grid, gridCopy => {gridCopy[rowIdx][colIdx] ^= 1}))
                }}
                // if (cell logic here to change background color if not)
                style={cellStyle(grid[rowIdx][colIdx])}           
              />
            ))   
          )}
        </div>


    </>
  )
}

export default App;
/*
[...Array(5).keys()].forEach((i) => { 
  rows.push(Array.from(Array(numCols), () => 0 ))
})
*/