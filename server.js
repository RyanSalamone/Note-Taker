const express = require("express");
const apiRoutes = require("./Routes/apiRoutes");
const htmlRoutes = require("./Routes/htmlRoutes");

//init and create a port
const app = express();
const PORT = process.env.PORT || 3000;

//parse and route
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api", apiRoutes);
app.use("/", htmlRoutes);


// start server
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));