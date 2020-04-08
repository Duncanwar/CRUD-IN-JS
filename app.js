const http=require("http");
let express=require("express");
let app=express();
let bodyParser=require('body-parser');
let msyql=require("mysql");


let connection=msyql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:"JSLibrary"

});


connection.connect(function(error){
    if (error) {
        console.log(error);
    }
    else{
        console.log("connected");
    }
}
);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());// to support json file
app.use(express.static(__dirname + '/public'));

app.set("view engine","ejs");

app.get("/",function(req,res){
res.send("HomePage");
});

//get the data in database
app.get("/index",function(req,res){
    connection.query('select * from trycrud',(error,rows)=>{
        if(!error)
        res.end(JSON.stringify(rows));
        else
        console.log(error);

    })
});

//rest api to get a single client 
app.get("/index/:id",(req,res)=>{
connection.query("select * from trycrud where id=?",[req.params.id],(results,error)=>{
    if(!error) 
    res.end(JSON.stringify(results));
    else
    res.send(error);
})
})

app.get("/SignUp",function(req,res){
    res.render("SignUP");
})

// insert new records using restful api
app.post("/index",function(req,res){
   
     const data={
        id:req.body.id,
        firstName:req.body.firstName
   }
 
   
    connection.query('insert into trycrud SET ?',data,function(error,results){
        if(error)
        console.log(error);
        else
        res.end(JSON.stringify(results));
    });

res.redirect("index");

});
// rest api for delete
app.delete("/index",function(req,res){
    connection.query('delete from trycrud where id =?',[req.body.id],(error,results)=>{
        if(error)
        res.send(error)
res.end('Record deleted');
    })
})

// rest api for update

app.put("/index",function(req,res){
    connection.query('update trycrud set firstName  = ? where id=?',[req.body.firstName,req.body.id],(error,results)=>{
        if(error)
        res.send(error);
        else
        res.end(JSON.stringify(results))
    });
});


// Port Listening

let server=app.listen(3001,"127.0.0.1",function(){
    let host=server.address().address
    let port=server.address().port
    console.log("server up",host,port);
});
