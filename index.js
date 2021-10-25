require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const user = require("./routes/user");
const store = require("./routes/store");
const cart = require("./routes/cart");
const order = require("./routes/order");
const adminOrder = require("./routes/adminOrder");
const adminProduct = require("./routes/adminProduct");
const path = require("path");
let me='Piyush'
const StartMongo = require("./config/db");
StartMongo();
const PORT = process.env.PORT || 5000;
app.use(cors({ credentials: true, origin: "*" }));
app.use(bodyParser.json());

const http = require('http')
const socketIo= require('socket.io')






let interval
// socket io implementation
const server = http.createServer(app)
const io = socketIo(server)
io.on("connection", (socket) => {
  console.log("New client connected");
  console.log('Total clients - ' , io.engine.clientsCount)
  if (interval) {
    clearInterval(interval);
  }
  //  interval = setInterval(() => getApiAndEmit(socket), 5000);
        socket.on('getMessages', (body) =>{ 
          console.log('New Order Recieved' , body)
          socket.broadcast.emit('FromAPI' , body)
                
        });


  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});






/* BACKEND API ENDPOINTS */

app.use("/user", user);

app.use("/store", store);

app.use("/cart", cart);

app.use("/order", order);

app.use("/adminorder", adminOrder);

app.use("/adminproduct", adminProduct);

// /* FOR SERVING THE REACT APP: */
// app.use(express.static(path.join(__dirname, "frontend/build")));
// app.get("*", (request, res) => {
//   res.sendFile(path.join(__dirname + "/frontend/build/index.html"));
// });

server.listen(PORT, () => {
  console.log(`Server started at PORT ${PORT}`);
});
