const express = require('express');
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const db = require('./models');


//Routers
const usersRouter = require('./routes/Users');
app.use("/auth", usersRouter);
const urlRouter = require('./routes/URL');
app.use("/api", urlRouter);
const emailRouter = require('./routes/Email');
app.use("/email", emailRouter);
const submitterRouter = require('./routes/Submitter');
app.use('/api/v1/result', submitterRouter);
const questionRouter = require('./routes/SecurityQuestion');
app.use('/secuquestion', questionRouter);
const reportURLRouter = require('./routes/ReportedURL');
app.use('/reportedurl', reportURLRouter);

db.sequelize.sync().then(() => {
    app.listen(8080, () => {
        console.log("Server running on port 8080");
    });
});


