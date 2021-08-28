const express = require('express')
const path = require("path")

const app = express()
const port = 3000;

app.use(express.static(path.join(__dirname,'./static' )))

app.get('/', (request,response)=>{
    response.sendFile(path.join(__dirname,'./static/index.html'))
})
app.get('/play', (request,response)=>{
    response.sendFile(path.join(__dirname,'./static/play.html'))
})
app.listen(port,()=>{
    console.log(`Listening to localhost:${port}`)
})