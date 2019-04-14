import {Class} from 'meteor/jagi:astronomy';
import MapMarkers from "../../lib/collections/MapMarkers";

const IconMarker = Class.create({
    name: "IconMarker",
    fields: {
        symEnc_name: {
            type: String,
            optional: true
        },
        symEnc_coordinates:{
            type: String
        },
        symEnc_color:{
            type: String
        },
        symEnc_icon:{
            type: String
        },
    }
})
const MapMarker = Class.create({
    name: 'MapMarker',
    collection: MapMarkers,
    fields: {
        projectId: {
            type: String,
            index: 1
        },
        markerType: {
            type: String
        },
        createdBy: {
            type: String
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
            default: function () {
                return new Date()
            },
            index: -1
        },
        iconMarker: {
            type: IconMarker,
            optional: true

        },
        commentCount: {
            type: Number,
            default: function () {
                return 0
            }
        }

    },
    helpers: {}

});

export default MapMarker
