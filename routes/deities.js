const express = require("express")
const router = express.Router()

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

router.get("/", async (req, res) => {
	// const allowedParams = [ "domain", "name", "region" ]
	const queryParams = req.query
	const hasParams = !!Object.keys(queryParams).length

	try {
		let results
		if (hasParams) {
			const domain = queryParams.domain.toLowerCase()
			results = await prisma.$queryRaw(`SELECT * FROM deities WHERE '${domain}' = ANY(domain)`)
		} else {
			results = await prisma.deities.findMany()
		}

		if (!results.length) {
			return res.status(204).json()
		} 
		
		res.status(200).json(results)

	} catch(err) {
		res.status(404).json(err)

	} finally {
		prisma.$disconnect()
	}
})

router.get("/:id", async (req, res) => {
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

module.exports = router