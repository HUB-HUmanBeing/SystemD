/********************************
 * Objet permetant de gérer les uploads de fichiers
 * @type {{retrieveNewURL(*, *, *, *=, *=, *): void, blobToFile(*, *=): *, uploadFile(*=, *, *=, *): void, uploadBlob(*=, *=, *=, *=, *=, *=): void, upload(*=, *=, *=, *=, *=, *=): void}}
 */
const uploadFiles = {
    /***************************
     * gere l'upload d'un fichier
     * @param file
     * @param fileName
     * @param entity
     * @param method
     * @param methodParams
     * @param cb
     */
    upload(file, fileName, entity, method, methodParams, cb) {
        // Retrieve a URL from our server.
        this.retrieveNewURL(file, fileName, entity, method, methodParams, url => {
            // Upload the file to the server.
            this.uploadFile(file, fileName, url, cb)
        })
    },
    /****************
     * similaire à upload, mais à partir d'un blob
     * @param blob
     * @param fileName
     * @param entity
     * @param method
     * @param methodParams
     * @param cb
     */
    uploadBlob(blob, fileName, entity, method, methodParams, cb) {

        const file = this.blobToFile(blob, fileName)
        this.upload(file, fileName, entity, method, methodParams, cb)
    },
    /**************************
     * Récupere sur le serveur la requete pré-signée permettant d'uploader un fichier
     * @param file
     * @param fileName
     * @param entity
     * @param method
     * @param methodParams
     * @param cb
     */
    retrieveNewURL(file, fileName, entity, method, methodParams, cb) {
        entity.callMethod(method, ...methodParams, (err, res) => {
            if (err) {
                console.log(err)
            } else {
                cb(res)
            }


        })
    },
    /****************************
     * transforme un blob en un fichier
     * @param blob
     * @param fileName
     * @returns {File}
     */
    blobToFile(blob, fileName) {
        return new File([new Blob([blob], {type: 'image/jpeg'})], fileName, {type: 'image/jpeg'})

    },
    /*************************
     * Gere l'envoi ajax d'un fichier sur le serveur minio avec l'url signée obtenue sur le serveur meteor
     * @param file
     * @param fileName
     * @param url
     * @param cb
     */
    uploadFile(file, fileName, url, cb) {
        let xhr = new XMLHttpRequest()
        xhr.open('PUT', url, true)
        xhr.send(file)
        xhr.onload = () => {
            if (xhr.status == 200) {
                cb()
            } else {
                console.warn("la requete d'upload de fichier sur minio ne passe pas")
            }
        }
    }
}


export default uploadFiles
