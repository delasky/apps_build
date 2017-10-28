(function() {
    "use strict";

    var zipFolder   = require('zip-folder')
        , _         = require('lodash')
        , path      = require('path')
        , paths     = require('../paths.js')
        , fs        = require('fs')

    module.exports = function createZipFn(zip_file_name) {

        return function createZip(callback) {

            if (!zip_file_name) {
                callback('No zip file name!');

            } else {

                var folder_to_zip = path.resolve(__dirname, '..', '..', paths.BUILD_DIR);
                fs.readdir(folder_to_zip, function(err, files) {
                    if (err) {
                        console.log('err')
                    }
                    else {
                        console.log('contents of dist')
                        files.forEach(function(file){
                            console.log(file)
                        })
                    }
                })

                zipFolder(folder_to_zip, zip_file_name, callback);

            }
        }

    };

})();
