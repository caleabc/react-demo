import React, { useState } from "react";
import "./app.css"; // Create this file for styling

// let defaultMap = [
//   ["🏪", "🏙️", "🏙️", " ", " ", "🌊", "🌊", " ", " ", " "],
//   [" ", " ", " ", " ", " ", " ", " ", "🌊", " ", " "],
//   [" ", " ", " ", " ", " ", " ", " ", " ", "🌊", " "],
//   ["🛫", " ", " ", "🌳", " ", "🌳", " ", " ", "🚦", " "],
//   [" ", " ", " ", "🌳", " ", "🌳", " ", " ", " ", " "],
//   ["🛫", " ", " ", "🌳", " ", "🌳", " ", " ", "🚦", " "],
//   [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
//   ["🛫", " ", "🏬", "🏬", "🏬", " ", " ", " ", " ", " "],
//   [" ", " ", " ", " ", " ", " ", " ", " ", "🚦", " "],
//   ["🏖️", " ", "🏖️", " ", "🏖️", " ", " ", " ", " "," "],
// ];


const App = () => {
  let [map, setMap] = useState(defaultMap);
  let [start, setStart] = useState(null);
  let [end, setEnd] = useState(null);

  function bfs(myMap, start, end) {
    // 'map' is m x n size

    if (start === null || end === null) {
      return myMap;
    }

    let queue = [start];
    let pathRecord = Array.from({ length: myMap.length }, () =>
      Array(myMap[0].length)
        .fill(null)
        .map(() => [])
    );
    let visited = Array.from({ length: myMap.length }, () =>
      Array(myMap[0].length).fill(false)
    );

    while (queue.length > 0) {
      let node = queue.shift();

      let row = node.row;
      let col = node.col;

      // Mark cell as visited
      // visited[row][col] = true;

      /*
        -----------------------------------------------------
        Base case

        Check if arrive at the destination, if yes, then stop
        -----------------------------------------------------
        */
      if (row === end["row"] && col === end["col"]) {
        break;
      }

      /*
        -------------------------------------------------
        Check neighbour cells if valid then push to queue
        -------------------------------------------------
        */

      // Right direction
      if (
        col + 1 < myMap[0].length &&
        myMap[row][col + 1] === " " &&
        visited[row][col + 1] === false
      ) {
        // Mark cell as visited...
        visited[row][col+1] = true;

        pathRecord[row][col + 1].push({ row, col });

        queue.push({ row: row, col: col + 1 });
      }

      // Down direction
      if (
        row + 1 < myMap.length &&
        myMap[row + 1][col] === " " &&
        visited[row + 1][col] === false
      ) {
        // Mark cell as visited...
        visited[row+1][col] = true;

        pathRecord[row + 1][col].push({ row, col });

        queue.push({ row: row + 1, col: col });
      }

      // Left direction
      if (
        col - 1 >= 0 &&
        myMap[row][col - 1] === " " &&
        visited[row][col - 1] === false
      ) {
        // Mark cell as visited...
        visited[row][col-1] = true;

        pathRecord[row][col - 1].push({ row, col });

        queue.push({ row: row, col: col - 1 });
      }

      // Up direction
      if (
        row - 1 >= 0 &&
        myMap[row - 1][col] === " " &&
        visited[row - 1][col] === false
      ) {
        // Mark cell as visited...
        visited[row-1][col] = true;

        pathRecord[row - 1][col].push({ row, col });

        queue.push({ row: row - 1, col: col });
      }
    }

    /*
    -----------------------------------------
    Get shortest path based on searched nodes
    -----------------------------------------
    */

    let shortestPath = [end];
    while (true) {
      let row = shortestPath[0]["row"];
      let col = shortestPath[0]["col"];

      if (row === start["row"] && col === start["col"]) {
        break;
      }

      let node = pathRecord[row][col][0];

      if (node === undefined){
        // node is equal to undefined means the path is not passable
        console.log('Path is not passable')

        shortestPath = []

        break
      }

      shortestPath.unshift(node);
    }

    /*
    ----------------------------------------------------------------
    Print shortest path on 'map', mutate directly the 'map' variable
    ----------------------------------------------------------------
    */

    for (let i = 0; i < shortestPath.length; i++) {
      let row = shortestPath[i]["row"];
      let col = shortestPath[i]["col"];

      myMap[row][col] = "·";
    }

    return myMap;
  }

  function handleSelectCell(position) {
    let row = position.row;
    let col = position.col;

    if (map[row][col] !== ' ') return

    let mapDeepCopy = JSON.parse(JSON.stringify(map))

    if (start === null) {
      mapDeepCopy[row][col] = "·";
      setStart(position);
    } else if (end === null) {
      mapDeepCopy[row][col] = "·";
      setEnd(position);
    } else {
      
      mapDeepCopy = defaultMap

      setStart(null);
      setEnd(null);
    }

    setMap(mapDeepCopy);
  }

  function handleCellStyle(position) {
    let defaultCellStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      backgroundColor: "#fff",
      border: "3px solid #ccc",
      fontSize: "25px" /* This also affect icon size */,
      height: "50px",
      width: "50px",
    };

    let selectedCellStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      backgroundColor: "gray",
      border: "3px solid #ccc",
      fontSize: "25px" /* This also affect icon size */,
      height: "50px",
      width: "50px",
    };

    if (start === null && end === null) {
      return defaultCellStyle;
    }

    let row = position.row;
    let col = position.col;

    if (start !== null && row === start.row && col === start.col) {
      return selectedCellStyle;
    }

    if (end !== null && row === end.row && col === end.col) {
      return selectedCellStyle;
    }
  }

  function calculateShortestPath(){
    let mapDeepCopy = []
    for (let i = 0; i < map.length; i++){
      let row = []
      for (let j = 0; j < map[i].length; j++){
        let c = map[i][j]

        if (c !== '·'){
          row.push(c)
        } else {
          row.push(' ')
        }
      }
      mapDeepCopy.push(row)
    }

    let mapWithShortestPath = bfs(mapDeepCopy, start, end)
    setMap(mapWithShortestPath)
  }

  function handleDefaultCellStyle(){
    return {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    
      backgroundImage: `url(${imgUrls[7]})`,
      border: "3px solid #ccc",
      fontSize: "25px" /* This also affect icon size */,
      height: "50px",
      width: "50px",
    };
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {/* This is the div for the grid */}
        <div className="map-grid">
          {map.map((row, rowIndex) => (
            // This is the div for every row
            <div key={rowIndex} className="map-row">
              {row.map((cell, colIndex) => (
                // This is the div for every column
                <div
                  key={colIndex}
                  className={map[rowIndex][colIndex] === '·' ? 'selected-cell' : 'default-cell'}
                  onClick={function () {
                    handleSelectCell({ row: rowIndex, col: colIndex });
                  }}
                >
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <button onClick={calculateShortestPath}>Calculate shortest path</button>
    </div>
  );
};

export default App;
