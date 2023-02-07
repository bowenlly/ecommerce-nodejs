// Route handlers
const express = require('express');
const router = express.Router();
const passport = require('passport');
const axios = require('axios');

//import data models
const User = require("./models/user");
const Product = require("./models/product");
const Order = require("./models/order")


router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.shoppingCart = req.session.cart
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

router.get("/", function(req,res){
 Product.find({}, function (err, p_list){
  res.render("index", {products:p_list});
 });
});


router.get('/admin', function(req, res) {
  if ((req.user) && (req.user.admin)) { 
     var catsales = [{
       category_name: ["snacks", "fruit", "meat", "vegetable", "seafood"],
       sales_volumn: [18, 20, 5, 15, 3]
     }]
     User.find().count(function (err, count) {})
      res.render("admin", {regions:catsales, sales:[{sales_revenue: 34.65}], visits:[{total_visits: 842}]});
  } else {
    res.redirect("/login/admin")
  }
});

// router.get('/admin/sales', function(req, res) {
//   if ((req.user) && (req.user.admin)) { 
//    axios.get("https://ecommerce-back-bol54.glitch.me/sales")
//     .then((results) => {
//      var data = results.data;
//       res.render("sales", {products:data});
//       });    
//       } else {
//     res.redirect("/login/admin")
//   }
// });


router.get("/admin/products", function(req, res){
  if ((req.user) && (req.user.admin)) { 
  Product.find({}, function (err, p_list){
   var data = p_list;
    res.render("products", {products:data});
    });   
  } else {
  res.redirect("/login/admin")
  }
});

router.get("/admin/products/:pid", function(req, res){
  if ((req.user) && (req.user.admin)) { 
   Product.find({product_id: req.params.pid}, function (err, p_list){
   var data = p_list;
    res.render("inventory", {products:data});
    });   
  } else {
  res.redirect("/login/admin")
  }
});

router.post("/admin/products/:pid", async function(req, res){
  if ((req.user) && (req.user.admin)) { 
    const update = req.body
    const filter = {product_id: req.params.pid}
    const updatedDocument = await Product.findOneAndUpdate(filter, update, { new: true });
    res.redirect("/admin/products")
  } else {
  res.redirect("/login/admin")
  }
});

router.post("/search", async function(req,res){
  
  var name = null;
  if(req.body.keyword != ''){name= { $regex: req.body.keyword , $options: "i"  };}
  var product_kind = null;
  if( req.body.product_kind!=''){product_kind=req.body.product_kind;}
  var price = null;
  if (req.body.price_range==1){price={$lte:2};}
  if (req.body.price_range==2){price={$lte:5,$gte:2};}
  if (req.body.price_range==3){price={$lte:10,$gte:5};}
  if (req.body.price_range==4){price={$gte:10};}
  var condition={};
  if (name) condition.name = name;
  if (price) condition.price = price;
  if (product_kind) condition.product_kind=product_kind;
  

  await Product.find(condition, function (err, docs){
         
     res.render("index", {products:docs});
   });
 });

router.get("/cart", function(req, res){
  var sessData = req.session;
  if (!sessData.cart) {
    sessData.cart = []
  }
  Product.find({
    'product_id': { $in: sessData.cart}
    }, function(err, docs){
      res.render("cart", {products: docs});
    });
});


router.post("/cart", function(req, res){
  var sessData = req.session;
  if (!sessData.cart) {
    sessData.cart = []
  }
  if (!sessData.cart.includes(req.body.product_id)){
    sessData.cart.push(req.body.product_id)
  }
  res.status(204).send()
});

router.post("/cart/remove", function(req, res){
  var sessData = req.session;
  if (!sessData.cart) {
    sessData.cart = []
  }
  var index = sessData.cart.indexOf(req.body.product_id);
  if (index !== -1) {
    sessData.cart.splice(index, 1);
  }
  res.redirect("/cart")
});

router.post("/cart/checkout", async function(req, res,next){
  var order = JSON.parse(req.body.order);
  var o_list = []
  for (const [key, value] of Object.entries(order)) {
    o_list.push({product_id:key, quantity:value})
  }
  
  let newOrder = new Order({
        username: req.body.username,
        created:req.body.created,
        total:req.body.total,
        order: o_list
        })
  
  await newOrder.save();
  res.redirect("/order");
  
});

router.get("/order", function(req, res){
  res.render("order");
});

// Route to signup page
router.get("/signup", function(req, res){
  res.render("signup");
});

// Route to signup page
router.get("/signup/business", function(req, res){
  res.render("signup2");
});


router.post("/signup", function(req, res, next){
  var username = req.body.username;
  var password = req.body.password;
  var kind = req.body.kind;
  if (!username.length || !password.length){
    req.flash("error", "Username or Password cannot be empty!");
      return res.redirect("/signup");
  }
  User.findOne({username: username }, function(err, user){   
    if (err) {return next(err);}
    if (user) {
      req.flash("error", "User already exists");
      return res.redirect("/signup");
    }
    if (kind === "home"){
      var newUser = new User({
        username: username,
        password: password,  
        kind: req.body.kind,
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        marriage: req.body.marriage,
        income: req.body.income,
      });

    } else if (kind === "business") {
      var newUser = new User({
        username: username,
        password: password,
        kind: req.body.kind,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        business_category: req.body.business_category,
        annual_income: req.body.annual_income,
      });

    }
    newUser.save(next);
  });
  }, passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "signup",
    failureFlash: true
  }));

// router.post("/signup/admin", function(req, res, next){
//   // console.log(req.body)
//   // var username = req.body.username;
//   // var password = req.body.password;
//   var username = "admin";
//   var password = "admin";
//   if (!username.length || !password.length){
//     req.flash("error", "Username or Password cannot be empty!");
//   }  
//   User.findOne({username: username }, function(err, user){   
//     if (err) {return next(err);}
//     if (user) {
//       req.flash("error", "User already exists");
//     }
//     var newUser = new User({
//       username: username,
//       password: password,  
//       kind: "admin",
//       admin: true
//     });
//     newUser.save(next);
//   });
//   });

// profile page
router.get("/users/:username", function(req, res, next) {
  User.findOne({ username: req.params.username }, function(err, user) {
    if (err) { return next(err); }
    if (!user) { return next(404); }
    res.render("profile", {cust: user });   
  });
});

router.post("/users/:username", async function(req, res, next) {
    const update = req.body
    const filter = {username: req.params.username}
    const updatedDocument =await User.findOneAndUpdate(filter, update, { new: true });

    res.redirect("/users/"+req.params.username);
});

router.get("/users/:username/remove", function(req, res, next) {
  User.findOneAndDelete({ username: req.params.username }, function (err, docs) {
    if (err){
        req.flash("error", err)
    }
    else{
        req.flash("info", "Deleted User : " + docs.username);
    }
});
  res.redirect("/signup");
});
// route to login page
router.get("/login", function(req, res){
  res.render("login");
});

router.post("/login", passport.authenticate("login", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}));

// route to admin login page
router.get("/login/admin", function(req, res){
  res.render("login2");
});

router.post("/login/admin", passport.authenticate("admin", {
  successRedirect: "/admin",
  failureRedirect: "/login/admin",
  failureFlash: true
}));

// route to logout page
router.get("/logout", function(req, res){
  req.logout();
  req.session.destroy();
  res.redirect("/login");
});


// authentication middleware
function checkAuthentication(req, res, next){
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("info", "You must be logged in to see this page");
    res.redirect("/login");
  }
};



module.exports = router;