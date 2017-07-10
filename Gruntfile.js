module.exports = function (grunt) {

    var config = {
        pkg             : grunt.file.readJSON('package.json'),
        new_version     : grunt.option('new_version'),
        commit_message  : grunt.option('commit_message')
    };

    //load grunt modules
    require('load-grunt-tasks')(grunt);

    // Build config object and init
    grunt.util._.extend(config, loadConfig('./grunt/options/'));
    grunt.initConfig(config);




    // =========== END ===========

    // Helper Functions
    // Load task options from tasks/options/
    function loadConfig(path) {
        var glob = require('glob');
        var key;
        var obj = {};

        glob.sync('*', { cwd: path }).forEach(function(option) {
            var key = option.replace(/\.js$/, '');
            obj[key] = require(path + option);
        });

        return obj;
    }

}
