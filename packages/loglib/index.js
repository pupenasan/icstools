function logmsg(msg, msgar = [], opts = {
  toconsole : 1, //чи виводити на консоль
  topic : 'default', //тема, відопвідно до модулю
  category : 'msg' //категорія msg, error, warn, info
}) {
  const now = new Date();
  let txtmsg = `${now.toLocaleTimeString()}.${now.getMilliseconds()} ${msg}`;
  if (opts.toconsole === 1) {
    switch (opts.category) {
      case 'warn':
        console.warn (txtmsg)
      break
      case 'error':
        console.error (txtmsg)
      break
      case 'msg':
      case 'info':
      default:
        console.log(txtmsg);   
    }
  }
  msgar.push({
  DT: now, msg, topic : opts.topic, category : opts.category,
  });
  return msgar;
}
module.exports = {logmsg};
