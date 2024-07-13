const xlsx = require ("xlsx");

function getfromxlsx (xlsfile) {
  let ob = {
    sheets : {},
    msgar : []
  }
  let workbook = xlsx.read(xlsfile);
  ob.props = workbook.Props;
  for (let sheetname in workbook.Sheets){
    ob.sheets[sheetname] = xlsx.utils.sheet_to_json (workbook.Sheets[sheetname]) 
  }
  //console.log (workbook.Props); 
  return ob
}

module.exports = {getfromxlsx};