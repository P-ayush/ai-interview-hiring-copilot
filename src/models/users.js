import { Sequelize } from "sequelize";
const Users = (sequelize) => {
    return sequelize.define("users", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        role: {
            type: Sequelize.ENUM("candidate", "recruiter"),
            allowNull: false,
            defaultValue: "candidate"
        },
    },
        {
            timestamps: true
        }
    );
};

export default Users