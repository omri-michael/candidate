const express = require('express')
const filesRouter = require('./api/routers/filesRouter')
const app = express();
const port = 3000

app.use(express.json())
app.use('/', filesRouter)

app.listen(port, () => {
    console.log(`Files app listening on port ${port}`)
})

