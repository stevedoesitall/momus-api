const express = require("express")
const app = express()
const cors = require('cors')

// Needed for POST/PUT requests; not currently functional
// express.urlencoded parses URL encoded data from req.body
// express.json parses JSON encoded data from req.body
app.use(express.urlencoded({ extended: false })) 
app.use(express.json())

app.use(cors())

const port = process.env.PORT || 8081

const deitiesRoute = require("./routes/deities")

app.use("/deities", deitiesRoute)

app.get("*", (req, res) => {
    res.status(404).json({
		err: "Bad Request"
	})
})

app.listen(port, err => {
	if (err) {
		console.log("Error starting server")
	} else {
		console.log(`Server running on port ${port}`)
	}
})