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

db.Users.hasOne(db.Candidates, {
    foreignKey: "userId",
});

db.Candidates.belongsTo(db.Users, {
    foreignKey: "userId",
});

db.Users.hasMany(db.Jobs, {
    foreignKey: "recruiterId",
});

db.Jobs.belongsTo(db.Users, {
    foreignKey: "recruiterId",
});

db.Candidates.hasMany(
    db.Applications,
    {
        foreignKey: "candidateId",
    }
);

db.Applications.belongsTo(
    db.Candidates,
    {
        foreignKey: "candidateId",
    }
);
db.Jobs.hasMany(db.Applications, {
    foreignKey: "jobId",
});

db.Applications.belongsTo(db.Jobs, {
    foreignKey: "jobId",
});

db.Applications.hasOne(
    db.Interviews,
    {
        foreignKey: "applicationId",
    }
);

db.Interviews.belongsTo(
    db.Applications,
    {
        foreignKey: "applicationId",
    }
);

db.Interviews.hasMany(
    db.InterviewMessages,
    {
        foreignKey: "interviewId",
    }
);

db.InterviewMessages.belongsTo(
    db.Interviews,
    {
        foreignKey: "interviewId",
    }
);

db.Interviews.hasMany(
    db.Assignments,
    {
        foreignKey: "interviewId",
    }
);

db.Assignments.belongsTo(
    db.Interviews,
    {
        foreignKey: "interviewId",
    }
);

db.sequelize = sequelize;

export default db;