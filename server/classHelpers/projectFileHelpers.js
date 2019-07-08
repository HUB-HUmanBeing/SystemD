import {check} from "meteor/check";
import Comment from "/imports/classes/Comment";
import NotifPush from "../../imports/NotifPush";
import Publication from "../../imports/classes/Publication";
import ProjectFile from "../../imports/classes/ProjectFile";
import Project from "../../imports/classes/Project";
import minioTools from "../../imports/minioTools";


ProjectFile.extend({
    helpers: {
        async removeAndDeleteFile() {
           let currentProject = Project.findOne(this.projectId)
            currentProject.private.totalFilesSize -= this.size
            await minioTools.client.removeObject('project-files', this._id)
            return this.remove((err)=> {
                    if (!err) {
                        currentProject.save()
                    }
                })

        }
    }
})
