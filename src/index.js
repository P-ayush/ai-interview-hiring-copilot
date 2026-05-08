import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./models/index.js";
import routes from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
routes(app);
db.sequelize.sync({ force: false}).then(() => {
    console.log("Database synced successfully");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});