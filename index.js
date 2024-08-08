const express = require('express');//co ban
const path=require("path");
const methodOverride=require("method-override");
const bodyParser=require("body-parser");
const flash=require("express-flash");
const cookieParser=require("cookie-parser");
const session=require("express-session");

const moment=require("moment");

require("dotenv").config();//tao file env


const database=require("./config/database");
const systemConfig=require("./config/system")

const route=require("./routes/client/index.route");
const routeAdmin=require("./routes/admin/index.route");

database.connect();

const app = express();
const port = process.env.Port;
app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({extended:false}));

app.set("views",`${__dirname}/views`); //cau hinh file view voi engine la pug
app.set("view engine","pug"); 

//flash
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());



app.use('/tinymce',express.static(path.join(__dirname,'node_modules',"tinymce")));



app.locals.prefixAdmin= systemConfig.prefixAdmin;
app.locals.moment= moment;


console.log(__dirname);
app.use(express.static(`${__dirname}/public`));//su dung file public phia client


routeAdmin(app);
route(app);


app.listen(port);