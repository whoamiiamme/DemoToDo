const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require('cors');
const morgan = require("morgan")
require('dotenv').config()

const swaggerUi = require("swagger-ui-express");

const YAML = require('yamljs');
const swaggerDocument = YAML.load('swagger/swagger.yaml');

const userRoute = require("./routes/user.route");
const tokenRoute = require("./routes/token.route");
const productRoute = require("./routes/product.route");

const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true
}));
app.use(express.json());

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use("/user", userRoute);
app.use("/token", tokenRoute);
app.use("/product", productRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use((error, req, res, next) => {
    return res.status(error.status || 500).send({
        status: error.status,
        error: error.message
    })
    // res.status(400).send({
    //     error: error.message
    // })
})

const port = process.env.NODE_ENV === 'test' ? 3001 : 3000;

app.listen(port, () => {
    console.log("SERVER IS RUNNING ON PORT:" + port)
});

module.exports = app;