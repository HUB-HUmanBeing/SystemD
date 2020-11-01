import {Class} from 'meteor/jagi:astronomy';
import Pads from "../../lib/collections/Pads";
const CurrentPadEditor = Class.create({
    name: 'CurrentPadEditor',
    fields:{
        memberId: {
            type:String,
            optional: true,
        },
        lastActivityAt:{
            type:Date,
            optional: true,
        }
    }
})
const PadsContent = Class.create({
    name: 'PadsContent',
    fields:{
        symEnc_datas: {
            type:String,
            optional: true,
        },
        columns:{
            type:String,
            default: function () {
                return "[]"
            }
        },
        style:{
            type:String,
            default: function () {
                return "{}"
            }
        },

    }
})

const Pad = Class.create({
    name: 'Pad',
    collection: Pads,
    fields: {
        projectId: {
            type: String,
            index: 1
        },
        createdBy: {
          type:String
        },
        symEnc_name: {
            type:String
        },
        lastActivity:{
            type: Date,
            default: function () {
                return new Date()
            },
            index:-1
        },
        currentEditor:{
            type: CurrentPadEditor,
            default: function () {
                return {};
            }
        },
        content:{
            type:PadsContent,
            default: function () {
                return {};
            }
        }
    },
    helpers: {

    }

});

export default Pad
