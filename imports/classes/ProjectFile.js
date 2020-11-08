import {Class} from 'meteor/jagi:astronomy';
import ProjectFiles from "../../lib/collections/ProjectFiles";



const ProjectFile = Class.create({
    name: 'ProjectFile',
    collection: ProjectFiles,
    fields: {
        projectId: {
            type: String,
            index:1
        },
        symEnc_fileName: { //memberId of the admin who emit the invitation
            type: String
        },
        size:{
          type: Number
        },
        symEnc_mimeType: {
            type:String
        },
        createdAt: {
            type: Date,
            default: function () {
                return new Date()
            }
        },
        createdBy:{
            type: String
        },
        parentFolderId: {
            type: String,
            default: function () {
                return null
            },
            index: 1
        },
    },
    helpers: {
    }

});

export default ProjectFile
