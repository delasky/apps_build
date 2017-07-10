module.exports = {
    options: {
         files: ['package.json'],
         updateConfigs: [],
         commit: true,
         commitMessage: '<%= commit_message %>',
         commitFiles: ['package.json'],
         createTag: false,
         push: true,
         pushTo: 'origin',
         gitDescribeOptions: '--always --abbrev=1 --dirty=-d'
     }
}
