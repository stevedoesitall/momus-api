import express from "express"
import cors from "cors"

import { deitiesRoute } from "./routes/deities.js"

const app = express()

// Needed for POST/PUT requests; not currently functional
app.use(express.urlencoded({ extended: false })) 
app.use(express.json())

app.use(cors())

const port = process.env.PORT || 8081

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