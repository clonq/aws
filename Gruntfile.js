module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        exec: {
            'create-main-stack': {
                cmd: 'aws cloudformation create-stack --stack-name datasmart --template-body file://datasmart.json'
            },
            'delete-s3': {
                cmd: 'aws s3 rb s3://datasmartio --force'
            },
            'update-s3-web': {
                cmd: 'aws s3 cp s3/web s3://datasmartio --recursive --exclude ".*"'
            },
            'update-s3-raw': {
                cmd: 'aws s3 cp s3/raw s3://datasmartio/raw --recursive --exclude ".*"'
            },
            'delete-main-stack': {
                cmd: 'aws cloudformation delete-stack --stack-name datasmart'
            },
            'package-lambda': {
                cmd: 'cd s3/code && npm install && zip -r lambdas.zip . && cd ../..'
            },
            'upload-lambdas': {
                cmd: 'aws s3 cp s3/code/lambdas.zip s3://datasmartio/code/ && rm s3/code/lambdas.zip'
            },
            'create-lambda-stack': {
                cmd: 'aws cloudformation create-stack --stack-name datasmart-lambdas --template-body file://lambdas.json'
            },
            'update-lambda-stack': {
                cmd: "aws cloudformation update-stack --stack-name datasmart-lambdas --template-body file://lambdas.json", 
            },
            'delete-lambda-stack': {
                cmd: "aws cloudformation delete-stack --stack-name datasmart-lambdas", 
            }
        }
    });

    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('create-stack', ['exec:create-main-stack']);
    grunt.registerTask('delete-stack', ['exec:delete-s3', 'exec:delete-main-stack']);

    grunt.registerTask('update-s3', ['exec:update-s3-web', 'exec:update-s3-raw']);

    grunt.registerTask('package-lambda', ['exec:package-lambda']);
    grunt.registerTask('create-lambdas', ['exec:package-lambda', 'exec:upload-lambdas', 'exec:create-lambda-stack']);
    grunt.registerTask('delete-lambdas', ['exec:delete-lambda-stack']);
    grunt.registerTask('update-lambdas', ['exec:update-s3-raw', 'exec:package-lambda', 'exec:upload-lambdas', 'exec:update-lambda-stack']);
};
