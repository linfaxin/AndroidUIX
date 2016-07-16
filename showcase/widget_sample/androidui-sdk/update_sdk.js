/**
 * Created by linfaxin on 16/5/14.
 */

var fs = require('fs');
var child_process = require('child_process');
var path = require("path");

function rmdir(dir) {
    var list = fs.readdirSync(dir);
    for(var i = 0; i < list.length; i++) {
        var filename = path.join(dir, list[i]);
        var stat = fs.statSync(filename);

        if(filename == "." || filename == "..") {
            // pass these files
        } else if(stat.isDirectory()) {
            // rmdir recursively
            rmdir(filename);
        } else {
            // rm fiilename
            fs.unlinkSync(filename);
        }
    }
    fs.rmdirSync(dir);
}

rmdir('../node_modules/androiduix');
child_process.exec('npm install androiduix --save-dev', function(err,stdout,stderr){
    if (err) {
        console.error(`exec error: ${err}`);
        console.log('stderr:\n' + stderr);
        console.log('stdout:\n' + stdout);
        return;
    }

    var path = "../node_modules/androiduix/dist/";
    var files = fs.readdirSync(path);
    files.forEach(function(fileName){
        fs.writeFileSync('./'+fileName, fs.readFileSync(path + '/' + fileName));
    });
});