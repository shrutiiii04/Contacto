if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}
const express = require("express");
const mongoose = require("mongoose");
const Contact = require("./models/contacts");
const User = require("./models/user");
const path = require("path");
const methodOverride = require("method-override");
const wrapAsync = require("./utilis/wrapAsync");
const ExpressError = require("./utilis/ExpressError");
const { validateContact } = require("./middleware");
const session = require("express-session");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const contactRoute = require("./routes/contacts");
const userRoute = require("./routes/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require('connect-mongo');

const app = express();
const port = 8094;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);

const url = process.env.ATLAS_URL;
main().then((result)=>{console.log("mongoDb connected!!!")})
      .catch(err => console.log(err));

async function main() {
  await mongoose.connect(url);
}
const store = MongoStore.create({
  mongoUrl:process.env.ATLASDB_URL,
  crypto:{
      secret: process.env.SECRET,
  },
  touchAfter: 24*3600,
})

store.on('error', (error) => {
  console.log("Error in MongoDB session store:", error);
});

const sessionOption={
  store,
  secret:  process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
}
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash messages
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/api/contacts",contactRoute);
app.use("/", userRoute);

  app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
  });
  
  // Error handling middleware
  app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).send(message);
  });
  
  // Start server
  app.listen(port, () => {
    console.log(`Server connected on port ${port}`);
  });
