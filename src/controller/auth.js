import { generateToken, verifyToken, decodeToken } from "../utils/jwt.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import db from "../models/index.js";
export const signUp = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const user = await db.Users.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const hashedPassword = await hashPassword(password);
        const newUser = await db.Users.create({ name, email, password: hashedPassword, role });
        const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });
        delete newUser.dataValues.password;
        res.status(201).json({ message: "User created successfully", user: newUser, token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.errors[0].message });
    }

}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db.Users.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
        }
        const token = generateToken({ id: user.id, email: user.email, role: user.role });
        delete user.dataValues.password;
        res.status(200).json({ message: "Login successful", user, token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}