const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const ejs = require('ejs');
const mysql = require('mysql');

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
	filename: function(req, file, callback) {
		console.log(file)
		callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    },
    limits:{fileSize: 1000000},
    
})

const upload = multer({storage: storage}).array('image',5);

app.get('/', (req,res)=>{
    res.render('index',{msg: "",data: ''});

})

app.post('/upload',(req, res)=>{
    let msg = "";
    upload(req,res,err=>{
        if(err){
            msg = "Only 5 files at once";
            //res.render('index',{msg:msg})
       
        }else{
            //let msg =""
            console.log("hello");
            msg="file uploaded sucessfully";
            console.log(req.files);
            let locat =`${req.files[0].path}`;
            for(let i =0; i < req.files.length;i++){
            console.log(`${req.files[i].path}`)
            //res.render('index',{msg:msg})
       
        }
      
        }
        res.render('index',{msg: msg, data: req.files[0].path});;
    })
    
})
const port = process.env.PORT || 8080;
app.listen(port,()=>{

    console.log(`runnin at ${port}`)
})
