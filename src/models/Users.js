const mongoose = require('../database')

const UserSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    password: { 
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    token:{
        type: Array,
        default: []
    },
    data:{
        type: Array,
        default: [{id: "0", type: "card",title: "Novo Card", body: []}]
    }
})


mongoose.model('Users', UserSchema)