const express = require('express');
const app = express();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const validator = require('validator');
const port = 3000;

const mariadb = require('mariadb');
const pool = mariadb.createPool({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'sample',
        port: 3306,
        connectionLimit: 50
});

const options = {
	swaggerDefinition: {
		info: {
			title: 'Assignment-08',
			version: '1.0.0',
			description: 'Assignment-08 using REST and swagger'
		},
		host: '167.172.136.50:3000',
		basePath: '/'
	},
	apis: ['./server.js']
};
const specs = swaggerJsdoc(options);

app.use('/docs',swaggerUi.serve,swaggerUi.setup(specs));
app.use(cors());
app.use(express.json());


const sanitizeAndValidateInput = (req,res,next) => {
        let input = req.body;
        if(input.ITEM_ID){
                input.ITEM_ID = validator.escape(input.ITEM_ID);
                if (!input.ITEM_ID|| typeof input.ITEM_ID !== 'string' || input.ITEM_ID.trim() === ''){
                        return res.status(400).json({error: 'Invalid input data'});
                }
        }
	if(input.ITEM_NAME){
                input.ITEM_NAME = validator.escape(input.ITEM_NAME);
                if (!input.ITEM_NAME|| typeof input.ITEM_NAME !== 'string' || input.ITEM_NAME.trim() === ''){
                        return res.status(400).json({error: 'Invalid input data'});
                }
        }
	if(input.ITEM_UNIT){
                input.ITEM_UNIT = validator.escape(input.ITEM_UNIT);
                if (!input.ITEM_UNIT|| typeof input.ITEM_UNIT !== 'string' || input.ITEM_UNIT.trim() === ''){
                        return res.status(400).json({error: 'Invalid input data'});
                }
        }
	if(input.COMPANY_ID){
                input.COMPANY_ID = validator.escape(input.COMPANY_ID);
                if (!input.COMPANY_ID|| typeof input.COMPANY_ID !== 'string' || input.COMPANY_ID.trim() === ''){
                        return res.status(400).json({error: 'Invalid input data'});
                }
        }
        next();
};

const sanitizeAndValidateParams = (req,res,next) => {
        let input = req.params;
        input.ITEM_ID = validator.escape(input.ITEM_ID);
        if (!input.ITEM_ID|| typeof input.ITEM_ID !== 'string' || input.ITEM_ID.trim() === ''){
                return res.status(400).json({error: 'Invalid input data'});
        }
        next();
};


/**
* @swagger
* /foods:
*    get:
*      description: Return all foods
*      produces:
*        - application/json
*      responses:
*        200:
*          description: Table food containing an array of all food items and their information
*        500:
*          description: Internal server error
*/
app.get('/foods',(req,res)=>{
pool.getConnection()
.then(conn => {
        conn.query("SELECT * FROM sample.foods")
        .then(result => {
                res.set('Content-Type','application/json; charset=UTF-8');
                res.set('Connection','keep-alive');
		conn.end();
                res.status(200).json(result);
        })
        .catch(err => {
		conn.end();
                res.status(500).json(err.message);
        });
})
.catch(err => {
        res.status(500).json(err.message);
});
});


/**
* @swagger
* /agents:
*    get:
*      description: Return all agents
*      produces:
*        - application/json
*      responses:
*        200:
*          description: Table agents containing an array of all agents and their information
*        500:
*          description: Internal server error
*/
app.get('/agents',(req,res)=>{
pool.getConnection()
.then(conn => {
        conn.query("SELECT * FROM sample.agents")
        .then(result => {
                res.set('Content-Type','application/json; charset=UTF-8');
                res.set('Connection','keep-alive');
		conn.end();
                res.status(200).json(result);
        })
        .catch(err => {
		conn.end();
                res.status(500).json(err.message);
        });
})
.catch(err => {
        res.status(500).json(err.message);
});
});



/**
* @swagger
* /customers:
*    get:
*      description: Return all customers
*      produces:
*        - application/json
*      responses:
*        200:
*          description: Table customers containing an array of all customers and their information
*        500:
*          description: Internal server error
*/
app.get('/customers',(req,res)=>{
pool.getConnection()
.then(conn => {
        conn.query("SELECT * FROM sample.customer")
        .then(result => {
                res.set('Content-Type','application/json; charset=UTF-8');
                res.set('Connection','keep-alive');
		conn.end();
                res.status(200).json(result);
        })
        .catch(err => {
		conn.end();
                res.status(500).json(err.message);
        });
})
.catch(err => {
        res.status(500).json(err.message);
});
});


/**
 * @swagger
 * /foods:
 *   post:
 *     description: Insert a new food item into the database
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: new food item
 *         required: true
 *         description: Enter the food item to be inserted
 *         schema:
 *           type: object
 *           properties:
 *             ITEM_ID:
 *               type: string
 *             ITEM_NAME:
 *               type: string
 *             ITEM_UNIT:
 *               type: string
 *             COMPANY_ID:
 *               type: string
 *     responses:
 *       '201':
 *         description: Newly added food item
 *       '400':
 *         description: Invalid input data
 *       '500':
 *         description: Internal server error
 */
app.post('/foods', sanitizeAndValidateInput, (req,res)=>{
	pool.getConnection()
	.then(conn => {
		conn.query("INSERT INTO sample.foods  values (?,?,?,?)",[req.body.ITEM_ID,req.body.ITEM_NAME,req.body.ITEM_UNIT,req.body.COMPANY_ID])
		.then(result => {
			conn.end();
			res.status(201).json(req.body);;
		})
		.catch(err => {
			conn.end();
			res.status(500).json(err.message);
		});
	})
	.catch(err => {
		res.status(500).json(err.message);
	});
});

/**
* @swagger
* /foods/{ITEM_ID}:
*    put:
*      description: Updates/adds a food item
*      produces:
*        - application/json
*      parameters:
*        - in: path
*          name: ITEM_ID
*          required: true
*          description: Enter the id of the food item to be updated/added
*          schema:
*            type: string
*            properties:
*              ITEM_ID: 
*                type: string
*        - in: body
*          name: item details
*          required: true
*          description: Enter the details of the food item to be updated
*          schema :
*            type: object
*            properties:
*              ITEM_NAME:
*                type: string
*              ITEM_UNIT:
*                type: string
*              COMPANY_ID:
*                type: string
*      responses:
*        200:
*          description: Object of the food item updated
*        201:
*          description: Object of the added food item
*        400:
*          description: Invalid input data
*        500:
*          description: Internal server error
*/
app.put('/foods/:ITEM_ID', sanitizeAndValidateInput, sanitizeAndValidateParams, (req,res)=>{
	pool.getConnection()
	.then(conn => {
		conn.query("SELECT count(*) as count FROM sample.foods WHERE `ITEM_ID`=?",[req.params.ITEM_ID])
		.then(([rows]) => {
			const count = Number(rows.count);
			if (count === 0){
				conn.query("INSERT INTO sample.foods  values (?,?,?,?)",[req.params.ITEM_ID,req.body.ITEM_NAME,req.body.ITEM_UNIT,req.body.COMPANY_ID])
				.then(result => {
					conn.end();
					const ITEM_ID = req.params.ITEM_ID;
					const ITEM_NAME = req.body.ITEM_NAME;
					const ITEM_UNIT = req.body.ITEM_UNIT;
					const COMPANY_ID = req.body.COMPANY_ID;
                        		return res.status(201).json({ITEM_ID,ITEM_NAME,ITEM_UNIT,COMPANY_ID});;
                		})
                		.catch(err => {
					conn.end();
                        		return res.status(500).json(err.message);
                		});
			} else {
				conn.query("UPDATE sample.foods SET `ITEM_NAME`=?, `ITEM_UNIT`=?, `COMPANY_ID`=?  WHERE `ITEM_ID`=?",[req.body.ITEM_NAME,req.body.ITEM_UNIT,req.body.COMPANY_ID,req.params.ITEM_ID])
				.then(result => {
					conn.end();
					const ITEM_ID = req.params.ITEM_ID;
                                        const ITEM_NAME = req.body.ITEM_NAME;
                                        const ITEM_UNIT = req.body.ITEM_UNIT;
                                        const COMPANY_ID = req.body.COMPANY_ID;
					return res.status(200).json({ITEM_ID,ITEM_NAME,ITEM_UNIT,COMPANY_ID});
				})
				.catch(err => {
					conn.end();
					return res.status(500).json(err.message);
				});
			}
		})
		.catch(err => {
			conn.end();
			return res.status(500).json(err.message);
		});
	})
	.catch(err => {
		return res.status(500).json(err.message);
	});
});


/**
* @swagger
* /foods/{ITEM_ID}:
*    patch:
*      description: Updates the food item if present
*      produces:
*        - application/json
*      parameters:
*        - in: path
*          name: ITEM_ID
*          required: true
*          description: Enter the id of the food item to be updated
*          schema:
*            type: string
*            properties:
*              ITEM_ID:
*                type: string
*        - in: body
*          name: item details
*          required: true
*          description: Enter the details of the food item to be updated
*          schema :
*            type: object
*            properties:
*              ITEM_NAME:
*                type: string
*              ITEM_UNIT:
*                type: string
*              COMPANY_ID:
*                type: string
*      responses:
*        200:
*          description: Object of the food item updated
*        400:
*          description: Invalid input data
*        404:
*          description: Item not found
*        500:
*          description: Internal server error
*/
app.patch('/foods/:ITEM_ID', sanitizeAndValidateInput, sanitizeAndValidateParams, (req,res)=>{
        pool.getConnection()
        .then(conn => {
                conn.query("SELECT count(*) as count FROM sample.foods WHERE `ITEM_ID`=?",[req.params.ITEM_ID])
                .then(([rows]) => {
                        const count = Number(rows.count);
                        if (count === 0){
                                conn.end();
                                return res.status(404).json({error: 'Item not found'});
                        } else {
                                conn.query("UPDATE sample.foods SET `ITEM_NAME`=?, `ITEM_UNIT`=?, `COMPANY_ID`=?  WHERE `ITEM_ID`=?",[req.body.ITEM_NAME,req.body.ITEM_UNIT,req.body.COMPANY_ID,req.params.ITEM_ID])
                                .then(result => {
                                        conn.end();
                                        const ITEM_ID = req.params.ITEM_ID;
                                        const ITEM_NAME = req.body.ITEM_NAME;
                                        const ITEM_UNIT = req.body.ITEM_UNIT;
                                        const COMPANY_ID = req.body.COMPANY_ID;
                                        return res.status(200).json({ITEM_ID,ITEM_NAME,ITEM_UNIT,COMPANY_ID});
                                })
                                .catch(err => {
                                        conn.end();
                                        return res.status(500).json(err.message);
                                });
                        }
                })
                .catch(err => {
                        conn.end();
                        return res.status(500).json(err.message);
                });
        })
        .catch(err => {
                return res.status(500).json(err.message);
        });
});



/**
* @swagger
* /foods/{ITEM_ID}:
*    delete:
*      description: Removes food item if exists
*      parameters:
*        - in: path
*          name: ITEM_ID
*          required: true
*          description: Enter the id of the food otem to be deleted
*          schema:
*            type: string
*            properties:
*              ITEM_ID:
*                type: string
*      responses:
*        204:
*          description: Item successfully removed from the list of food items
*        400:
*          description: Invalid input data
*        404:
*          description: No food item found with the given id
*        500:
*          description: Internal server error
*/
app.delete('/foods/:ITEM_ID', sanitizeAndValidateParams, (req,res)=>{
	pool.getConnection()
        .then(conn => {
                conn.query("SELECT count(*) as count FROM sample.foods WHERE `ITEM_ID`=?",[req.params.ITEM_ID])
                .then(([rows]) => {
                        const count = Number(rows.count);
                        if (count === 0){
                                conn.end();
				return res.status(404).json({error: 'Item not found'});
                        } else {
                                conn.query("DELETE FROM sample.foods WHERE `ITEM_ID`=?",[req.params.ITEM_ID])
                                .then(result => {
                                        conn.end();
                                        return res.status(204).end();
                                })
                                .catch(err => {
                                        conn.end();
                                        return res.status(500).json(err.message);
                                });
                        }
                })
                .catch(err => {
                        conn.end();
                        return res.status(500).json(err.message);
                });
        })
	.catch(err => {
		res.status(500).json(err.message);
	});
});


app.listen(port,()=>{
console.log(`API served at http://167.172.136.50:${port}`);
});

