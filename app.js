
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
const methodOverride = require("method-override");
const ejsMate=require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const listingRouter=require('./routes/listing.js');
const reviewRouter=require('./routes/review.js');
const user=require('./routes/user.js');
const session = require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js');
const userRouter=require('./routes/user.js');
const bookingRouter = require('./routes/booking.js');
const MongoStore = require('connect-mongo').default;

const app=express();
const port = process.env.PORT || 8080;
const dbUrl=process.env.ATLASDB_URL;


main()
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log(err));

// View engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

async function main() {
  await mongoose.connect(dbUrl);
}
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SESSION_SECRET,
    },
    touchAfter: 24 * 3600,
});
store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
});
const sessionOptions = {
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
   cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 👈 this line
},
};
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.set('trust proxy', 1);
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// app.use((req, res, next) => {
//     console.log("Authenticated:", req.isAuthenticated());
//     console.log("User:", req.user);
//     console.log("Session:", req.sessionID);
//     next();
// });



app.use((req, res, next) => {
    console.log("Authenticated:", req.isAuthenticated());
    console.log("User:", req.user);
    console.log("Session ID:", req.sessionID);
    console.log("Passport:", req.session.passport);
    next();
});

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    res.locals.currPath = req.path;
    next();
});

app.get("/", (req, res) => {
    res.redirect("/listings");
});

// Routes
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);
app.use('/listings/:id/bookings', bookingRouter);

// 404 handler (ALWAYS LAST)
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

//error handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Internal Server Error" } = err;

    let title = statusCode === 404 
        ? "Page Not Found" 
        : "Something Went Wrong";

    res.status(statusCode).render('error.ejs', {
        message,
        statusCode,
        title
    });
});
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});