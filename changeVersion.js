/**
 * 更新package.json的服务
 */
var fs = require('fs'),
  path = require('path');

const packageFile = __dirname + '/package.json';
const bl = fs.existsSync(packageFile);
if (!bl) return;
let config = fs.readFileSync(packageFile, {
  encoding: 'utf-8'
})
let list = config.match(/"version": ?"([0-9\.]+)"/);

if (!list || list.length < 1) return;
let v_list = list[1].split('.');
try {
  v_list[v_list.length - 1]++;
} catch (e) {
  return;
}
config = config.replace(list[0], '"version": "' + v_list.join('.') + '"')
try {
  fs.writeFileSync(packageFile, config)
} catch (e) { }