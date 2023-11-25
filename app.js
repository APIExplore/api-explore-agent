const express = require('express');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const port = 3000;
app.use(express.json());
app.use('/api', apiRoutes);

app.get('', (_, res) => {
	res.send('Welcome to the SUT agent App.');
});

app.listen(port, () => {
	console.log(`Agent app listening on port ${port}`);
});
