const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const ejs = require('ejs');
//const mysql = require('mysql');

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "AbidKhan@9035",
//     database: "photo_upload"
// })
// db.connect((err)=>{
//     if (err) console.log(err);
//     else console.log("connected");
// })
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + '/views'));
app.set('view engine','ejs' );
app.use(express.static(__dirname+'/uploads'))


var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './uploads')
	},
	filename: (req, file, callback)=> {
		//console.log(file)
		callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    },

    
    
})

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {

        var filetypes = /jpeg|jpg|png|gif/;
        var mimetype = filetypes.test(file.mimetype);
        var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
        if (mimetype && extname) {
          return cb(null, true);
        }
        cb(new Error("File upload only supports the image filetypes"));
    },
    limits: {
        fileSize : 1024 * 1024 * 5 ,
        files: 5
    }
}).array('image',5);

app.get('/', (req,res)=>{
    // res.send("hello")
    res.render('index');

})

app.post('/upload',(req, res)=>{
    console.log("hello");
    //res.send("hello")
    let msg = "";
    upload(req,res,err=>{
        if(err){
            
            msg = err.message;
           
            //res.render('index',{msg:msg})
        }
         else{
            //let msg =""
            console.log("hello");
            req.files.length === 1 ? msg="Image uploaded succesfully":msg="Images uploaded successfully"
            console.log(req.files);
           //s let locat =`${req.files[0].path}`;
            for(let i =0; i < req.files.length;i++){
            console.log(`${req.files[i].path}`)
            //res.render('index',{msg:msg})
            //console.log(;
            
        }
      
        }
        res.render('index',{msg: msg});;
    })
    
})
const port = process.env.PORT || 8080;
app.listen(port,()=>{

    console.log(`runnin at ${port}`)
})
