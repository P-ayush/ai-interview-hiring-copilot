import sequelize from "../config/database.js";

import Users from "./users.js";
import Jobs from "./jobs.js";
import Interviews from "./interviews.js";
import Candidates from "./candidates.js";
import Assignments from "./assignments.js";
import InterviewMessages from "./interviewMessage.js";
import Applications from "./applications.js";

const db = {
    Users: Users(sequelize),
    Jobs: Jobs(sequelize),
    Interviews: Interviews(sequelize),
    Candidates: Candidates(sequelize),
    Assignments: Assignments(sequelize),
    InterviewMessages: InterviewMessages(sequelize),
    Applications: Applications(sequelize),
};

db.sequelize = sequelize;

export default db;