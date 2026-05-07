import { Sequelize } from "sequelize";

 const Assignments = (sequelize) => {
    return sequelize.define("assignments", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        interviewId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        difficulty: {
            type: Sequelize.ENUM("easy", "medium", "hard"),
            allowNull: false,
        },
    }, {
        timestamps: true,
    });
};

export default Assignments