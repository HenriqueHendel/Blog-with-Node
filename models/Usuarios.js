const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usuario = new Schema({
    nome:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    admin:{
        type: Number,
        default: 0 // 0 -> Não é admin; 1 -> É admin;
    },
    senha:{
        type: String,
        required: true
    }
});

mongoose.model("usuarios",usuario);