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