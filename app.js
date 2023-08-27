require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const fetch = require('node-fetch');
const app = express();
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const childProcess = require("child_process");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/callback",
            userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
        },
        function (accessToken, refreshToken, profile, cb) {
            console.log(profile);
            return cb()
        }
    )
);

app.use(
    session({
        secret: "Our little secret",
        resave: false,
        saveUninitialized: false,
    })
);

app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
);

app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/home" }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect("/home");
    }
);

app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//authentication login page
app.get("/login", async (req, res) => {
    res.render("login")
})

//the home page will contain the post page
app.get('/home', async (req, res) => {
    try {
        const postList = await fetch('http://localhost:8800/api/posts')
            .then(res => res.json())

        console.log(postList)
        res.render("index", { posts: postList });
    }
    catch (err) {
        res.status(500).json(err.message)
    }
});
app.get('/search', (req, res) => {
    res.render("search");
});

app.get('/messages', (req, res) => {
    res.render("messages");
});
app.get('/notifications', (req, res) => {
    res.render("notifications");
});
app.get('/sell', (req, res) => {
    res.render("sell");
});
app.get('/profile', (req, res) => {
    res.render("profile");
});
app.get("/join", (req, res) => {
    res.render("openingpage")
})
app.get("/confirmation", (req, res) => {
    res.render("confirmation");
})
app.get("/signup", (req, res) => {
    res.render("register");
})
app.get("/", (req, res) => {
    res.render("welcome");
})

app.use((req, res) => {
    res.status(404).send("You probably entered a wrong URL: LinkMarket")
})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})

//run the api server here
runScript("./social-rest/index.js");

function runScript(scriptPath = "", callback) {
    //keep track of whether the callback has been invoked to prevent multiple innvocations
    let invoked = false;
    let process = childProcess.fork(scriptPath);
    //listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    })
    //execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        let err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    })
}