import cryptoTools from "./cryptoTools";
import ProjectFile from "../../imports/classes/ProjectFile";
import projectController from "./controllers/projectController";
import Axios from "axios";

const projectFilesController = {

    encryptAndUploadFiles(files, projectId, instance) {
        let filesArray = instance.files.get()
        for (let i = 0; i < files.length; i++) {
            let tempId = cryptoTools.generateId()
            filesArray.push({
                tempId: tempId,
                name: files[i].name,
                status: "loading",
                type: files[i].type
            })
            if (["image/jpeg", "image/gif", "image/png", "image/svg+xml", "image/jpg"].indexOf(files[i].type) > -1) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    Meteor.setTimeout(() => {
                        $('#filePreviewItem-' + tempId + ' img').attr('src', e.target.result);
                    }, 200)

                }
                reader.readAsDataURL(files[i]);
            }
            this.getUploadLink(files[i], projectId, (uploadLink, fileId) => {
                this.encryptFile(files[i], fileId, (encryptedFile, boundary) => {
                    this.uploadFile(encryptedFile, uploadLink, boundary, projectId, () => {
                        console.log("done")
                        Meteor.setTimeout(() => {
                            let newFiles = instance.files.get()
                            console.log(newFiles)
                            newFiles.forEach((file, j) => {
                                if (file.tempId == tempId) {
                                    newFiles[j].id = fileId
                                    newFiles[j].status = "done"
                                    instance.files.set(newFiles)
                                }

                            })

                        }, 200)

                    })
                })
            })

        }
        instance.files.set(filesArray)
    },
    getUploadLink(file, projectId, callback) {
        let projectFile = new ProjectFile

        let projectFileParams = {
            symEnc_fileName: file.name,
            size: file.size,
            symEnc_mimeType: file.type,
            projectId: projectId
        }
        cryptoTools.encryptObject(projectFileParams, {symKey: Session.get("currentProjectSimKey")}, (encryptedProjectFileParams) => {
            console.log(encryptedProjectFileParams)
            projectFile.callMethod('newProjectFile', projectController.getAuthInfo(FlowRouter.current().params.projectId), encryptedProjectFileParams, (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(res)
                    callback(res.url, res.id)
                }
            })
        })

    },
    encryptFile(file, fileId, callback) {
        let reader = new FileReader();
        reader.onload = () => {

            let b64str = reader.result.split(",")[1];
            //console.log(b64str);

            let filename = file.name;
            cryptoTools.sim_encrypt_data(b64str, Session.get("currentProjectSimKey"), (encryptedData) => {


                // Generate a random boundary
                let boundary = "-----------------" + Math.floor(Math.random() * 32768) + Math.floor(Math.random() * 32768);

                let datapack = this.PackData(boundary, encryptedData, filename, "fileupload");

                callback(datapack, boundary)
            })
        };
        reader.readAsDataURL(file);


    },
    uploadFile(encryptedFile, uploadLink, boundary, projectId, callback) {
        this.UploadData(uploadLink, encryptedFile, boundary, () => {
            callback()
        })

    },
    PackData(boundary, data, filename, varname) {
        let datapack = '';
        datapack += '--' + boundary + '\r\n';
        datapack += 'Content-Disposition: form-data; ';
        datapack += 'name="' + varname + '"; filename="' + filename + '"\r\n';
        datapack += 'Content-Type: application/octet-stream\r\n\r\n';
        datapack += data;
        datapack += '\r\n';
        datapack += '--' + boundary + '--';
        return datapack;
    },
    UploadData(url, datapack, boundary, cb) {
        let xhr = new XMLHttpRequest();
        /*
        xhr.onreadystatechange = function() {
            if(this.readyState == 4)
               alert("error in upload!");
        }
        */
        xhr.open('PUT', url);
        xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
        xhr.send(datapack);
        xhr.onload = () => {
            if (xhr.status == 200) {
                cb()
            } else {
                console.warn("la requete d'upload de fichier sur minio ne passe pas")
            }
        }
    },
    delete(tempId, instance) {
        console.log(tempId)
        let fileToDelete = false
        let files = instance.files.get()
        files.forEach((file, i) => {
            if (file.tempId === tempId) {
                console.log(file)
                let projectFile = new ProjectFile
                projectFile.callMethod('deleteProjectFile', projectController.getAuthInfo(instance.projectId), file.id, (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(res)
                        files.splice(i, 1)
                        instance.files.set(files)
                    }
                })
            }
        })
    },
    getFile(fileInfo, callback){
        this.getFileUrl(fileInfo, (fileUrl)=>{
            Axios.get(fileUrl)
                .then((res)=>{
                   // console.log("axiosRes",res.data)
                    this.decryptFile(res.data)
                }).catch((err)=>{
                    console.log(err)
            })
        })
    },
    decryptFile(fileData, callback){
        // let reader = new FileReader();
        // reader.onload = () => {

            let b64str = fileData.split("\n")[4];
            console.log(b64str);

            //let filename = file.name;
            cryptoTools.sim_decrypt_data(b64str, Session.get("currentProjectSimKey"), (decryptedData) => {
console.log(decryptedData)

                // Generate a random boundary
                // let boundary = "-----------------" + Math.floor(Math.random() * 32768) + Math.floor(Math.random() * 32768);
                //
                // let datapack = this.PackData(boundary, encryptedData, filename, "fileupload");
                //
                // callback(datapack, boundary)
            })
        // };
        // reader.readAsDataURL(file);

    },
    getFileUrl(fileInfo, callback){
        let file = new ProjectFile(fileInfo._id)
        file.callMethod("getFileUrl", projectController.getAuthInfo(fileInfo.projectId), fileInfo._id, (err,res)=>{
            if(err){
                console.log(err)
            }else{
                callback(res)
            }
        })
    }

}

export default projectFilesController
