var aws = require('aws-sdk');
var s3 = new aws.S3();
module.exports = {
    test: function(event, context){
        var bucket = event.Records[0].s3.bucket.name;
        var key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
        var params = {Bucket: bucket, Key: key};
        var rl = require('readline').createInterface({
            input: s3.getObject(params).createReadStream()
        });
        rl.on('line', function (line) {
            console.log('>:', line);
        });
    }
}