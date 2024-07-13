const {xefparseall} = require('./index'); //https://jestjs.io
const {logmsg} = require ('../loglib/');
const fs = require ("fs");
let msgar = [];
/*logmsg ("месага 1", msgar, {toconsole : 1, topic : 'topic1', category : 'msg' });
logmsg ("месага 2", msgar, {toconsole : 1, topic : 'topic2', category : 'warn' });
logmsg ("месага 3", msgar, {toconsole : 1, topic : 'topic3', category : 'error' });
*/

test( 'testexample', () => {
  //let xefsourcefilename =  "./xefdescription/example.xef";
  let xefsourcefilename =  "./xefdescription/pacfremwork.xef";
  //let xefsourcefilename =  "./xefdescription/2.xef";
  const csvfilename =  "./1.csv";
  const jsonfilename =  "./1.json";
  let xmlcontent = fs.readFileSync(xefsourcefilename, 'utf8');
  let result = xefparseall(xmlcontent);
  //console.log (result.DDTSource.csv);
  fs.writeFileSync (csvfilename, result.vars.csv, 'utf8');
  fs.writeFileSync (jsonfilename, JSON.stringify(result.vars), 'utf8');
  //expect(xefparseall(1, 2)).toBe(3);
});
