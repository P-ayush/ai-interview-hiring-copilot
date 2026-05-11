import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io"
import db from "./models/index.js";
import routes from "./routes/index.js";
import { interviewSocket } from "./socket/interviewSocket.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
routes(app);
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
})
interviewSocket(io);
db.sequelize.sync({ force: false }).then(() => {
    console.log("Database synced successfully");
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});