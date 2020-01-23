  
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");

// Serve static content for the app from the "public" directory in the application directory.
// the public folder becomes a route path that defaults to the localhost:3000

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);


app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});