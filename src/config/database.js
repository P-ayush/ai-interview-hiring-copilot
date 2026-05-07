import { Sequelize } from "sequelize";
const sequelize = new Sequelize({
    dialect: "mysql",
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false
});

export default sequelize;