const {getfromxlsx} = require ("./index.js");
const fs = require ("fs");
const testfile = "./testdata/masterdata.xlsx";

let testadata = fs.readFileSync (testfile);
let {sheets}  = getfromxlsx (testadata);
//console.log (sheets); 
