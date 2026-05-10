import { GoogleGenAI } from '@google/genai';
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const analyzeResumeAI = async (resumeText) => {
    try {
        const prompt = `
               You are an AI recruitment assistant.

               Analyze the following resume and return ONLY valid JSON.

               Rules:
               - Do not include markdown
               - Do not include \`\`\`
               - Keep summary under 60 words
               - Extract only important technical/professional skills
               - Score should be between 0 and 100

               Required JSON format:

               {
                 "summary": "short professional summary",
                 "skills": ["skill1", "skill2"],
                 "score": 85
               }

               Resume:
               ${resumeText}
               `;

        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        const response =
            result.candidates[0].content.parts[0].text;

        const cleanedResponse = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleanedResponse);

    } catch (error) {
        console.log(error);
        throw new Error("AI resume analysis failed");

    }
};

export const matchResumeToJob = async (
    resumeText,
    jobDescription
) => {
    try {
        const prompt = `
        You are an AI hiring assistant.

        Compare the resume with the job description.

        Return ONLY valid JSON.

        Format:

        {
          "matchScore": 85,
          "feedback": "short hiring feedback"
        }

        Resume:
        ${resumeText}

        Job Description:
        ${jobDescription}
        `;
        const result =
            await genAI.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });

        const response =
            result.candidates[0]
                .content.parts[0].text;

        const cleanedResponse = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
        return JSON.parse(cleanedResponse);
    } catch (error) {
        console.log(error);
        throw new Error("AI job match failed");
    }
};

export const generateInterviewQuestion = async (
    resumeText,
    jobDescription,
    previousMessages = []
) => {
    try {
        const formattedConversation =
            previousMessages
                .map(
                    (msg) =>
                        `${msg.sender}: ${msg.message}`
                )
                .join("\n");

        const prompt = `
        You are an AI technical interviewer.

        Your task:
        - Ask one technical interview question at a time
        - Questions should be based on:
          - candidate resume
          - job description
          - previous conversation
        - Keep questions concise
        - Increase difficulty gradually
        - Do not ask multiple questions together
        - Return ONLY valid JSON
        - Do not include markdown or \`\`\`

        Required JSON format:

        {
          "question": "technical interview question"
        }

        Candidate Resume:
        ${resumeText}

        Job Description:
        ${jobDescription}

        Previous Conversation:
        ${formattedConversation}
        `;
        const result =
            await genAI.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });
        const response =
            result.candidates[0]
                .content.parts[0].text;
        const cleanedResponse = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
        return JSON.parse(cleanedResponse);
    } catch (error) {
        console.log(error);
        throw new Error(
            "AI interview question generation failed"
        );

    }
};
export const generateInterviewFeedback = async (
    resumeText,
    jobDescription,
    interviewMessages = []
) => {
    try {
        const formattedConversation =
            interviewMessages
                .map(
                    (msg) =>
                        `${msg.sender}: ${msg.message}`
                )
                .join("\n");

        const prompt = `
        You are an AI technical interviewer.

        Analyze the interview conversation and evaluate the candidate.

        Evaluation criteria:
        - Technical knowledge
        - Communication clarity
        - Problem solving
        - Backend development understanding
        - Relevance to job description

        Rules:
        - Return ONLY valid JSON
        - Do not include markdown
        - Do not include \`\`\`
        - Score must be between 0 and 100
        - Keep feedback concise

        Required JSON format:

        {
          "score": 85,
          "feedback": "short professional interview feedback"
        }

        Candidate Resume:
        ${resumeText}

        Job Description:
        ${jobDescription}

        Interview Conversation:
        ${formattedConversation}
        `;
        const result =
            await genAI.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });
        const response =
            result.candidates[0]
                .content.parts[0].text;
        const cleanedResponse = response
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
        return JSON.parse(cleanedResponse);
    } catch (error) {
        console.log(error);
        throw new Error(
            "AI interview evaluation failed"
        );
    }

};