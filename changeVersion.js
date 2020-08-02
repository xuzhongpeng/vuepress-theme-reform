/**
 * 更新package.json的服务
 */
var fs = require('fs'),
  path = require('path'),
  child = require('child_process');
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
for (let i = 1; i < v_list.length; i++) {
  if (v_list[i] < 10) {
    a = i
  } else {
    v_list[i] = 0
    break
  }
}
try {
  v_list[a]++;
} catch (e) {
  return;
}
let lastVersions = v_list.join('.');
child.exec('git tag '+lastVersions, function (err, sto) {
  console.log(sto);
})
config = config.replace(list[0], '"version": "' + lastVersions + '"')
try {
  fs.writeFileSync(packageFile, config)
} catch (e) { }