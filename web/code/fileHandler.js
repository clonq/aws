// var s3 = new aws.S3({apiVersion: '2006-03-01'});
var aws = require('aws-sdk');
var s3 = new aws.S3();
module.exports = {
    test: function(event, context){
        var bucket = event.Records[0].s3.bucket.name;
        var key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
        s3.getObject({Bucket: bucket, Key: key}, function(err, data) {
            if (err) {
                console.log("Error getting object " + key + " from bucket " + bucket);
                context.fail ("Error getting file: " + err)      
            } else {
                console.log('CONTENT TYPE:', data.ContentType);
                context.succeed();
            }
        });        
    }
}