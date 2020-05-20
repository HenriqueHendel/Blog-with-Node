const localStrategy = require("passport-local");
const mongoose = require("mongoose");
require("../models/Usuarios");
const Usuarios = mongoose.model("usuarios");
const bcrypt = require("bcryptjs");

module.exports = function(passport){
    passport.use( new localStrategy({usernameField:"email",passwordField:"senha"}, (email,senha,done)=>{
        Usuarios.findOne({email: email}).then((usuario)=>{
            if(!usuario){
                return done(null, false, {message:"Email não cadastrado"});
            }

            bcrypt.compare(senha, usuario.senha, (erro,acerto)=>{
                if(acerto){
                    return done(null, usuario);
                }else{
                    return done(null, false, {message:"Senha incorreta"});
                }
            })
        })
    }))

    passport.serializeUser((usuario, done)=>{
        done(null,usuario.id);
    })

    passport.deserializeUser((id,done)=>{
        Usuarios.findById(id,(err,usuario)=>{
            done(err,usuario);
        })
    })
}