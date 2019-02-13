import axios from 'axios'

const uploadFiles = {

    upload(file,fileName, bucketName, cb) {
        // Retrieve a URL from our server.
        this.retrieveNewURL(file,fileName, bucketName, url => {
            // Upload the file to the server.
            this.uploadFile(file,fileName, url, cb)
        })
    },

//`retrieveNewURL` accepts the name of the current file and invokes the `/presignedUrl` endpoint to
// generate a pre-signed URL for use in uploading that file:
    retrieveNewURL(file,fileName, bucketName, cb) {
        Meteor.call('getMinioUploadUrl', fileName, bucketName, (err, res) => {
            if (err) {
                console.log(err)
            } else {
                cb(res)
            }


        })
    },

    blobToFile(blob, fileName) {
        return new File([new Blob([blob], {type: 'image/jpeg'})], fileName, {type: 'image/jpeg'})

    },
    uploadBlob(blob, fileName, bucketName, cb) {

        const file = this.blobToFile(blob, fileName)
        this.upload(file,fileName, bucketName, cb)
    },
// ``uploadFile` accepts the current filename and the pre-signed URL. It then invokes `XMLHttpRequest()`
// to upload this file to S3 at `play.minio.io:9000` using the URL:
    uploadFile(file, fileName, url, cb) {
        var xhr = new XMLHttpRequest ()
        xhr.open('PUT', url, true)
        xhr.send(file)
        xhr.onload = () => {
            if (xhr.status == 200) {
                cb()
            }else{
                console.warn("la requete d'upload de fichier sur minio ne passe pas")
            }
        }
    }
}


export default uploadFiles
