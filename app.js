const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
const cors = require('cors');

const app = express();
const port = 3030;
app.use(express.json());
app.use(cors());
app.use('/api', apiRoutes);

app.get('', (_, res) => {
	res.send('Welcome to the SUT agent App.');
});

app.listen(port, () => {
	console.log(`Agent app listening on port ${port}`);
});
