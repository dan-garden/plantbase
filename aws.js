if(process.env.ENV !== "production") {
    require('dotenv').config();
}

const Amazon = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const {
    v4: uuidv4
} = require('uuid');

const ID = process.env.AWS_ID;
const SECRET = process.env.AWS_KEY;

const s3 = new Amazon.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const FileType = require('file-type');

class aws {
    static async createBucket(name, region = "ap-southeast-2") {
        return new Promise((resolve, reject) => {
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

    static async uploadFile(bucketName, path) {
        return new Promise((resolve, reject) => {
            FileType.fromFile(path).then(file => {
                const fileContent = fs.readFileSync(path);

                const params = {
                    Bucket: bucketName,
                    Key: uuidv4(),
                    Body: fileContent,
                    ContentDisposition: 'inline',
                    ContentType: file.mime
                };

                s3.upload(params, function (err, data) {
                    fs.unlinkSync(path);
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });

        })
    }

    static async deleteFile(bucketName, key) {
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: bucketName,
                Key: key
            };

            s3.deleteObject(params, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}


module.exports = aws;