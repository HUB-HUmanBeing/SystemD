
//format de l'objet qui doit etre envoyé
CreateUserAttributeSchema = new SimpleSchema({
    username : {
        type: String,
        label: "Username",
        max: 35
    },
    password: {
        type:String,
        label: "Password",
    }
});

locationSchema = new SimpleSchema({

    lat : {
        type: Number,
        label: "Latitude",
        decimal: true
    },
    lng : {
        type: Number,
        label: "Longitude",
        decimal: true
    },
    city: {
        type : String,
        label: "City"
    },
    country: {
        type : String,
        label: "Country"
    }
});

UserSelfProfileSchema = new SimpleSchema({
        description: {
            type: String,
            label: "Description",
            max: 1000
        },
        location:{
            type: locationSchema
        }
});
