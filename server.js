const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const ejs = require('ejs');
const fs = require('fs');
const fileType =  require('file-type');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 8080;


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/views'));
app.set('view engine','ejs' );
app.use(express.static(__dirname+'/uploads'))

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "AbidKhan@9035",
    database: "photo_upload",
    port: "3306"
});


var storage = multer.diskStorage({
	destination: (req, file, callback)=> {
		callback(null, './uploads')
	},
	filename: (req, file, callback)=> {
		//console.log(file)
		callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    },

    
    
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback)=> {
        let filetypes = /jpeg|jpg|png|pdf/;
        let mimetype = filetypes.test(file.mimetype);
        let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
        if (mimetype && extname) {
          return callback(null, true);
        }
        callback(new Error("File upload only supports the images and pdfs only"));
    },
    limits: {
        fileSize : 1024 * 1024 * 5 ,
        files: 1
    }
}).single('image');

app.get('/', (req,res)=>{
    res.render('index');

})

app.post('/upload',(req, res)=>{
    console.log("1");
    let msg = "";
    let path="";
    let data={};
    let link =""
    upload(req,res,err=>{
        if(err){
            msg = err.message;
            path="";
            console.log("2")
        }
        else{
            console.log("3");
            msg="Image uploaded succesfully";
            console.log(req.file);
            console.log(req.file.path)
            data ={
                homeowner_id: 1,
                dealer_id: 2,
                path: req.file.path
            }
            con.query('Insert into photo_record(homeowner_id,dealer_id,path) values(?,?,?)',[data.homeowner_id,data.dealer_id,data.path],(err,result)=>{
                if(err){
                    msg= "unable to connect to db";
                    console.log("4");
                    path=""
                    
                }else{
                    if(result.affectedRows>0){
                        console.log(result);
                        msg="Image uploaded succesfully";
                        path=req.file.path;
                        link="/"+req.file.path;
                        console.log("5");

                    }
                }
            })
            
        }
               
    })
    setTimeout(() => {
        console.log("6");
        res.render('index',{msg: msg,path: path,link: link}); 
    }, 500);
   
})

app.get('/uploads/:imagename',(req,res)=>{
    let imagename = req.params.imagename;
    let imagepath= __dirname+"/uploads/"+imagename;
    let image=fs.readFileSync(imagepath);
    let mime = fileType(image).mime
    res.writeHead(200,{'content-Type': mime})
    res.end(image,'binary');
});

app.listen(port,()=>{

    console.log(`runnin at ${port}`)
})
