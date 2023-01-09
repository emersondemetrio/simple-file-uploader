const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

app.use(
	fileUpload({
		createParentPath: true,
	})
);

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

const port = process.env.PORT || 4500;

app.get('/', (_, res) => {
	res.json({
		status: 'ok - working',
	});
});

app.post('/upload', async (req, res) => {
	console.log('New request', req.files);
	try {
		if (!req.files) {
			res.send({
				status: false,
				message: 'No file uploaded',
			});
		} else {
			const photo = req.files.photo;

			photo.mv('./uploads/' + photo.name);

			res.send({
				status: true,
				message: 'File is uploaded',
				data: {
					name: photo.name,
					mimetype: photo.mimetype,
					size: photo.size,
				},
			});
		}
	} catch (err) {
		res.status(500).send(err);
	}
});

app.listen(port, () => console.log(`App is listening on port ${port}.`));
