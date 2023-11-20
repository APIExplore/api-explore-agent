const express = require('express');
const router = express.Router();

const { exec, execSync, spawn } = require('child_process');

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
	const splitted_command = command.split(' ');

	const child = spawn(splitted_command[0], splitted_command.slice(1));

	child.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
	});

	res.send('API Started Successfully!!!');

	child.stderr.on('data', (data) => {
		console.log(`stderr: ${data}`);
	});

	child.on('error', (error) => console.log(`error: ${error.message}`));

	child.on('exit', (code, signal) => {
		if (code) console.log(`Process exit with code: ${code}`);
		if (signal) console.log(`Process killed with signal: ${signal}`);
		console.log(`Done ✅`);
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

		res.send('API stopped successfully');
	});
});

router.get('/restart-api/:id', (req, res) => {
	const apiId = parseInt(req.params.id, 10);
	const sutApi = apiInfo.apiList.find((api) => api.id === apiId);

	if (!sutApi) {
		return res.status(404).send('API not found');
	}

	const jarFilePath = path.join(__dirname, '../compiled', sutApi.jarFileName);
	const command = sutApi.restartCommand.replace(
		new RegExp('{{FILE_PATH}}', 'g'),
		jarFilePath
	);

	const child = spawn(command, { shell: true });

	child.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
	});

	res.send('API Restarted Successfully!!!');

	child.stderr.on('data', (data) => {
		console.log(`stderr: ${data}`);
	});

	child.on('error', (error) => console.log(`error: ${error.message}`));

	child.on('exit', (code, signal) => {
		if (code) console.log(`Process exit with code: ${code}`);
		if (signal) console.log(`Process killed with signal: ${signal}`);
		console.log(`Done ✅`);
	});
});

module.exports = router;
