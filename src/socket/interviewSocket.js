import db from "../models/index.js";
import jwt from "jsonwebtoken";
import {
    generateInterviewQuestion
} from "../service/ai.js";

export const interviewSocket = (io) => {
    io.use(
        async (socket, next) => {
            try {
                const token =
                    socket.handshake.query.token;
                if (!token) {
                    return next(
                        new Error(
                            "Authentication error"
                        )
                    );
                }
                const decoded =
                    jwt.verify(
                        token,
                        process.env.JWT_SECRET
                    );
                socket.user = decoded;
                next();
            } catch (error) {
                next(
                    new Error(
                        "Authentication error"
                    )
                );
            }
        }
    );
    io.on("connection", (socket) => {

        console.log(
            "User connected:",
            socket.id
        );


        socket.on(
            "join_interview",
            async (interviewId) => {
                const interview =
                    await db.Interviews.findByPk(
                        interviewId
                    );
                if (!interview) {
                    return socket.emit(
                        "error_message",
                        {
                            message:
                                "Interview not found",
                        }
                    );
                }
                if (
                    interview.status ===
                    "completed"
                ) {
                    return socket.emit(
                        "interview_completed"
                    );
                }
                socket.join(
                    `interview_${interviewId}`
                );


            }
        );


        socket.on(
            "send_message",

            async (data) => {
                try {

                    const interview =
                        await db.Interviews.findOne({
                            where: {
                                id:
                                    data.interviewId,
                            },
                            include: [
                                {
                                    model:
                                        db.Applications,
                                    required: true,
                                    include: [
                                        {
                                            model:
                                                db.Jobs,
                                        },
                                        {
                                            model:
                                                db.Candidates,
                                        },
                                    ],
                                },
                            ],
                        });
                    if (!interview) {
                        return socket.emit(
                            "error_message",
                            {
                                message:
                                    "Interview not found",
                            }
                        );
                    }
                    if (
                        interview.status ===
                        "completed"
                    ) {

                        return socket.emit(
                            "error_message",
                            "Interview already completed"
                        );

                    }


                    const candidateMessage = await db.InterviewMessages.create({
                        interviewId:
                            interview.id,
                        sender:
                            "candidate",
                        message:
                            data.message,
                    });
                    io.to(
                        `interview_${data.interviewId}`
                    ).emit(
                        "receive_message",
                        {
                            sender:
                                "candidate",
                            message:
                                candidateMessage.message,
                        }
                    );
                    const previousMessages =
                        await db.InterviewMessages.findAll({
                            where: {
                                interviewId:
                                    interview.id,
                            },
                            order: [
                                ["createdAt", "ASC"]
                            ],
                        });
                    const aiResponse =
                        await generateInterviewQuestion(
                            interview.application
                                .candidate
                                .extractedText,
                            interview.application
                                .job
                                .description,
                            previousMessages
                        );
                    const aiMessage =
                        await db.InterviewMessages.create({
                            interviewId:
                                interview.id,
                            sender:
                                "ai",
                            message:
                                aiResponse.question,

                        });

                    io.to(
                        `interview_${data.interviewId}`
                    ).emit(
                        "receive_message",
                        {
                            sender: "ai",
                            message:
                                aiMessage.message,
                        }
                    );
                } catch (error) {
                    console.log(error);
                    socket.emit(
                        "error_message",
                        {
                            message:
                                error.message,
                        }
                    );
                }
            }
        );

        socket.on(
            "disconnect",
            () => {
                console.log(
                    "User disconnected:",
                    socket.id
                );
            }
        );
    });

};