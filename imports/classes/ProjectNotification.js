import {Class} from 'meteor/jagi:astronomy';
import ProjectNotifications from "../../lib/collections/ProjectNotifications";


const ProjectNotification = Class.create({
    name: 'ProjectNotification',
    collection: ProjectNotifications,
    fields: {
        projectId: {
            type: String,
            index: 1
        },
        notifiedMembers: { //memberId of the admin who emit the ProjectNotificationMethods
            type: [String],
            index: 1
        },
        section: {
            type: String,
            index: 1
        },
        notifType:{
            type:String
        },
        url: {
            type: String
        },

        createdAt: {
            type: Date,
            default: function () {
                return new Date()
            },
        },
    },
    helpers: {
    }

});

export default ProjectNotification
