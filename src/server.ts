import app from '@app'
import environment from '@config/environment'

const { port } = environment

;(async () => {
	try {
		app.listen(+port || 3001, () =>
			console.log(`Express App Listening on Port ${+port || 3001}`)
		)
	} catch (error) {
		console.error(`An error occurred: ${error}`)
		process.exit(1)
	}
})()
