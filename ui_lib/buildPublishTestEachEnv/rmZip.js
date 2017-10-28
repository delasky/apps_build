const fs = require('fs')
module.exports = function(zipFileName) {

    return function(callback) {
        console.log('cleaning up the zip ')
        fs.unlink(zipFileName, (err) => {
            if (err) {
                console.log('un able to remove zip')
                callback(err)
            } else {
                callback()
            }
        })
    }
}
