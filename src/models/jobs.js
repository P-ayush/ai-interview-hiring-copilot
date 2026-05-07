import { Sequelize } from "sequelize";
 const Jobs = (sequelize) => {
    return sequelize.define("jobs", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        recruiterId: {
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
        experienceLevel: {
            type: Sequelize.STRING,
            allowNull: false
        },
        skills: {
            type: Sequelize.STRING,
            allowNull: false
        }

    }, {
        timestamps: true
    });
}
export default Jobs