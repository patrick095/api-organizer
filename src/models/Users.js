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
        default: [{id: "0", type: "card",title: "Novo Card", body: [{title: "Novo Item", body: ""}]}]
    },
    theme:{
        type: Object,
        default: {bgColor: "#4266b9", fontColor: "#fff"}
    }
})


mongoose.model('Users', UserSchema)