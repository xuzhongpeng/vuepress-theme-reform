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
var a = 0
for (let i = 0; i < v_list.length; i++) {
  if (v_list[i] < 10) {
    a = i
  }
}
try {
  v_list[a]++;
} catch (e) {
  return;
}
config = config.replace(list[0], '"version": "' + v_list.join('.') + '"')
try {
  fs.writeFileSync(packageFile, config)
} catch (e) { }