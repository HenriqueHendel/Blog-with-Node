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
    res.send("Página de posts")
});

router.get("/categorias", confere_admin, (req,res)=>{
    categoria.find().lean().sort({date: "desc"}).then((categorias)=>{
        res.render("./admin/categorias", {categorias:categorias})
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao listar as categorias");
        res.redirect("/admin");
    })
});

router.get("/categoria/add", confere_admin, (req,res)=>{
    res.render("./admin/addcategoria")
});

router.post("/categorias/nova", confere_admin, (req,res)=>{
    var erros = [];

    if(!req.body.nome || typeof(req.body.nome)==undefined || req.body.nome == null ){
        erros.push({texto: "Nome inválido"})
    };

    if(!req.body.slug || typeof(req.body.slug)==undefined || req.body.slug == null ){
        erros.push({texto: "Slug inválido"})
    };

    if(erros.length>0){
        res.render("admin/addcategoria", {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        };
    
        new categoria(novaCategoria).save().then(()=>{
            req.flash("success_msg","Categoria criada com sucesso");
            res.redirect("/admin/categorias");
        }).catch((e)=>{
            req.flash("error_msg","Houve um erro ao criar uma categoria");
            res.redirect("/admin");
        });
    }
});

router.get("/categorias/edit/:id", confere_admin, (req,res)=>{
    categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
        res.render("./admin/editcategoria", {categoria:categoria})
    }).catch((err)=>{
        req.flash("error_msg","Esta categoria não existe");
        res.redirect("/admin/categorias");
    })
});

router.post("/categoria/edit", confere_admin, (req,res)=>{
    categoria.findOne({_id: req.body.id}).then((categoria)=>{
        categoria.nome = req.body.nome;
        categoria.slug = req.body.slug;

        categoria.save().then(()=>{
            req.flash("success_msg","Categoria alterada com sucesso");
            res.redirect("/admin/categorias");
        }).catch((err)=>{
            req.flash("error_msg","Huve um erro ao editar a categoria");
            console.log(err);
            res.redirect("/admin/categorias");
        })
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao editar a categoria");
        console.log(err);
    })
})

router.post("/categoria/deletar", confere_admin, (req,res)=>{
    categoria.remove({_id:req.body.id}).then(()=>{
        req.flash("success_msg", "Categoria deletada com suceeso");
        res.redirect("/admin/categorias");
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao deletar a categoria");
        res.redirect("/admin/categorias");
    })
})

///////////////////////////// Posts /////////////////////////

router.get("/postagens", confere_admin, (req,res) =>{
    postagem.find().lean().sort({data:"desc"}).then((postagens)=>{
        res.render("./admin/postagens", {postagens:postagens});
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao listar as postagens");
        res.redirect("/admin");
    })
})

router.get("/postagens/add", confere_admin, (req,res)=>{
    categoria.find().lean().then((categoria)=>{
        res.render("./admin/addpostagem", {categorias: categoria});  
    }).catch((err)=>{
        req.flash("error_msg","Houve um erro ao criar a postagem");
        res.redirect("/admin");
    })
})

router.post("/postagem/nova", confere_admin, (req,res)=>{
    var erros = [];

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria inválida. Registre uma categoria"});
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
            req.flash("success_msg","Postagem feita com sucesso");
            res.redirect("/admin/postagens");
        }).catch((err)=>{
            req.flash("error_msg","Não foi possível criar a postagem");
            res.render("/admin/postagens")
        })
    }

})

router.get("/postagens/edit/:id", confere_admin, (req,res)=>{
    postagem.findOne({_id:req.params.id}).lean().then((postagem)=>{
        categoria.find().lean().then((categorias)=>{
            res.render("./admin/editpostagens", {categorias:categorias,postagens:postagem});
        }).catch((err)=>{
            req.flash("error_msg","Houve um erro ao listar as categorias");
            res.redirect("/admin/postagens");
        })
    }).catch((err)=>{
        req.flash("error_msg","Não foi possível carregar o formulário de edição");
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
            req.flash("success_msg","Postagem editada com êxito");
            res.redirect("/admin/postagens");
        }).catch((err)=>{
            console.log(err);
            req.flash("error_msg","Houve um erro ao editar a postagem");
            res.redirect("/admin/postagens");
        })

    }).catch((err)=>{
        req.flash("error_msg","Não foi possível editar a postagem");
        res.redirect("/admin/postagens");
    })
})

router.get("/postagens/deletar/:id", confere_admin, (req,res)=>{
    postagem.remove({_id:req.params.id}).then(()=>{
        req.flash("success_msg","Postagem deletada com sucesso");
        res.redirect("/admin/postagens");
    }).catch((err)=>{
        console.log(err);
        req.flash("error_msg","Houve um erro ao deletar a postagem");
        res.redirect("/admin/postagens");
    })
})


module.exports = router;