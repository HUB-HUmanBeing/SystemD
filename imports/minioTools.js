import Minio from 'minio'

const minioTools= {
    client : new Minio.Client({
        endPoint: Meteor.settings.minio.endPoint,
        port: Meteor.settings.minio.port,
        useSSL: false,
        accessKey: Meteor.settings.minio.MINIO_ACCESS_KEY,
        secretKey: Meteor.settings.minio.MINIO_SECRET_KEY
    }),
    buckets : [{
        name: 'user-avatars',
        policy:{
            Version:"2012-10-17",
            Statement:[
                {
                    Sid:"AddPerm",
                    Effect:"Allow",
                    Principal: "*",
                    Action:["s3:GetObject"],
                    Resource:["arn:aws:s3:::user-avatars/*"]
                }
            ]
        }
    }],
    initialize(){
        this.buckets.forEach((bucket)=>{
            this.client.bucketExists(bucket.name, (err, exists)=>{
                if(!err && !exists){
                    this.client.makeBucket(bucket.name,()=>{
                        this.client.setBucketPolicy(bucket.name, JSON.stringify(bucket.policy), function(err) {
                            if (err) throw err

                            console.log('Bucket policy set')
                        })
                    })
                }
            })
        })
    }
}
export default minioTools
