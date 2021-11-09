const express = require('express')
const app = express()
const port = process.env.PORT || 3800

app.get('/', (req, res) => {
    res.send("carbidco server runing")
});

app.listen(port, () => {
    console.log("carbidco server port", port)
});