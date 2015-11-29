var aws = require('aws-sdk');
var s3 = new aws.S3({ apiVersion: '2006-03-01' });
var _ = require('underscore');
var uuid = require('uuid');

aws.config.update({
    region: "us-east-1"
});

var lineCounter = 0;
var keys = [];

exports.test = function(event, context) {
    // var bucket = event.Records[0].s3.bucket.name;
    // var key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    var bucket = 'datasmartio';
    var key = 'raw/3liner.csv';
    var params = {Bucket: bucket, Key: key};
    var s3rs = s3.getObject(params).createReadStream();
    var rl = require('readline').createInterface({
        terminal: false,
        input: s3rs
    });
    rl.on('line', function (line) {
        if(lineCounter++ === 0) {
            keys = extractKeys(line);
        } else {
            var data = parseLine(line);
            insert('userdata', data, 'Id', genericCallback);
        }
    })
    .on('close', function () {
        context.succeed('done');
    });
};

function extractKeys(line) {
    return line.split(',');
}

function parseLine(line) {
    return _.compactObject(_.object(keys, line.split(',')));
}

function insert(table, data, pk, cb) {
    var params = {
        TableName: table,
        Item: _.defaults(data, _.object([pk||'Id'], [uuid.v1()]))
    }
    var dynamodbDoc = new aws.DynamoDB.DocumentClient();
    dynamodbDoc.put(params, cb);
}

function genericCallback(err, res) {
    if (err) {
        console.error('Error:', JSON.stringify(err, null, 4));
    } else {
        console.log(JSON.stringify(res, null, 4));
    }
}

_.mixin({
    compactObject : function(o) {
        var clone = _.clone(o);
        _.each(clone, function(v, k) {
            if(!v) {
                delete clone[k];
            }
        });
        return clone;
    }
});
