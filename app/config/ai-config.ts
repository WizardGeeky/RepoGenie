import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY as string
);

export async function generateGithubReadmeFile(data: {
  repo: any;
  languages: string[];
  topics: string[];
}) {
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are an AI assistant that writes optimized and professional GitHub README files.

Based on the following GitHub repository data, generate a complete README.md file including:
- Project title and description
- Badges (use emojis for stars, forks, and language)
- Table of Contents
- Features
- Tech stack (use relevant emojis for each technology)
- Setup instructions (Installation)
- Usage
- Learning & Resources
- License
- Acknowledgments
- Contact / Author Info

Repository Data:
- **Name**: ${data.repo.full_name}
- **Description**: ${data.repo.description}
- **Homepage**: ${data.repo.homepage}
- **Stars**: 🌟 ${data.repo.stargazers_count}
- **Forks**: 🍴 ${data.repo.forks}
- **Created At**: ${data.repo.created_at}
- **Updated At**: ${data.repo.updated_at}
- **Languages**: 🖥️ ${data.languages.join(", ")}
- **Topics**: 🏷️ ${data.topics.join(", ")}

Return only the markdown content of the README. Use emojis for stars, forks, and tech stack sections. Ensure the README looks polished and professional with appropriate section headings and content.
`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  return result.response.text();
}
