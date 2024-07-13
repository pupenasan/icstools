const path = require('path');
const fs = require('fs');
const xmlparser = require('xml-js'); // https://www.npmjs.com/package/xml-js
const {logmsg} = require ('../loglib/');

/*let xefsourcefilename =  "/xefdescription/example.xef";
xmlcontent = fs.readFileSync(xefsourcefilename, 'utf8');
xefparseall();
*/
function xefparseall(xmlcontent) {
  const allcontent = xmlparser.xml2js(xmlcontent, { compact: true, spaces: 4 });
  const obresult = {
    DDTSource: {
      ob: [], 
      csv: "typename\tfieldname\tfieldtype\tcomment\tattributes\r\n" 
    },
    vars: {
      ob: [],
      csv: "varname\ttypename\tcomment\taddress\tinitval\tattributes\tinstattributes\r\n",
    },
    msgar: []  
  };
  //console.log (allcontent.FEFExchangeFile);
  let exporttype =  allcontent.FEFExchangeFile ? "xef" : allcontent.ZEFExchangeFile ? "zef" : "";
  if  (exporttype == "") {
    obresult.msgar = logmsg ("Не визначений формат файлу", {toconsole : 1, topic : 'seunparse', category : 'error'});
    return obresult
  }
    
  let root = (exporttype == "xef") ? allcontent.FEFExchangeFile : (exporttype == "zef") ? allcontent.ZEFExchangeFile : "";

  for (let propname in root) {
    let prop = root[propname];
    let props = [];
    if (!Array.isArray(prop)) {
      props = [prop];
    } else {
      props = prop;
    }
    let variables
    for (let item of props){
      switch (propname) {
        case "DDTSource":
          //console.log (item);
          const ddtsource = {
            name: item._attributes.DDTName,
            comment: item.comment ? item.comment._text.replace(/\t/g," ") : "",
            version: item._attributes.version,
            dateTime: item._attributes.dateTime,
            //checksum: item.attribute._attributes.value,
            fields: []          
          }
          obresult.DDTSource.csv += ddtsource.name + "\t" + "\t" + "\t" + ddtsource.comment + "\t" + `ver:${ddtsource.version}|dt:${ddtsource.dateTime}\r\n`;

          variables = Array.isArray (item.structure.variables) ? item.structure.variables : [item.structure.variables];
          for (let rawfield of variables) {
            let field = {
              name:rawfield._attributes.name,
              typename: rawfield._attributes.typeName,
              comment: rawfield.comment ? rawfield.comment._text.replace(/\t/g," ") : ""
            }
            ddtsource.fields.push (field);
            obresult.DDTSource.csv += "\t" + field.name + "\t" + field.typename + "\t" + field.comment + "\t" + "\r\n" ;
          }
          obresult.DDTSource.ob.push (ddtsource)
        break
        case "dataBlock":
          variables = Array.isArray(item.variables) ? item.variables : [item.variables]; 
          for (let rawvar of variables){
            let variable = {
              name: rawvar._attributes.name,
              typename: rawvar._attributes.typeName,
              comment: rawvar.comment ? rawvar.comment._text.replace(/\t/g," ") : "",
              address: rawvar._attributes ? rawvar._attributes.topologicalAddress || "" : "",
              initval: rawvar.variableInit && rawvar.variableInit._attributes ? rawvar.variableInit._attributes.value || "" : "",
              attributes: {},
              instattributes: {}
            }; 
            if (rawvar.attribute) {
              let ownatributes = Array.isArray(rawvar.attribute) ? rawvar.attribute: [rawvar.attribute];
              for (let ownatribut of ownatributes) {
                variable.attributes [ownatribut._attributes.name] = ownatribut._attributes.value;
              }
            }
            if (rawvar.instanceElementDesc) {
              let instanceElementDesc = Array.isArray(rawvar.instanceElementDesc) ? rawvar.instanceElementDesc : [rawvar.instanceElementDesc];
              for (let ielem of instanceElementDesc) {
                let instattributes = {};  
                parseinstanceElementDescs (ielem, instattributes)
                variable.instattributes[instattributes.name] = instattributes;
                delete instattributes.name;
              }
            }
            obresult.vars.ob.push (variable);
            //csv: "varname\dtypename\tcomment\taddress\tinitval\tattributes\tinstattributes\r\n",
            satrs = JSON.stringify (variable.attributes);
            sinstatrs = JSON.stringify (variable.instattributes);
            satrs = satrs.length > 2 ? satrs : "";
            sinstatrs = sinstatrs.length > 2 ? sinstatrs : "";
            obresult.vars.csv += variable.name + "\t" + variable.typename + "\t" + variable.comment.replace (/\t/g," ") + "\t" + variable.address + "\t" + variable.initval + "\t";
            obresult.vars.csv += satrs + "\t" +  sinstatrs + "\r\n" ;
          }
                 
        default : 
      }
    }
  } 

  return obresult
}
//рекурсивне наповнення властивостей елементів змінних 
function parseinstanceElementDescs (item, ob){
  ob.name = item._attributes.name;
  if (item.instanceElementDesc) {
    ob.value = {};
    let instanceElementDesc = Array.isArray(item.instanceElementDesc) ? item.instanceElementDesc : [item.instanceElementDesc];
    for (let ielem of instanceElementDesc) {
      let attributes = {};  
      parseinstanceElementDescs (ielem, attributes);
      ob.value[attributes.name] = attributes;
      delete attributes.name;
    }
  } else {
    //console.log (item);
    if (item.value) ob.value = item.value._text
  } 
  if (item.comment) {
    ob.comment = item.comment._text;
  }
  return ob
}
module.exports = {xefparseall};