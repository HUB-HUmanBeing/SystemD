import Minio from 'minio'

/***********************
 * Objet permettant de gérer la création de l'instance minio et de gérer l'initialisation du serveur d'assets si besoin
 * @type {{buckets: {name: string, policy: {Version: string, Statement: {Action: string[], Resource: string[], Effect: string, Principal: string, Sid: string}[]}}[], client: Client, initialize(): void}}
 */
const minioTools = {
    /**********************
     * genere l'instance minio
     */
    client: new Minio.Client({
        endPoint: Meteor.settings.minio.endPoint,
        port: Meteor.settings.minio.port,
        useSSL: Meteor.settings.minio.useSsl,
        accessKey: Meteor.settings.minio.MINIO_ACCESS_KEY,
        secretKey: Meteor.settings.minio.MINIO_SECRET_KEY
    }),
    /**************
     * tableau des buckets a créer accompagné de leurs droits
     */
    buckets: [{
        name: 'user-avatars',
        policy: {
            Version: "2012-10-17",
            Statement: [
                {
                    Sid: "AddPerm",
                    Effect: "Allow",
                    Principal: "*",
                    Action: ["s3:GetObject"],
                    Resource: ["arn:aws:s3:::user-avatars/*"]
                }
            ]
        }
    },
        {
            name: 'project-avatars',
            policy: {
                Version: "2012-10-17",
                Statement: [
                    {
                        Sid: "AddPerm",
                        Effect: "Allow",
                        Principal: "*",
                        Action: ["s3:GetObject"],
                        Resource: ["arn:aws:s3:::project-avatars/*"]
                    }
                ]
            }
        },
        {
            name: 'project-files',
            policy: {
                Version: "2012-10-17",
                Statement: [
                    {
                        Sid: "AddPerm",
                        Effect: "Allow",
                        Principal: "*",
                        Action: ["s3:GetObject"],
                        Resource: ["arn:aws:s3:::project-avatars/*"]
                    }
                ]
            }
        }],
    /**************************
     * crée les buckets si ils n'existent pas encore et pose leurs droits
     */
    initialize() {
        this.buckets.forEach((bucket) => {
            this.client.bucketExists(bucket.name, (err, exists) => {
                if (!err && !exists) {
                    this.client.makeBucket(bucket.name, () => {
                        this.client.setBucketPolicy(bucket.name, JSON.stringify(bucket.policy), function (err) {
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
