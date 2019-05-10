import {Class} from 'meteor/jagi:astronomy';
import Activities from "../../lib/collections/Activities";

const Check = Class.create({
    name: 'Check',
    fields: {
        symEnc_label:{
            type:String,
            optional:true
        },
        checked:{
            type:Boolean,
            default:false
        }
    }
})
const Activity = Class.create({
    name: 'Activity',
    collection: Activities,
    fields: {
        projectId: {
            type: String,
            index: 1
        },
        createdBy: {
            type: String
        },
        symEnc_title: {
            type: String,
            optional: true
        },
        daysOfWeek: {
            type: [Number],
            default: function () {
                return []
            }
        },
        symEnc_detail: {
            type: String,
            optional: true
        },
        done: {
            type: Boolean,
        },
        color: {
            type: Number,
            default: 0
        },
        allDay: {
            type: Boolean,
            default: false
        },
        start: {
            type: Date,
            optional: true,
            index: -1
        },
        end: {
            type: Date,
            optional: true,
            index: -1
        },
        createdAt: {
            type: Date,
            default: function () {
                return new Date()
            },
            index: -1
        },
        lastEditAt: {
            type: Date,
            optional:true,
        },
        invitedMembers: {
            type: [String],
            default: function () {
                return [];
            }
        },
        symEnc_coordinates: {
            type: String,
            optional:true
        },
        checkList: {
            type: [Check],
            default: function () {
                return [];
            }
        },
        participants: {
            type: [String],
            default: function () {
                return [];
            }
        }
    },
    helpers: {}

});

export default Activity
