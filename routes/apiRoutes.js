const express = require('express');
const router = express.Router();

const { exec, spawn } = require('child_process');

const path = require('path');

const apiInfo = require('../API-info.json');

async function startSut(responseMsg, res, sutApi, javaPath) {
	const jarFilePath = path.join(__dirname, '../compiled', sutApi.jarFileName);

	let command;
	if (javaPath) {
		command = `"${javaPath}" -jar "${jarFilePath}"`;
	} else {
		command = sutApi.startCommand.replace('{{FILE_PATH}}', jarFilePath);
	}

	const regex = /[^\s"]+|"([^"]*)"/gi;
	const splitted_command = [];

	let match;
	do {
		match = regex.exec(command);
		if (match != null) {
			splitted_command.push(match[1] ? match[1] : match[0]);
		}
	} while (match != null);

	const child = spawn(splitted_command[0], splitted_command.slice(1));
	console.log('Child process id', child.pid);

	let apiStarted = false;
	child.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);

		if (data.toString().includes(sutApi.onStartPhrase)) {
			apiStarted = true;
			res.send({
				message: responseMsg,
				PID: `${child.pid}`,
			});
		}
	});

	child.stderr.on('data', (data) => {
		console.log(`stderr: ${data}`);
	});

	child.on('error', (error) => {
		console.log(`error: ${error.message}`);
		if (!apiStarted) {
			res.status(500).send('API failed to start properly');
		}
	});

	child.on('exit', (code, signal) => {
		if (code) console.log(`Process exit with code: ${code}`);
		if (signal) console.log(`Process killed with signal: ${signal}`);
		if (!apiStarted) {
			res.status(500).send('API failed to start properly');
		}
		console.log(`Done ✅`);
	});
}

router.get('/', (_, res) => {
	const apiList = apiInfo.apiList;
	const result = apiList.map((api) => ({ id: api.id, name: api.name }));
	res.json(result);
});

router.get('/start-api/:id', async function (req, res) {
	const apiId = parseInt(req.params.id, 10);
	const javaPath = req.query.javaPath;
	const sutApi = apiInfo.apiList.find((api) => api.id === apiId);

	if (!sutApi) {
		return res.status(404).send('API not found');
	}

	return await startSut('API Started Successfully!!!', res, sutApi, javaPath);
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
	const { id, pid, javaPath } = req.body;
	const sutApi = apiInfo.apiList.find((api) => api.id === parseInt(id, 10));
	if (!sutApi) {
		return res.status(404).send('API not found');
	}

	const stopCommand = sutApi.stopCommand.replace(
		'{{PID}}',
		parseInt(pid, 10)
	);

	exec(stopCommand, async function (error, stdout, stderr) {
		if (error) {
			console.error(`Error executing command: ${error.message}`);
			return res.status(500).send('Internal Server Error');
		}
		return await startSut('API Restarted Successfully!!!', res, sutApi, javaPath);
	});
});

module.exports = router;
