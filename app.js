// ./app.js
const express = require('express');
const cors    = require('cors');
const app = express();
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
	rejectUnauthorized: false
    }
});

const handleResponse = (res, data, message) => {
    console.log(message);
    res.status(200).send(data);
};

var corsOptionsDelegate = function (req, callback) {
  var corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  callback(null, corsOptions) // callback expects two parameters: error and options
};

app.use(express.json());

app.get('/shops', cors(corsOptionsDelegate), async (req, res) => {
    try {
	const client = await pool.connect();
	const rows   = await client.query('select * from public.shops order by shopNumber');
	console.log('got ' + rows.rowCount + ' rows from list all');
	res.status(200).send(rows.rows);
	client.release();
	console.log('db pool idle count:' + pool.idleCount);
    } catch(err) {
	console.error('Error during list all: ' + err);
	res.status(500).send(err);
    };

});

// get a specific shop
app.get('/shop/:shopNumber', cors(corsOptionsDelegate), async (req, res) => {
    try {
	const { shopNumber }    = req.params;
	const client    = await pool.connect();
	const rows      = await client.query('select * from public.shop where id = $1', [shopNumber]);
	const id        = rows.rows[0].id;
	const address   = rows.rows[0].address;
	const city      = rows.rows[0].city;
	handleResponse(res, rows, 'retrieved shop number: ' + shopNumber + ' address: ' + address
		       + ' city:' + city + ' for id:' + id);
	client.release();
	console.log('db pool idle count:' + pool.idleCount);
    } catch(err) {
	console.error('Error retrieving id: ' + id + ' ' + err);
	res.status(500).send(err);
    };
});

// add a row
app.post('/shop', cors(corsOptionsDelegate), async (req, res) => {
    try {
	console.log("post shopNumber is:", req.body.shopNumber);
	const shopNumber    = req.body.shopNumber    ? req.body.shopNumber    : 0;
	const address       = req.body.address       ? req.body.address       : '';
        const highway       = req.body.highway       ? req.body.highway       : '';
        const exitNumber    = req.body.exitNumber    ? req.body.exitNumber    : '';
	const city          = req.body.city          ? req.body.city          : '';
	const stateCd       = req.body.stateCd       ? req.body.stateCd       : '';
	const zipcode       = req.body.zipcode       ? req.body.zipcode       : '';
        const phone         = req.body.phone         ? req.body.phone         : '';
        const lat           = req.body.lat;
        const lng           = req.body.lng;
        const division      = req.body.division      ? req.body.division      : 0;
        const district      = req.body.district      ? req.body.district      : 0;
	const client        = await pool.connect();
	const rows = await client.query('insert into public.shop ('shopNumber, address, highway, exitNumber, city'
          + ' , stateCd, zipcode, phone, lat, lng, division, district '
	  + ' values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) '
	  + ' returning id ',
	  [ shopNumber, address, highway, exitNumber, city, stateCd, zipcode, phone, lat, lng, division, district ]);
	handleResponse(res, rows.rows[0].id, 'insert returned uuid:' + rows.rows[0].id);
	client.release();
	console.log('db pool idle count:' + pool.idleCount);
    } catch(err) {
	console.error('error inserting shopNumber: ' + shopNumber + ' + err);
	res.status(500).send(err);
    };

});

// update
app.patch('/addresses', cors(corsOptionsDelegate), async (req, res) => {
    try {
	console.log("shopNumber is:", req.body.shopNumber);
	const id            = req.body.id            ? req.body.id            : '';
	const shopNumber    = req.body.shopNumber    ? req.body.shopNumber    : 0;
	const address       = req.body.address       ? req.body.address       : '';
        const highway       = req.body.highway       ? req.body.highway       : '';
        const exitNumber    = req.body.exitNumber    ? req.body.exitNumber    : '';
	const city          = req.body.city          ? req.body.city          : '';
	const stateCd       = req.body.stateCd       ? req.body.stateCd       : '';
	const zipcode       = req.body.zipcode       ? req.body.zipcode       : '';
        const phone         = req.body.phone         ? req.body.phone         : '';
        const lat           = req.body.lat;
        const lng           = req.body.lng;
        const division      = req.body.division      ? req.body.division      : 0;
        const district      = req.body.district      ? req.body.district      : 0;
	const client = await pool.connect();
	const rows   = await client.query('update public.shop set shopNumber = $1, address = $2, highway = $3, exitNumber = $4, '
                                          + ' city = $5, stateCd = $6, zipCode = $7, phone = $8, '
                                          + ' lat = $9, lng = $10, division = $11, district = $12'
                                          + ' where id = $13' ,
					  shopNumber, address, highway, exitNumber, city, stateCd, zipCode, phone,
					  lat, lng, division, district, id);
	handleResponse("Updated", 'updated shop with uuid:' + id);
	client.release();
	console.log('db pool idle count:' + pool.idleCount);
    } catch(err) {
	console.error('error updating address with uuid:' + id + '' + err);
	res.status(500).send(err);
    };
});

// delete
app.delete('/addresses/:shopNumber', cors(corsOptionsDelegate), async (req, res) => {
    try {
	const { shopNumber } = req.params;
	const client = await pool.connect();
	await client.query('delete from public.shop where shopNumber = $1', shopNumber);
	handleResponse(res, "Deleted", 'deleted row with shopNumber: ' + shopNumber);
	client.release();
	console.log('db pool idle count:' + pool.idleCount);
    } catch(err) {
	console.error('error deleting row with id:' + id + ' error:' + err);
	res.status(500).send('Error deleting row with id:' + id + ' error:' + err);
    };
});


var port = process.env.PORT || 8000;
app.set('port', port)
console.log('Port is: ' + port);

app.listen(port);
