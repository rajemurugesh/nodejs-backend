import express, { application } from "express"
import cors from "cors"
import bodyParser from "body-parser"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

const db = 'mongodb+srv://Rajeswari:raje1992@cluster1.wm1nl.mongodb.net/loginregister'

mongoose.connect(db , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("DB CONNECTED");
}).catch(()=>{
    console.log("UNABLE TO CONNECT DB");
})

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: Number,
    password: String
})

const User = new mongoose.model("User", userSchema)

const ClientInfoSchema = mongoose.Schema({
    name: String,
    email: String,
    notes: String
})
const ClientInfo=new mongoose.model('Clientinfo', ClientInfoSchema)



//Routes
app.get("/", (req, res) => {
    res.send("My API")
})

app.post("/login", (req, res) => {
    const {email, password} = req.body
    User.findOne({email: email}, (err, user) => {
        if(user) {
            if(password===user.password) {
                res.send({message: "Login successfully",user: user})
            } else {
                res.send({message: "password didnot match"})
            }

        } else {
            res.send({message: "User not registered"})
        }
    })
})

app.post("/signup", (req, res) => {
    const { name, email, phoneNumber, password} = req.body
    User.findOne({email: email}, (err, user) => {
        if(user){
            res.send({message: "User already registered"})
        } else {
            const user = new User({
                name,
                email,
                phoneNumber,
                password
            })
            user.save( err => {
                if(err) {
                    res.send(err)
                } else {
                    res.send({message: "Successfully Registered , Please login now"})
                }
            })
        }
    })
    
})

//Get client Info
app.get('/clientInfo', (req,res) => {
    ClientInfo.find().then(ClientInfo => {
        res.send(ClientInfo)
    })
})

//Save Client Info
app.post('clientInfo', (req,res) => {
    const ClientInfo = new ClientInfo({
        name: req.body.name,
        email: req.body.email,
        notes: req.body.notes
    })
    ClientInfo.save().then(ClientInfo=>{
        console.log(ClientInfo)
        res.json(ClientInfo)
    })
})

app.listen(8080,()=>{
    console.log("App is running at 8080")
})