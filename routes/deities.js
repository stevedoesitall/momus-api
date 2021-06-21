import express from "express"
import pkg from "@prisma/client"

const { PrismaClient } = pkg
const router = express.Router()
const prisma = new PrismaClient()

router.get("/", async (req, res) => {
	const queryParams = req.query
	let allDomains = []

	if (queryParams.api_key !== process.env.API_KEY) {
		return res.status(401).json({
			"error": "Invalid credentials."
		})
	}

	delete queryParams.api_key
	// const allowedParams = [ "domain", "name", "region" ]
	
	const hasParams = !!Object.keys(queryParams).length

	try {
		let results
		if (hasParams) {
			const domain = queryParams.domain.toLowerCase()
			results = await prisma.$queryRaw(`SELECT * FROM deities WHERE '${domain}' = ANY(domain)`)

		} else {
			results = await prisma.deities.findMany()
			results.forEach(deity => {
				allDomains = [...allDomains, ...deity.domain]
			})

			allDomains = [...new Set(allDomains)]
		}

		if (!results.length) {
			return res.status(204).json()
		} 
		
		res.status(200).json(
			allDomains.length ?
			{ domains: allDomains, results } :
			results
		)

	} catch(err) {
		res.status(404).json(err)

	} finally {
		prisma.$disconnect()
	}
})

router.get("/:id", async (req, res) => {
	const queryParams = req.query

	if (queryParams.api_key !== process.env.API_KEY) {
		return res.status(401).json({
			"error": "Invalid credentials."
		})
	}
	
	try {
		let { id } = req.params
		id = parseInt(id)
		
		const results = await prisma.deities.findUnique({
			where: {
				id: id
			}
		})

		if (!results) {
			return res.status(204).json()
		}

		res.status(200).json(results)

	} catch(err) {
		res.status(404).json(err)
		
	} finally {
		prisma.$disconnect()
	}
})

router.post("/", (req, res) => {
	console.log(req)
	res.status(405).json({
		"error": "Not authorized to POST via the /deities endpoint."
	})
})

router.delete("/", (req, res) => {
	console.log(req)
	res.status(405).json({
		"error": "Not authorized to DELETE via the /deities endpoint."
	})
})

export { router as deitiesRoute }