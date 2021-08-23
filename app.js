require("dotenv").config();
const Express = require('express');
const app = Express();
const dbConnection = require("./db");

const controllers = require("./controllers");

app.use(Express.json());

app.use("/user", controllers.usercontroller);

// app.use(require("./middleware/validate-jwt"));
app.use("/log", controllers.logcontroller);

// app.use('/test', (req, res) => {
//     res.send('This is a message of the emergency broadcast system!');
// });
dbConnection.authenticate()
.then(() => dbConnection.sync())
.then(() => {
    app.listen(5000, () => {
        console.log(`[Server]: App is listening on 5000.`);
    });
})
.catch ((err) => {
    console.log(`[Server]: Server crashed. Error = ${err}`);
});