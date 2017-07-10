(function() {

    var fs = require('fs')
    var path = require('path')

    module.exports = function readProjects(deps, callback){

        var srcpath = deps.path

        if (!srcpath) {
            callback( new Error('no workspace path set') )        }
        var projects = fs.readdirSync(srcpath)
            .filter(function(file) {
                return fs.lstatSync(path.join(srcpath, file)).isDirectory() && file !== __dirname
        })

        console.log('*** projects>>>>', projects)

        callback(null, projects)

    }



})()
