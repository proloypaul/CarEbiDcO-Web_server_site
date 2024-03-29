const { MongoClient } = require('mongodb');
const express = require('express')
var cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const app = express()
const port = process.env.PORT || 3800

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e3dsx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri)
async function run(){
    try{
        await client.connect()
        const database = client.db('carbidcoWeb')
        const productsCollection = database.collection('products')
        const usersCollection = database.collection('users')
        const ordersCollection = database.collection('orders')
        const reviewsCollection = database.collection('reviews')
        // GET method to find all data from database 
        app.get('/products', async (req, res) => {
            const size = parseInt(req.query.size)
            // console.log(size)
            const cursor = productsCollection.find({})
            let products;
            if(size){
                products = await cursor.limit(size).toArray()
            }else{
                products = await cursor.toArray()
            }
            res.json(products)
        })

        // GET method to find one data from database using id
        app.get('/products/:id', async (req, res) => {
            const productId = req.params.id
            // console.log("product id", productId)
            const query = {_id: ObjectId(productId)}
            const result = await productsCollection.findOne(query)
            res.json(result)    
        });

        app.delete('/products/:id', async (req, res) => {
            const productDltId = req.params.id 
            // console.log("product delete id", productDltId)
            const query = {_id: ObjectId(productDltId)}
            const result = await productsCollection.deleteOne(query)
            res.json(result)
        })

        app.post('/products', async (req, res) => {
            const productData = req.body 
            // console.log(productData)
            const result = await productsCollection.insertOne(productData)
            res.json(result)
            console.log(result)
        })

        // POST method to user data insert in database
        app.post('/users', async (req, res) => {
            const userData = req.body 
            // console.log("user data", userData)
            const result = await usersCollection.insertOne(userData)
            res.json(result)
        });
        // PUT method to update user when signIn with google

        app.put('/users', async (req, res) => {
            const user = req.body 
            const filter = {email: user.email}
            const options = {upsert: true} 
            const updateDoc = {$set: user}
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })
        // put method to update user with admin
        app.put('/users/admin', async (req, res) => {
            const admin = req.body
            console.log(admin.email)
            // console.log("admin data", admin)
            const filter = {email: admin.email} 
            const updateDoc = {$set: {role: "admin"}}
            const result = await usersCollection.updateOne(filter, updateDoc)
            // console.log("update user result", result)
            res.json(result)
        })

        // POST method to insert user order in database
        app.post('/orders', async (req, res) => {
            const userOrder = req.body
            // console.log(userOrder)
            const result = await ordersCollection.insertOne(userOrder)
            res.json(result)
        });

        // GET method to find orders all data from database
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
        })

        // GET method to load only user order
        app.get('/orders/:email', async (req, res) => {
            const userEmail = req.params.email 
            // console.log(userEmail)
            const query = {email: userEmail}
            const cursor = ordersCollection.find(query)
            const result = await cursor.toArray()

            // console.log("find user order result", result)
            res.json(result)
        })

        // DELETE method to delete order
        app.delete('/orders/:id', async (req, res) => {
            const dltId = req.params.id 
            const query = {_id: ObjectId(dltId)}
            // console.log("delete user id", dltId)
            const result = await ordersCollection.deleteOne(query)
            res.json(result)
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email
            // console.log("user email", email)
            const query = {email: email}
            const result = await usersCollection.findOne(query)
            let isAdmin = false 
            if(result?.role === "admin"){
                isAdmin = true 
            }
            res.json({admin: isAdmin})
        })

        // post review data 
        app.post('/reviews', async (req, res) => {
            const reviewsData = req.body
            const result = await reviewsCollection.insertOne(reviewsData)
            res.json(result)
        })

        // get review data
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
        })

        // user payment seystem get user data using id
        app.get('/orders/:id', async (req, res) => {
            const userId = req.params.id 
            console.log("user id", userId)
            // const query = {_id: ObjectId(userId)}
            // const result = await ordersCollection.findOne(query)
            // res.json(result)

        })



    }finally{
        // await client.close()
    }
}
// common code  
run().catch(console.dir) // declare run function 

app.get('/', (req, res) => {
    res.send("carbidco server runing")
});
app.listen(port, () => {
    console.log("carbidco server port", port)
});