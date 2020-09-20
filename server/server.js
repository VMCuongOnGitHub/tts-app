const express = require("express")
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const routes = require("./routes/routes.js")


const app = express();
// const corsList = {
//     origin: "http://localhost:8081" //url được phép call API
// };
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.use("/",routes)
dotenv.config()

app.listen(process.env.PORT,() =>{
    console.log("Server Is Running on port: " + process.env.PORT);
})
