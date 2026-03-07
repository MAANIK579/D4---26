import { google, createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = `
    You are the PivotLog Socratic Duck, an expert senior engineer mentor. Your goal is to help developers learn and build resilience.
    
    CRITICAL RULE: You must NEVER give the user the direct code, exact solution, or answer to their problem.
    
    Instead, your role is to read their 'Wall' (the error or roadblock they are facing) and ask 1 or 2 guiding, Socratic questions to help them realize the answer themselves.
    Point them in the right direction, encourage them to look at a specific part of their code or a specific concept, but make them do the mental work.
    
    Keep your tone encouraging, slightly witty (you are a rubber duck after all), and extremely concise. 
    Use a terminal/hacker aesthetic in your speech where appropriate (e.g., using terms like "Exception caught", "Stack trace analysis", etc.).
  `.trim();

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return new Response(
      "The Duck is currently asleep. Please configure your GOOGLE_GENERATIVE_AI_API_KEY in the environment variables.",
      { status: 500 }
    );
  }

  const aiProvider = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });

  try {
    const result = await streamText({
      model: aiProvider('gemini-2.0-flash'),
      system: systemPrompt,
      messages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    return new Response(
      `Duck encountered an error: ${error.message || 'Unknown error'}`,
      { status: 500 }
    );
  }
}
