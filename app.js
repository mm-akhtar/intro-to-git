var bodyParser	     = require("body-parser"),
	methodOverride   = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	mongoose         = require("mongoose"),
	express          = require("express"),
	app              = express();

//APP CONFIG
// Mongose Connection
mongoose.connect("mongodb+srv://mmAkhtar:Akhtar@9577@cluster0.mcsba.mongodb.net/<dbname>?retryWrites=true&w=majority",{
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false});



app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
//MONGOOSE/MODEL CONFIG

var blogSchema = new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	Created: {type:Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title: "Test Blog",
// 	image: "https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&h=350",
// 	body:"HELLO THIS IS A BLOG POST"
// });

// ROUTS
app.get("/", function(req, res){
	res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("ERROR!!");
		} else {
			res.render("index",{blogs:blogs});
		}
	});
	
});

// NEW ROUTR
app.get("/blogs/new", function(req, res){
	res.render("new");
});

// CREATE ROUTE
app.post("/blogs",function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body)
	//create blog
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		} else {
			//redirect to index
			res.redirect("/blogs");
		}
	})
	
});

// SHOW Route

app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs")
		} else{
			res.render("show", {blog:foundBlog});
		}
	});
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("edit",{blog:foundBlog});
		}
	})
});

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body)
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			console.log("hello");
		} else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
	//destroy
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
			
	});
});

var port = process.env.PORT || 94;
//Listen
app.listen(port,function(){
	console.log("Blog app Server Started")
});
              