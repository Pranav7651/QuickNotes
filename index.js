const express = require('express');
const app = express();
const path = require('path'); 
const fs = require('fs');

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth()+1).padStart(2,'0');
const day = String(today.getUTCDay()).padStart(2,'0');

// console.log(day,month,year,today);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');

app.get("/",(req,res)=>{
    fs.readdir(`./files`,(err,files)=>{
        res.render("index",{files});
    });
});

app.get("/edit/:filename",(req,res)=>{
    fs.readFile(`./files/${req.params.filename}`,"utf-8",(err,data)=>{
        if(err) return res.send(err.message);
        res.render("edit",{data: data.trim(),filename: req.params.filename});
    });
});

app.post("/update/:filename",(req,res)=>{
    fs.writeFile(`./files/${req.params.filename}`,req.body.filedata,"utf-8",(err)=>{
        if(err) return res.send(err.message);
        res.redirect("/");
    });
});

app.get("/view/:noteid",(req,res)=>{
    fs.readFile(`./files/${req.params.noteid}`,"utf-8",(err,data)=>{
        if(err) return res.send(err.message);
        res.render("view",{data,filename: req.params.noteid});
    });
});

app.get("/create",(req,res)=>{
    res.render("create");
});

app.post("/create",(req,res)=>{
    fs.writeFile(`./files/${req.body.title}.txt`,req.body.newfiledata,(err)=>{
        if(err) console.log("error");
        res.redirect("/")
    });
    // res.redirect("/");
});

app.get("/delete/:filename",(req,res)=>{
    fs.unlink(`./files/${req.params.filename}`,(err)=>{
        if(err) res.send(err.message);
        res.redirect("/");
    });
});


app.listen(3000,()=>{
    console.log("Server is Running");
});