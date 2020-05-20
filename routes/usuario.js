// Carregando módulos
    const express = require("express");
    const router = express.Router();
    const mongoose = require("mongoose");
    require("../models/Usuarios");
    const Usuario = mongoose.model("usuarios");
    const bcrypt = require("bcryptjs");
    const passport = require("passport");

// Rotas
    router.get("/login", (req,res)=>{
        res.render("./usuarios/login");
    })

    router.post("/login", (req,res,next)=>{
        passport.authenticate("local",{
            successRedirect:"/",
            failureRedirect:"/usuarios/login",
            failureFlash:true
        })(req,res,next)
    })

    router.get("/logout", (req,res)=>{
        req.logout();
        req.flash("success_msg","Logout Done");
        res.redirect("/");
    })

// Exportando rotas
    module.exports = router;