const express = require('express');
const router = express.Router();

const { exec, spawn } = require('child_process');

const path = require('path');

const apiInfo = require('../API-info.json');

router.get('/', (_, res) => {
	const apiList = apiInfo.apiList;
	const result = apiList.map((api) => ({ id: api.id, name: api.name }));
	res.json(result);
});

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
	console.log('Child process id', child.pid);

	child.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);

		if (data.toString().includes('Started Application')) {
			res.send({
				message: 'API Started Successfully!!!',
				PID: `${child.pid}`,
			});
		}
	});

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

router.post('/stop-api', (req, res) => {
	const { id, pid } = req.body;
	const sutApi = apiInfo.apiList.find((api) => api.id === parseInt(id, 10));
	if (!sutApi) {
		return res.status(404).send('API not found');
	}

	const command = sutApi.stopCommand.replace('{{PID}}', parseInt(pid, 10));

	exec(command, (error, stdout, stderr) => {
		if (error) {
			console.error(`Error executing command: ${error.message}`);
			return res.status(500).send('Internal Server Error');
		}

		res.send('API stopped successfully');
	});
});

router.post('/restart-api', (req, res) => {
	const { id, pid } = req.body;
	const sutApi = apiInfo.apiList.find((api) => api.id === parseInt(id, 10));
	if (!sutApi) {
		return res.status(404).send('API not found');
	}

	const jarFilePath = path.join(__dirname, '../compiled', sutApi.jarFileName);
	const command = sutApi.restartCommand
		.replace('{{PID}}', parseInt(pid, 10))
		.replace('{{FILE_PATH}}', jarFilePath);

	const child = spawn(command, { shell: true });

	child.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
		if (data.toString().includes('Started Application')) {
			console.log('Child process id', child.pid + 1);
			res.send({
				message: 'API Restarted Successfully!!!',
				PID: `${child.pid + 1}`,
			});
		}
	});

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
