require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const router = require('./routes/index');
const fileUpload = require('express-fileupload')
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/ErrorHandlingMiddleware')

const PORT = process.env.PORT || 5000;
const app = express();
app.set('json spaces', 40);
app.use(cors())
app.use(express.json());
app.use('/asset', express.static(path.resolve(__dirname,'static')))
app.use(fileUpload({}));
app.use('/api', router)


app.use(errorHandler);


const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        
        app.listen(PORT, () => console.log('Server started on port', PORT))
    }
    catch (e) {
        console.log(e);
    }
}

start();