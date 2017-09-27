
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


UserSelfProfileSchema = new SimpleSchema({
        description: {
            type: String,
            label: "description",
            max: 1000
        }
    });