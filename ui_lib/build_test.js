// this is to test the build script, not to build the test script or test and build
// or anything else
(function() {
    let buildFunctionIAmTesting = require('./buildPublishTestEachEnv/build.js')
    let zipFunctionIAmAlsoTesting = require('./buildPublishTestEachEnv/createZip.js')('test_zip.zip')

    buildFunctionIAmTesting(function(err) {
        if (err) {
            console.log('test error')
        } else {
            console.log('no test error i reckon')
            zipFunctionIAmAlsoTesting(function(new_err) {
                if (new_err) {
                    console.log('zip_error')
                } else {
                    console.log('no zip error')
                }
            })

        }
    })



})()
