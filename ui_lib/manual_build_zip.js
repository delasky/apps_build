var argv = require('yargs').argv
var zip = require('./buildPublishTestEachEnv/createZip.js')

var updateEnv = require('./buildPublishTestEachEnv/updateEnv.js')
var build = require('./buildPublishTestEachEnv/build.js')
var publish = require('./buildPublishtestEachEnv/publish.js')

const env = 'prd'
const new_version = '0.0.64'
const app_name = 'catalyst-comm'

updateEnv(env)(function(err) {
    if (err) {
        console.log(err)
        process.exit(1)
    } else {
        build(function(err) {
            if (err) {
                console.log(err)
                process.exit(1)
            } else {
                zip('catalyst-comm.zip')(function(err) {
                    if (err) {
                        console.log(err)
                        process.exit(1)
                    } else {
                        publish('prd', 'catalyst-comm.zip')(function(err) {
                            if(err) {
                                console.log(err)
                                process.exit(1)
                            } else {
                                console.log('we done')
                            }
                        })
                    }
                })
            }
        })
    }
})
