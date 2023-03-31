const express = require('express')
const app = express()
const db = require('../db')

// export our router to be mounted by the parent application
module.exports = router

app.get('/', async (req, res) => {
    const { rows } = await db.query('select * from addresses')
    res.send(rows)
})

app.get('/:id', async (req, res) => {
    const { id } = req.params
    const { rows } = await db.query('select * from addresses where id = $1', [id])
    res.send(rows[0])
})

app.post('/', function (req, res) {
    console.log("body is:", req.body);
    res.send(req.body);
})
