import {Class} from 'meteor/jagi:astronomy';
import Publications from "../../lib/collections/Publications";

const TextualContent = Class.create({
    name: "TextualContent",
    fields: {
        symEnc_text: String
    }
})
const FileContent = Class.create({
    name: "FileContent",
    fields: {
        symEnc_text: String,
        projectFileIds : {
            type : [String],
            default: function () {
                return [];
            }
        }
    }
})
const PollOption = Class.create({
    name: "PollOption",
    fields: {
        symEnc_label: String,
        checkedBy: {
            type: [String],
            default: function () {
                return [];
            }

        }
    }
})
const PollContent = Class.create({
    name: "PollContent",
    fields: {
        symEnc_text: String,
        options: {
            type: [PollOption],
            default: function () {
                return [];
            }
        }
    }
})

const Publication = Class.create({
    name: 'Publication',
    collection: Publications,
    fields: {
        projectId: {
            type: String,
            index: 1
        },
        type: {
            type: String
        },
        createdBy: {
            type: String
        },
        topicId: {
            type: String,

            index: 1
        },
        createdAt: {
            type: Date,
            default: function () {
                return new Date()
            },
            index: -1
        },
        textualContent: {
            type: TextualContent,
            optional: true
        },
        pollContent: {
            type: PollContent,
            optional: true
        },
        fileContent:{
          type:FileContent,
          optional:true
        },
        commentCount: {
            type: Number,
            default: function () {
                return 0
            }
        },
        likedBy: {
            type: [String],
            default: function () {
                return [];
            }
        },
        pinned:{
            type: Boolean,
            default:function () {
                return false
            },
            index: 1
        }

    },
    helpers: {}

});

export default Publication
