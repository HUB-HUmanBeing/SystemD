import {check} from "meteor/check";
import Comment from "/imports/classes/Comment";
import NotifPush from "../../imports/NotifPush";
import Publication from "../../imports/classes/Publication";
import ProjectFile from "../../imports/classes/ProjectFile";


Publication.extend({
    helpers: {

        removeRecursive(cb) {
            if(this.type === "fileContent"){
                this.fileContent.projectFileIds.forEach(fileId=>{
                    let projectFile = ProjectFile.findOne(fileId)
                    if(projectFile){
                        projectFile.removeAndDeleteFile()
                    }
                })
            }
            return this.remove(err=>{
                if(cb){
                    cb(err)
                }
                if(!err){
                    let commentsInside= Comment.find({publicationId:this._id}).fetch()
                    commentsInside.forEach(comment=>{
                        comment.removeRecursive()
                    })
                }
            })
        }
    }
})
