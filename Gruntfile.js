module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        exec: {
            'create-main-stack': {
                cmd: 'aws cloudformation create-stack --stack-name datasmart --template-body file://datasmart.json'
            },
            'delete-main-stack': {
                cmd: 'aws s3 rb s3://datasmartio --force && aws cloudformation delete-stack --stack-name datasmart'
            },
            'zip-lambda-code': {
                cmd: 'npm install && tar -cz -f web/code/lambdas.zip node_modules/u* -C web/code/ fileHandler.js'
            },
            'upload-lambdas': {
                cmd: 'aws s3 cp web/code/lambdas.zip s3://datasmartio/code/'
            },
            'create-lambda-stack': {
                cmd: 'aws cloudformation create-stack --stack-name datasmart-lambdas --template-body file://lambdas.json'
            },
            'update-lambda-stack': {
                cmd: "aws cloudformation update-stack --stack-name datasmart --template-body file://lambdas.json", 
            },
            'delete-lambda-stack': {
                cmd: "aws cloudformation delete-stack --stack-name datasmart-lambdas", 
            }
        }
    });

    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('create-stack', ['exec:create-main-stack']);

    grunt.registerTask('create-lambdas', ['exec:zip-lambda-code', 'exec:upload-lambdas', 'exec:create-lambda-stack']);
    grunt.registerTask('delete-lambdas', ['exec:delete-lambda-stack']);
    grunt.registerTask('update-lambdas', ['exec:zip-lambda-code', 'exec:upload-lambdas', 'exec:update-lambda-stack']);
};
