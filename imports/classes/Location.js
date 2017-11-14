import {Class} from 'meteor/jagi:astronomy';

const Location = Class.create({
    name: "Location",
    fields: {
        lonLat: {
            type: [Number],
            optional: true,
            validators: [
                {
                    type: 'length',
                    param: 2
                }
            ],
            index: "2dsphere"
        },
        city: {
            type: String,
            validators: [
                {
                    type: 'maxLength',
                    param: 100
                }
            ],
            optional: true
        },
        country: {
            type: String,
            validators: [
                {
                    type: 'maxLength',
                    param: 100
                }
            ],
            optional: true
        }
    }
})

export default Location;