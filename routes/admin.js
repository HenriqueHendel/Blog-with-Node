const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria");
const categoria = mongoose.model("categorias");
require("../models/Postagens");
const postagem = mongoose.model("postagens");
const {confere_admin} = require("../helpers/confere_admin")

router.get("/", confere_admin, (req,res)=>{
    res.render("./admin/index")
});

router.get("/post", confere_admin, (req, res)=>{
    res.send("Posts Page")
});

router.get("/categorias", confere_admin, (req,res)=>{
    categoria.find().lean().sort({date: "desc"}).then((categorias)=>{
        res.render("./admin/categorias", {categorias:categorias})
    }).catch((err)=>{
        req.flash("error_msg","There is a error to list the categories");
        res.redirect("/admin");
    })
});

router.get("/categoria/add", confere_admin, (req,res)=>{
    res.render("./admin/addcategoria")
});

router.post("/categorias/nova", confere_admin, (req,res)=>{
    var erros = [];

    if(!req.body.nome || typeof(req.body.nome)==undefined || req.body.nome == null ){
        erros.push({texto: "Invalid Name"})
    };

    if(!req.body.slug || typeof(req.body.slug)==undefined || req.body.slug == null ){
        erros.push({texto: "Invalid Slug"})
    };

    if(erros.length>0){
        res.render("admin/addcategoria", {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        };
    
        new categoria(novaCategoria).save().then(()=>{
            req.flash("success_msg","Category Created Successfuly");
            res.redirect("/admin/categorias");
        }).catch((e)=>{
            req.flash("error_msg","There is a error to create category");
            res.redirect("/admin");
        });
    }
});

router.get("/categorias/edit/:id", confere_admin, (req,res)=>{
    categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
        res.render("./admin/editcategoria", {categoria:categoria})
    }).catch((err)=>{
        req.flash("error_msg","There isn't this category");
        res.redirect("/admin/categorias");
    })
});

router.post("/categoria/edit", confere_admin, (req,res)=>{
    categoria.findOne({_id: req.body.id}).then((categoria)=>{
        categoria.nome = req.body.nome;
        categoria.slug = req.body.slug;

        categoria.save().then(()=>{
            req.flash("success_msg","Category Edited Successfuly");
            res.redirect("/admin/categorias");
        }).catch((err)=>{
            req.flash("error_msg","There is a error to edit this category");
            console.log(err);
            res.redirect("/admin/categorias");
        })
    }).catch((err)=>{
        req.flash("error_msg","There is a error to edit this category");
        console.log(err);
    })
})

router.post("/categoria/deletar", confere_admin, (req,res)=>{
    categoria.remove({_id:req.body.id}).then(()=>{
        req.flash("success_msg", "Category Deleted Successfuly");
        res.redirect("/admin/categorias");
    }).catch((err)=>{
        req.flash("error_msg","There is a error to delete this category");
        res.redirect("/admin/categorias");
    })
})

///////////////////////////// Posts /////////////////////////

router.get("/postagens", confere_admin, (req,res) =>{
    postagem.find().lean().sort({data:"desc"}).then((postagens)=>{
        res.render("./admin/postagens", {postagens:postagens});
    }).catch((err)=>{
        req.flash("error_msg","There is a error to list the posts");
        res.redirect("/admin");
    })
})

router.get("/postagens/add", confere_admin, (req,res)=>{
    categoria.find().lean().then((categoria)=>{
        res.render("./admin/addpostagem", {categorias: categoria});  
    }).catch((err)=>{
        req.flash("error_msg","There is a error to create the post");
        res.redirect("/admin");
    })
})

router.post("/postagem/nova", confere_admin, (req,res)=>{
    var erros = [];

    if(req.body.categoria == "0"){
        erros.push({texto: "Invalid Category. Please, registre one"});
    }

    if(erros.length>0){
        res.render("./admin/addpostagem",{erros: erros});
    }else{
        const novaPostagem = {
            titulo:req.body.titulo,
            descricao:req.body.descricao,
            conteudo:req.body.conteudo,
            categoria:req.body.categoria,
            slug:req.body.slug
        };

        new postagem(novaPostagem).save().then(()=>{
            req.flash("success_msg","Post Done Successfuly");
            res.redirect("/admin/postagens");
        }).catch((err)=>{
            req.flash("error_msg","There is a error to create the post");
            res.render("/admin/postagens")
        })
    }

})

router.get("/postagens/edit/:id", confere_admin, (req,res)=>{
    postagem.findOne({_id:req.params.id}).lean().then((postagem)=>{
        categoria.find().lean().then((categorias)=>{
            res.render("./admin/editpostagens", {categorias:categorias,postagens:postagem});
        }).catch((err)=>{
            req.flash("error_msg","There is a error to list the categories");
            res.redirect("/admin/postagens");
        })
    }).catch((err)=>{
        req.flash("error_msg","There is a error to render the edit form");
        res.redirect("/admmin/postagens");
    })
})

router.post("/postagem/edit", confere_admin, (req,res)=>{
    postagem.findOne({_id:req.body.id}).then((postagem)=>{

        postagem.titulo = req.body.titulo;
        postagem.slug = req.body.slug;
        postagem.descricao = req.body.descricao;
        postagem.conteudo = req.body.conteudo;
        postagem.categoria = req.body.categoria;

        postagem.save().then(()=>{
            req.flash("success_msg","Post Edited Successfuly");
            res.redirect("/admin/postagens");
        }).catch((err)=>{
            console.log(err);
            req.flash("error_msg","There is a error to edit the Post");
            res.redirect("/admin/postagens");
        })

    }).catch((err)=>{
        req.flash("error_msg","There is a error to edit the Post");
        res.redirect("/admin/postagens");
    })
})

router.get("/postagens/deletar/:id", confere_admin, (req,res)=>{
    postagem.remove({_id:req.params.id}).then(()=>{
        req.flash("success_msg","Post Deleted Successfuly");
        res.redirect("/admin/postagens");
    }).catch((err)=>{
        console.log(err);
        req.flash("error_msg","There is a error to delete the post");
        res.redirect("/admin/postagens");
    })
})


module.exports = router;