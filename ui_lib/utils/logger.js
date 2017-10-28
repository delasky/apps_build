module.exports = function logger(){
    let inspect = require('util').inspect

    for (var i=0; i<arguments.length; i++) {
        console.log(inspect(arguments[i], {depth: null, colors: true}))
    }

}
