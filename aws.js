require('dotenv').config();
const Amazon = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const ID = process.env.AWS_ID;
const SECRET = process.env.AWS_KEY;

const s3 = new Amazon.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

class Amazon {
    async createBucket(name, region = "ap-southeast-2") {
        return Promise((resolve, reject) => {
            s3.createBucket({
                Bucket: name,
                CreateBucketConfiguration: {
                    LocationConstraint: region
                }
            }, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    async uploadFile(bucketName, fileName) {
        const ext = path.extname(fileName);
        const key = uuidv4() + ext;
        return Promise((resolve, reject) => {
            const fileContent = fs.readFileSync(fileName);
            const params = {
                Bucket: bucketName,
                Key: key,
                Body: fileContent
            };
            s3.upload(params, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        })
    }
}

module.exports = Amazon;