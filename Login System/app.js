if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
//  requirements =>> packages

const express = require("express");
const session = require('express-session');
const flash =require('connect-flash');
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const passport = require('passport');
const LocalStrategy = require("passport-local");
const User = require('./models/user');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

const mongoSanitize = require('express-mongo-sanitize');

// Error handler 

const ExpressError = require('./utils/expressError');

// MongoDB database connection and creation 

const dbUrl = process.env.DB_URL || "";

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});


// runnig the web app 

const app = express();


// Requireing Routes

const timesheetRoutes = require("./routes/timeSheetRoutes");
const userRoutes = require("./routes/usersRoutes");
const todoRoutes = require('./routes/todoRoutes');
const projectRoutes = require('./routes/projectsRoutes');
const clientsRoutes = require('./routes/clientsRoutes');


// middlewares to use the packages 

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize({replaceWith:'_'}));

// session configeration

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret
  }
});

store.on('error', function(e) {
  console.log('session store error' , e)
})

const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      // secure: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 ,
      maxAge: 1000 * 60 * 60 * 24 
  }
};
app.use(session(sessionConfig));
app.use(flash());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// local variables to use it in the front-end

app.use((req, res, next) => {
  // console.log(req.session.client)
  res.locals.userClient = req.session.client;
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});



// routes 

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.use('/' , userRoutes);
app.use('/timesheets' , timesheetRoutes);
app.use('/todo' , todoRoutes);
app.use('/projects' , projectRoutes);
app.use('/clients' , clientsRoutes);

//  route for error handler

app.all('*' ,(req,res,next)=> {
  next(new ExpressError('page not found' ,404));
});

app.use((err , req, res ,next) =>{
    const {statusCode = 500 , message = 'error !!!' } = err ; 
    res.status(statusCode).render('error' ,{ err });
});

// port listener 

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});;