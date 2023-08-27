//a social media backend in mongoose
//Debashish Buragohain

const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const { v1: uuidv1 } = require("uuid"); //using timestamp to generate the uuid


dotenv.config();
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected.'))
  .catch(err => console.error('Error in connecting to MongoDB:', err))


//allowing same origin resource sharing
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', false); //no cookies needed
  next(); //pass to the next layer of middleware
});

//middleware required for the google authentication procedure
app.use(session({
  secret: uuidv1(),
  resave: false,
  saveUninitialized: false
}))

//middleware
app.use(express.json());
//same origin resource sharing
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(morgan("common"));

//creating a google based authentication route
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.use(express.static(__dirname + "/public"));

app.use('/', (req, res) => {
  res.status(404).json("There is probably an error in your URL");
})

//this is basically the ipv4 address
app.listen(8800, () => {
  console.log("Backend server is running at http://localhost:8800");
});