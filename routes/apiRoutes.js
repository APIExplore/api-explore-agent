const express = require('express');
const router = express.Router();

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');


const apiInfo = require('../API-info.json');

router.get('/start-api/:id', (req, res) => {
	const apiId = parseInt(req.params.id, 10);
	const sutApi = apiInfo.apiList.find((api) => api.id === apiId);

	if (!sutApi) {
		return res.status(404).send('API not found');
	}

	const jarFilePath = path.join(__dirname, '../compiled', sutApi.jarFileName);
	const command = sutApi.startCommand.replace('{{FILE_PATH}}', jarFilePath);

	if (!fs.existsSync(jarFilePath)) {
		console.error(`Error: JAR file not found at ${jarFilePath}`);
		return res.status(404).send('JAR file not found');
	}

	exec(command, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error executing command: ${error.message}`);
			return res.status(500).send('Internal Server Error');
		}

		console.log(`Command output: ${stdout}`);
		console.error(`Command error: ${stderr}`);

		res.send('API started successfully');
	});
});

router.get('/stop-api/:id', (req, res) => {
	const apiId = parseInt(req.params.id, 10);
	const sutApi = apiInfo.apiList.find((api) => api.id === apiId);

	if (!sutApi) {
		return res.status(404).send('API not found');
	}

    const jarFilePath = path.join(__dirname, '../compiled', sutApi.jarFileName);
	const command = sutApi.stopCommand.replace('{{FILE_PATH}}', jarFilePath);

	exec(command, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error executing command: ${error.message}`);
			return res.status(500).send('Internal Server Error');
		}

		console.log(`Command output: ${stdout}`);
		console.error(`Command error: ${stderr}`);

		res.send('API stopped successfully');
	});
});

module.exports = router;