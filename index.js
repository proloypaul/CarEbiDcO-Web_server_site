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
        // GET method to find all data from database 
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
        })

        // GET method to find one data from database using id
        app.get('/products/:id', async (req, res) => {
            const productId = req.params.id
            // console.log("product id", productId)
            const query = {_id: ObjectId(productId)}
            const result = await productsCollection.findOne(query)
            res.json(result)    
        });

        // POST method to user data insert in database
        app.post('/users', async (req, res) => {
            const userData = req.body 
            // console.log("user data", userData)
            const result = await usersCollection.insertOne(userData)
            res.json(result)
        })

    }finally{
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send("carbidco server runing")
});
app.listen(port, () => {
    console.log("carbidco server port", port)
});