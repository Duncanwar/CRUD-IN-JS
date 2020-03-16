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
app.use(express.static(__dirname + '/public'));

app.set("view engine","ejs");

app.get("/",function(req,res){
res.send("HomePage");
});

//app.get("/Login",function(req,res){
   
//res.render("Login");
//});

app.get("/SignUp",function(req,res){
    res.render("SignUP");
})


app.post("/home",function(req,res){
   
     const data={
        id:req.body.id,
        firstName:req.body.firstName,
      /* lastName:req.body.lastName,
       email:req.body.email,
        password:req.body.password
     */}
 
   
    connection.query('insert into trycrud SET ?',data,function(error){
        if(error)
        console.log(error);
        else
        console.log("data saved")
    });

res.redirect("index");

});

app.post("/delete/:id",function(req,res){
    connection.query('delete from trycrud where id =?',[req.params.id],(error,results)=>{
res.redirect("/index");
    })
})

app.get("/edit/:id",function(req,res){
    connection.query('select *  from trycrud where id=?',[req.params.id],(error,results)=>{
        res.render('new');
    });
});

app.post("/update/:id",function(req,res){
    connection.query('update trycrud set firstName = ? where id=?',[req.body.itemName,req.params.id],(error,results)=>{
        res.redirect("/index");
    })
})

//get the data in database
app.get("/index",function(req,res){
    connection.query('select * from trycrud',(error,rows)=>{
        if(!error)
        res.render("index",{items:rows});
        else
        console.log(error);

    })
});

app.listen(3000,function(){
    console.log("server up");
});