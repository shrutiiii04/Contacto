const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utilis/wrapAsync");
const ExpressError = require("../utilis/ExpressError");
const { validateContact } = require("../middleware");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
 });

router.post("/signup", wrapAsync(async(req,res,next)=>{
    try{
        let {username,password} = req.body;
        let newUser = new User({username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser,(error)=>{
           if(error){return next(error);}
           req.flash("success","Welcome to Contacto");
           res.redirect("/api/contacts/allcontacts");
        })
        
     }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
     }
 }));

 router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
 });

router.post('/login',saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login", failureFlash:true}),
 wrapAsync(async (req, res) => {
    req.flash("success","Welcome back to Contacto!");
    let redirectUrl = res.locals.redirectUrl || "/api/contacts/allcontacts";
    res.redirect(redirectUrl);
}));
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
       if(err){
          return next(err);
       }
       req.flash("success","You have logged out!");
       res.redirect("/login");
    })})
 module.exports= router;