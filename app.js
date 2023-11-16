const express = require('express');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const port = 3000;

app.use('/api', apiRoutes);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
