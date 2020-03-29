const request = require('supertest')
const app = require('../../src/app')
const connection = require('../../src/database/connection')

describe('ONG', () => {
	beforeEach(async () => {
		await connection.migrate.rollback()
		await connection.migrate.latest()
	})

	afterAll(async () => {
		await connection.destroy()
	})

	it('should be able to create a new NGO', async () => {
		const response = await request(app)
			.post('/ongs')
			.send({
				name: "APAD",
				email: "contatoapad@ong.com",
				whatsapp: "4236352430",
				city: "Laranjeiras do Sul",
				uf: "PR"
			})

		expect(response.body).toHaveProperty('id')
		expect(response.body.id).toHaveLength(8)
	})

	it('should be able to get a list of NGOs', async () => {
		const response = await request(app)
			.get('/ongs')

		expect(response.body).toEqual(expect.any(Array))
	})

	it('should create a new bad connection', async () => {
		const response = await request(app)
			.post('/sessions')
			.send({
				id: "sdfs!fsf"
			})

		expect(response.body).toHaveProperty('error')
		expect(response.body.error).toEqual(expect.stringContaining('No ONG found with this id'))
	})

	it('should create a new good connection', async () => {
		const preResponse = await request(app)
			.post('/ongs')
			.send({
				name: "APAD",
				email: "contatoapad@ong.com",
				whatsapp: "4236352430",
				city: "Laranjeiras do Sul",
				uf: "PR"
			})

		const response = await request(app)
			.post('/sessions')
			.send({
				id: preResponse.body.id
			})

		expect(response.body).toHaveProperty('name')
		expect(response.body.name).toEqual(expect.stringContaining("APAD"))
	})

	it('should be able to get a profile', async () => {
		const preResponse = await request(app)
			.post('/ongs')
			.send({
				name: "APAD",
				email: "contatoapad@ong.com",
				whatsapp: "4236352430",
				city: "Laranjeiras do Sul",
				uf: "PR"
			})

		const response = await request(app)
			.get('/profile')
			.set('authorization', preResponse.body.id)

		expect(response.body).toEqual(expect.any(Array))
	})

	it('should create a ngo to the test - no expect', async () => {
		const response = await request(app)
			.post('/ongs')
			.send({
				name: "APAD",
				email: "contatoapad@ong.com",
				whatsapp: "4236352430",
				city: "Laranjeiras do Sul",
				uf: "PR"
			})
	})

	it('should be able to create a new incident', async () => {
		const preResponse = await request(app)
			.post('/ongs')
			.send({
				name: "APAD",
				email: "contatoapad@ong.com",
				whatsapp: "4236352430",
				city: "Laranjeiras do Sul",
				uf: "PR"
			})

		const response = await request(app)
			.post('/incidents')
			.set('Authorization', preResponse.body.id)
			.send({
				title: "Roupas para Crianças Carentes",
				description: "Estamos realizando uma campanha para distribuir roupas para crianças carentes em uma comunidade de São Paulo.",
				value: 1000
			})

		expect(response.body).toHaveProperty('id')
	})

	it('should be able to get a list of incidents', async () => {
		const response = await request(app)
			.get('/incidents')

		expect(response.body).toEqual(expect.any(Array))
	})

	it('should be able to delete a new incident', async () => {
		const preResponseNGO = await request(app)
			.post('/ongs')
			.send({
				name: "APAD",
				email: "contatoapad@ong.com",
				whatsapp: "4236352430",
				city: "Laranjeiras do Sul",
				uf: "PR"
			})

		const preResponseIncident = await request(app)
			.post('/incidents')
			.set('Authorization', preResponseNGO.body.id)
			.send({
				title: "Roupas para Crianças Carentes",
				description: "Estamos realizando uma campanha para distribuir roupas para crianças carentes em uma comunidade de São Paulo.",
				value: 1000
			})

		response = await request(app)
			.delete(`/incidents/${preResponseIncident.body.id}`)
			.set('Authorization', preResponseNGO.body.id)

		expect(response.body).not.toHaveProperty('error')
	})
})