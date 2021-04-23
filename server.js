const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const path = require('path')
require('dotenv').config({ path: path.join(__dirname+"/config/", '.env') })
const {env,dev,production}  = require('./config/keys.js');


const app = express();


require("./models/user.js");
require("./models/friends.js");
require("./models/challenge.js");
require("./models/rewards.js");

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: ["somesecretsauce"]
  })
);

// MongoDB configuration
let db;
if(env=="dev"){
    db = dev.mongoURL;
    mongoose.set("debug",true)
  }
else 
    db = production.mongoURL;


// Use mongoose to connect to mongoDB
mongoose
  .connect(db,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully!"))
  .catch(err => console.log(err));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport config
require("./config/passport");


require("./routes/api/auth.js")(app);
require("./routes/api/friends.js")(app);
require("./routes/api/users.js")(app);
require("./routes/api/rewards.js")(app);
require("./routes/api/challenge.js")(app);

// Server static assets if in production
if (env === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}else{

}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`App running on port ${port}`));
