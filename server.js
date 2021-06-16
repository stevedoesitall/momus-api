const express = require("express")
const app = express()
const cors = require('cors')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

const port = process.env.PORT || 8081

const deitiesRoute = require("./routes/deities")

app.use("/deities", deitiesRoute)

app.get("*", (req, res) => {
    res.send({
        message: "Bad request",
        status: 404
    })
})

app.listen(port, err => {
	if (err) {
		console.log("Error starting server")
	} else {
		console.log(`Server running on port ${port}`)
	}
})