import React, { useState, useCallback, useRef, useEffect } from "react";
import IconButton from '@material-ui/core/IconButton';
import green from '@material-ui/core/colors/green'
import { createMuiTheme, ThemeProvider, } from '@material-ui/core/styles';
import {Pause, PlayArrow } from '@material-ui/icons/';
import produce from 'immer';
import { Container } from "@material-ui/core";
import { 
  flip,     
  presetOne,
  presetSwirl,
  presetSmile,
  presetPulsar,
  presetRorshak,
  presetSgc 
} from '../utils/Data'

import MyMenu from './MyMenu'


//init vars
const colNum = 21
const rowNum = 21
const cellSize = 28.35
const fastUpdate = 25
const slowUpdate = 300
const ops = [[0,1],[0,-1],[1,-1],[-1,1],[1,1],[-1,-1],[1,0],[-1,0]]
let genRef;

const gridStyle = () => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${rowNum}, ${cellSize}px)`,
  border: '1px solid #4caf50',
})
const cellStyle = (bool) => ({
  width: cellSize,
  height: cellSize,
  backgroundColor: bool ? "#4caf50" : "#24fb00",
  opacity: bool ? '1' : '0',
  boxShadow: bool ? "0px 0px 0px rgba(163, 255, 65, 0.32)" : "0px 0px 155px rgba(163, 255, 65, 0.32)",
  transition: "all 500ms cubic-bezier(0.000, 1.195, 0.000, 0.945)", 
  transitionTimingFunction: "cubic-bezier(0.000, 1.195, 0.000, 0.945)",
  transform: bool ? "scale(.98,.98) rotate(0deg)" : flip() ? "scale(1.1,1.1) rotate(45deg)" : "scale(1.1,1.1) rotate(45deg)", 
})


const theme = createMuiTheme({
  palette: {
    primary: green
  },
});

// Grid
const Grid = () => {

  // create state for grid. (colNum x rowNum)
  const [grid, setGrid] = useState(Array.from({length: colNum}).map(() => Array.from({length: rowNum}).fill(0)))
  // create state for start/stop button 
  const [isActive, setIsActive] = useState(false)
  // create state for state for speedToggle
  const [isFast, setIsFast] = useState(true)

  // really ugly statemanagement to avoid loop during simulate()
  const activeRef = useRef(isActive)
  const fastRef = useRef(isFast)
  activeRef.current = isActive
  fastRef.current = isFast

 
  const clearOrRandomize = (bool) => {
      if (isActive) {return}
      if(bool){
        const rows = [];
        for (let i = 0; i < rowNum; i++) {
            rows.push(Array.from(Array(colNum), () => Math.random() > .9 ? 1 : 0))
        }
        console.log('random seed generated')
        setGrid(rows)
      }
      else setGrid(Array.from({length: colNum}).map(() => Array.from({length: rowNum}).fill(0)))
  }

  const loadGrid=(input)=>{
    setGrid(produce(grid, gridClone => {
      for (let xy of input){ gridClone[xy[1]][xy[0]] = 1 }}))
        // {gridClone[xy[1]+2][xy[0]+1] = 1 }}}))
  }

  const clickHandleUpload = () => {
    var userInput = prompt("Please enter your JSON", "[[0,0],[0,1][0,2][0,3]]");
    if (userInput != null){ loadGrid(JSON.parse(userInput)) }
    else alert('Your submission was empty :(')
  }

  function clickHandleCopy() {
    let arr = [];
    grid.map((el, ind) => 
      el.map((ell, indX) => 
        ell > 0 
          ? arr.push([indX,ind])
            : console.log('scanning')))
    alert(JSON.stringify(arr))
  }
  
  function clickHandleSpeed(){
    //ugly start/stop logic on click
    setIsFast(!isFast)
    if (!isFast){
      activeRef.current = true
      simulate()
    }
  }

  let menuProps = { clickHandleSpeed, clickHandleCopy, clickHandleUpload, clearOrRandomize }

  // game logic loop
  const simulate = useCallback(() => {
    if (!activeRef.current) {
      if(genRef){
        genRef.innerHTML = 0
        genRef.style.display = "none"
      }
      return;}

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


      console.log('frame')
      if(!genRef){ 
        genRef = document.getElementById('test')
        genRef.style.opacity = "1";
        genRef.style.display = "inline";
      }
      genRef.innerHTML = (`Gen:` + `${parseInt(genRef.innerHTML.replace(/\D/g,''))+ 1}`)
      //delay before updating
      setTimeout(simulate, fastRef.current ? fastUpdate : slowUpdate); 
  },[]);

  
  useEffect(()=>{

  },[])


  
  
  return (
    <Container 
      maxWidth="sm" 
      disableGutters={true}>
      <MyMenu props={menuProps} style={{display: 'inline', position: 'fixed'}}></MyMenu>

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
    
      <ThemeProvider theme={theme}>
        <IconButton  //start button
          color="primary" 
          aria-label="play animation"
          onClick={()=> {
            //ugly start/stop logic on click
            setIsActive(!isActive)
            if (!isActive){
              activeRef.current = true
              simulate()
            }}}>
          {!isActive ? <PlayArrow /> : <Pause/>}
        </IconButton>

      </ThemeProvider>

      <p style={{
          display: 'none',
          opacity: "0",
          width: 0,
          height: 0,
          position: 'relative',
          pointerEvents: "none",}}
          id={'test'}>
          {0}
        </p>
      
    </Container>
  )
}
export default Grid;


/* 
  setGrid(produce(grid, gridClone => {
    gridClone[1][3] ^= 1}
  ))
*/