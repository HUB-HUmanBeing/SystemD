import cryptoTools from "./cryptoTools";
import ProjectFile from "../../imports/classes/ProjectFile";
import projectController from "./controllers/projectController";
import Axios from "axios";
import Project from "../../imports/classes/Project";

const projectFilesController = {

    encryptAndUploadFiles(files, projectId, instance,parentFolderId, cb) {
        let totalSize = 0
        let projectFilesSize = Project.findOne(FlowRouter.current().params.projectId).private.totalFilesSize
        let filesArray = instance.files ? instance.files.get() : []
        for (let i = 0; i < files.length; i++) {
            let tempId = cryptoTools.generateId()
            totalSize += files[i].size
            if ((totalSize + projectFilesSize) < Meteor.settings.public.maxFilesSize) {
                if(files[i].size<Meteor.settings.public.maxOneFile){
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
                    this.getUploadLink(files[i], projectId, parentFolderId,(uploadLink, fileId) => {
                        this.encryptFile(files[i], fileId, (encryptedBlob) => {
                            this.uploadFile(encryptedBlob, uploadLink, projectId, () => {
                                Meteor.setTimeout(() => {
                                    if( instance.files){
                                        let newFiles = instance.files.get()
                                        newFiles.forEach((file, j) => {
                                            if (file.tempId == tempId) {
                                                newFiles[j].id = fileId
                                                newFiles[j].status = "done"
                                                instance.files.set(newFiles)
                                            }

                                        })
                                    }


                                }, 200)

                            })
                        })
                    })
                }else{
                    cb(__("projectFiles.limitOneFile"))
                }

            } else {
                cb(__("projectFiles.limitSize"))
            }


        }
        if( instance.files){
            instance.files.set(filesArray)
        }

    },
    getUploadLink(file, projectId,parentFolderId, callback) {
        let projectFile = new ProjectFile

        let projectFileParams = {
            symEnc_fileName: file.name,
            size: file.size,
            symEnc_mimeType: file.type,
            projectId: projectId,
            parentFolderId: parentFolderId || "root"
        }
        cryptoTools.encryptObject(projectFileParams, {symKey: Session.get("currentProjectSimKey")}, (encryptedProjectFileParams) => {
            projectFile.callMethod('newProjectFile', projectController.getAuthInfo(FlowRouter.current().params.projectId), encryptedProjectFileParams, (err, res) => {
                if (err) {
                    console.log(err)
                } else {
                    //console.log(res)
                    callback(res.url, res.id)
                }
            })
        })

    },
    encryptFile(file, fileId, callback) {
        let reader = new FileReader();
        reader.onload = () => {
            let filename = file.name;
            const iv = window.crypto.getRandomValues(new Uint8Array(16)); //generate a random iv
            const content = new Uint8Array(reader.result); //encoded file content
            // encrypt the file
            cryptoTools.importSymKey(Session.get("currentProjectSimKey"), (symKey) => {
                window.crypto.subtle.encrypt({
                    iv,
                    name: "AES-CBC"
                }, symKey, content)
                    .then(function (encrypted) {
                        //returns an ArrayBuffer containing the encrypted data
                        const blob = new Blob([window.atob("RW5jcnlwdGVkIFVzaW5nIEhhdC5zaA"), iv, new Uint8Array(encrypted)], {
                            type: 'application/octet-stream'
                        });
                        callback(blob)//create the new file buy adding signature and iv and content
                        //console.log("file has been successuflly encrypted");
                    })
                    .catch(function (err) {
                        console.log("An error occured while Encrypting the file, try again!"); //reject
                    });
            })
        };
        reader.readAsArrayBuffer(file);


    },
    uploadFile(encryptedBlob, uploadLink, projectId, callback) {
        this.UploadData(uploadLink, encryptedBlob, () => {
            callback()
        })

    }
    ,

    UploadData(url, blob, cb) {

        let xhr = new XMLHttpRequest();
        /*
        xhr.onreadystatechange = function() {
            if(this.readyState == 4)
               alert("error in upload!");
        }
        */
        // const blob = new Blob(datapack, {
        //     type: 'application/octet-stream'
        // });
        // console.log("datapack",datapack,  blob)
        xhr.open('PUT', url);
        xhr.setRequestHeader('Content-Type', 'multipart/form-data;');
        xhr.send(blob);
        xhr.onload = () => {
            if (xhr.status == 200) {
                cb()
            } else {
                console.warn("la requete d'upload de fichier sur minio ne passe pas")
            }
        }
    }
    ,
    delete(tempId, instance) {
        let fileToDelete = false
        let files = instance.files.get()
        files.forEach((file, i) => {
            if (file.tempId === tempId) {
                let projectFile = new ProjectFile
                projectFile.callMethod('deleteProjectFile', projectController.getAuthInfo(instance.projectId), file.id, (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {
                        files.splice(i, 1)
                        instance.files.set(files)
                    }
                })
            }
        })
    }
    ,
    deleteSaved(fileId, cb) {

        let projectFile = new ProjectFile
        projectFile.callMethod('deleteProjectFile', projectController.getAuthInfo(FlowRouter.current().params.projectId), fileId, (err, res) => {
            if (err) {
                console.log(err)
            } else {
                cb()
            }
        })

    },
    getFile(fileInfo, callback) {
        this.getFileUrl(fileInfo, (fileUrl) => {
            Axios({
                url: fileUrl,
                method: 'GET',
                responseType: 'blob', // important
            })
                .then((res) => {

                    let fileReader = new FileReader();
                    fileReader.onload = (event) => {
                        //data:image/jpeg;base64,
                        const iv = new Uint8Array(fileReader.result.slice(22, 38)); //take out encryption iv

                        const content = new Uint8Array(fileReader.result.slice(38)); //take out encrypted content
                        cryptoTools.importSymKey(Session.get("currentProjectSimKey"), (symKey) => {
                            window.crypto.subtle.decrypt({
                                iv,
                                name: "AES-CBC"
                            }, symKey, content)
                                .then(function (decrypted) {
                                    //returns an ArrayBuffer containing the decrypted data
                                    const blob = new Blob([new Uint8Array(decrypted)], {
                                        type: 'application/octet-stream'
                                    });
                                    window.blobToDownload = blob
                                    const url = URL.createObjectURL(blob);
                                    callback(url) //create new file from the decrypted content

                                })
                                .catch(function () {
                                    console.log("You have entered a wrong Decryption Key!");
                                });
                        })
                    };
                    fileReader.readAsArrayBuffer(res.data);
                    // console.log("axiosRes",res.data)

                }).catch((err) => {
                console.log(err)
            })
        })
    }
    ,
    decryptFile(fileData, callback) {
        cryptoTools.sim_decrypt_data(fileData, Session.get("currentProjectSimKey"), (res) => {
            callback(res)
        })
    }
    ,
    getFileUrl(fileInfo, callback) {
        let file = new ProjectFile(fileInfo._id)
        file.callMethod("getFileUrl", projectController.getAuthInfo(fileInfo.projectId), fileInfo._id, (err, res) => {
            if (err) {
                console.log(err)
            } else {
                callback(res)
            }
        })
    },
    saveBlob2File (fileName, blob) {
    var folder = cordova.file.externalRootDirectory + 'Download'
    window.resolveLocalFileSystemURL(folder, (dirEntry) =>{
        console.log('file system open: ' + dirEntry.name)
        this.createFile(dirEntry, fileName, blob)
    }, this.onErrorLoadFs)
},

createFile (dirEntry, fileName, blob) {
    // Creates a new file
    dirEntry.getFile(fileName, { create: true, exclusive: false },  (fileEntry)=> {
        this.writeFile(fileEntry, blob)
    }, this.onErrorCreateFile)
},

writeFile (fileEntry, dataObj) {
    // Create a FileWriter object for our FileEntry
    fileEntry.createWriter( (fileWriter)=> {
        fileWriter.onwriteend =  ()=> {
            Materialize.toast(__('fullScreenFile.downloadSuccess'), 3000, 'toastOk')
        }

        fileWriter.onerror =  (error) =>{
            console.log('Failed file write: ' + error)
            this.onErrorCreateFile(error)
        }
        fileWriter.write(dataObj)
    })
},

onErrorLoadFs (error) {
    console.log(error)
    Materialize.toast(__('general.error'), 6000, 'toastError')
},

 onErrorCreateFile (error) {
    console.log(error)
     Materialize.toast(__('general.error'), 6000, 'toastError')
}

}

export default projectFilesController
