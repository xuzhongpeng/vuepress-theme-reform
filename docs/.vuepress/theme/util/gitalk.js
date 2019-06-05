var http = require('http');

var qs = require('querystring');

var post_data = {
    "labels": ["Gitalk","test1"],
    "title": "test1"
};//这是需要提交的数据  

console.log('gogo')
var content = qs.stringify(post_data);
console.log('gogo1')
var options = {
    hostname: 'https://api.github.com',
    path: '/repos/xuzhongpeng/xuzhongpeng.github.io/issues',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'token 6e09d795efcc9912dc2e7376e1c80d66e4e3d695'
    }
};
var options1 = {
    hostname: '127.0.0.1',
    port: 8080,
    path: '/blog/frontend/%E4%B8%BB%E9%A2%98%E7%9A%84%E6%94%B9%E9%80%A0.html',
    method: 'GET',
    // headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'token 6e09d795efcc9912dc2e7376e1c80d66e4e3d695'
    // }
};
var req = http.request(options, function (res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + res);
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
    });
    res.on('end',(e)=>{
        console.log('err '+e)
    })
});

req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
});

// write data to request body  
req.write(content);
console.log('end')
req.end();
