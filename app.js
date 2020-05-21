// carregando módulos
    const express = require("express");
    const app = express();
    const handlebars = require("express-handlebars");
    const bodyParser = require("body-parser");
    const admin = require("./routes/admin");
    const path = require("path");
    const mongoose = require("mongoose");
    const session = require("express-session");
    const flash = require("connect-flash");
    require("./models/Postagens");
    const postagens = mongoose.model("postagens");
    require("./models/Categoria");
    const categorias = mongoose.model("categorias");
    const usuarios = require("./routes/usuario");
    const passport = require("passport");
    require("./config/auth")(passport);
    const db = require("./config/db");

// Configurações
    // Sessão
        app.use(session({
            secret: "chave",
            resave: true,
            saveUninitialized: true
        }));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(flash());

    // Middleware
        app.use((req,res,next)=>{
            res.locals.success_msg=req.flash("success_msg");
            res.locals.error_msg=req.flash("error_msg");
            res.locals.error = req.flash("error");
            res.locals.user = req.user || null;
            next();
        });

    // Body Parser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());

    //  Handlebars
        app.engine("handlebars", handlebars({defaultLayout: "main"}));
        app.set("view engine", "handlebars");

    // Arquivos estáticos
        app.use(express.static(path.join(__dirname, "public")));

    // Moongose
        mongoose.Promise=global.Promise;
        mongoose.connect(db.URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
// Rotas
    app.use("/admin", admin);
    app.use("/usuarios", usuarios);

    app.get("/", (req,res)=>{
        postagens.find().lean().sort({data:"desc"}).then((postagens)=>{
            categorias.find().lean().then((categorias)=>{
                res.render("index", {postagens:postagens}); 
            }) 
        }).catch((err)=>{
            req.flash("error_msg","There is a intern error");
            res.redirect("/404", (req,res)=>{
                res.send("Erro");
            })
        })
    })

    app.get("/postagem/:slug", (req,res)=>{
        postagens.findOne({slug: req.params.slug}).lean().then((postagens)=>{
            if(postagens){
                res.render("./postagens/index",{postagem:postagens});
            }else{
                req.flash("error_msg","This post doesn't exist");
                res.redirect("/");
            }
        }).catch((err)=>{
            req.flash("error_msg","There is a intern error");
            res.redirect("/");
        })
    })

    app.get("/categorias", (req,res)=>{
        categorias.find().lean().then((categorias)=>{
            res.render("./categorias/index", {categorias:categorias});
        }).catch((err)=>{
            req.flash("error_msg","There is a error to list the categories");
            res.redirect("/");
        })
    })

    app.get("/categoria/:slug", (req,res)=>{
        categorias.findOne({slug:req.params.slug}).lean().then((categoria)=>{
            if(categoria){
                postagens.find({categoria:categoria._id}).lean().then((postagens)=>{
                    res.render("./categorias/postagens",{postagens:postagens, categoria:categoria});
                }).catch((err)=>{
                    req.flash("error_msg","There is a error to load the posts of this category");
                    res.redirect("/categorias");
                })
            }else{
                req.flash("error_msg","This category doesn't exist");
                res.redirect("/categorias");
            }
        }).catch((err)=>{
            req.flash("error_msg","There is a intern error to load this category page");
            res.redirect("/categorias");
        })
    })
// Servidor
    const porta = process.env.PORT || 8081;
    app.listen(porta, ()=>{
        console.log("Server ok")
    });