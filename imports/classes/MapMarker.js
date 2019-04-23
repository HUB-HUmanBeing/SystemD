import {Class} from 'meteor/jagi:astronomy';
import MapMarkers from "../../lib/collections/MapMarkers";

const IconMarker = Class.create({
    name: "IconMarker",
    fields: {
        symEnc_name: {
            type: String,
            optional: true
        },
        symEnc_coordinates: {
            type: String
        },
        symEnc_color: {
            type: String
        },
        symEnc_icon: {
            type: String
        },
        symEnc_detail: {
            type: String,
            optional: true
        }
    }
})

const MarkerText = Class.create({
    name: "MarkerText",
    fields: {
        symEnc_name: {
            type: String,
            optional: true
        },
        symEnc_coordinates: {
            type: String
        },
        symEnc_color: {
            type: String
        },
        symEnc_detail: {
            type: String,
            optional: true
        }
    }
})
const Polyline = Class.create({
    name: "Polyline",
    fields: {
        symEnc_name: {
            type: String,
            optional: true
        },
        symEnc_coordinates: {
            type: String
        },
        symEnc_color: {
            type: String
        },
        symEnc_detail: {
            type: String,
            optional: true
        }
    }
})
const Arrow = Class.create({
    name: "Arrow",
    fields: {
        symEnc_name: {
            type: String,
            optional: true
        },
        symEnc_coordinates: {
            type: String
        },
        symEnc_color: {
            type: String
        },
        symEnc_detail: {
            type: String,
            optional: true
        },
        curve:{
            type:Number
        }
    }
})
const Shape = Class.create({
    name: "Shape",
    fields: {
        symEnc_name: {
            type: String,
            optional: true
        },
        shapeType: {
            type: String
        },
        symEnc_coordinates: {
            type: String
        },
        symEnc_color: {
            type: String
        },
        symEnc_detail: {
            type: String,
            optional: true
        },
        symEnc_radius: {
            type: String,
            optional: true
        },
    }
})

const MemberPosition = Class.create({
    name: "MemberPosition",
    fields: {
        memberId: {
            type: String
        },
        symEnc_coordinates: {
            type: String
        }
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
        polyline: {
            type: Polyline,
            optional: true

        },
        arrow:{
            type: Arrow,
            optional: true
        },
        memberPosition: {
            type: MemberPosition,
            optional: true
        },
        shape: {
            type: Shape,
            optional: true
        },
        markerText:{
            type:MarkerText,
            optional:true
        }
    },
    helpers: {}

});

export default MapMarker
