const DATA = require('./data.js')
const { convertArrayToCSV } = require('convert-array-to-csv');
const fs = require('fs');


let CSV = [];

let test = () => {

  let maxCount = 400
  let count = 0
  let xCount = 0
  let yCount = 0;
  

  for (var x = 0, i = 0; i <= 20;i++, xCount++) {
    for (var y = 0, j=0; j <= 20;j++, yCount++, count++) {  

      let current = {
          x: x,
          y: y,
          z: DATA[count].NUMBER * 10,
          attri: 0
        }
      y += 30  
      CSV.push(current)  
    }
    x += 30
  }
  console.log(CSV);
}

function convert() {
  const file = convertArrayToCSV(CSV);
  fs.writeFileSync('DATA_COORDS_BOOST_Z.CSV', file)
}

test()
convert()
