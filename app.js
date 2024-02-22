// npx sequelize-cli model:generate --name User --attributes userName:string,email:string,password:string
// npx sequelize-cli model:generate --name Category --attributes name:string
// npx sequelize-cli model:generate --name Enrollment --attributes user_id:integer,course_id:integer
// npx sequelize-cli model:generate --name Course --attributes title:string,description:string,instructor:string,CategoryId:integer
// npx sequelize-cli model:generate --name UserProfile --attributes bio:text,otherDetails:string,user_id:integer

const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const app = express();
const PORT = 3000;
const routes = require('./routes');

app.use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: false,
    })
);
app.use(flash());

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`PORT is running on ${PORT}`)
})