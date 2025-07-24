// AI prompt enhancement service
const HUGGING_FACE_API_KEY = "your_api_key";
const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-base";

export interface PromptEnhancement {
  originalPrompt: string;
  enhancedPrompt: string;
  confidence: number;
}

export type ModelType = 'huggingface' | 'openai';

export async function enhancePrompt(prompt: string, model: ModelType = 'huggingface', openaiApiKey?: string): Promise<string> {
  if (model === 'openai') {
    return enhancePromptWithOpenAI(prompt, openaiApiKey);
  }
  return enhancePromptWithHuggingFace(prompt);
}

async function enhancePromptWithOpenAI(prompt: string, apiKey?: string): Promise<string> {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'chatgpt-4o-latest',
        messages: [
          {
            role: 'system',
            content: 'You are an expert prompt engineer. Your task is to enhance user prompts to make them more detailed, specific, and effective for AI assistants. Maintain the original intent while adding clarity, context, and actionable details. Return only the enhanced prompt without any explanations.'
          },
          {
            role: 'user',
            content: `Enhance this prompt to make it more detailed, specific, and effective: "${prompt}"`
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || prompt;
  } catch (error) {
    console.error('OpenAI enhancement error:', error);
    return enhancePromptFallback(prompt);
  }
}

async function enhancePromptWithHuggingFace(prompt: string): Promise<string> {
  try {
    const enhancementInstruction = `Enhance this prompt to make it more detailed, specific, and effective for AI assistants. Make it clearer and more actionable while maintaining the original intent: "${prompt}"`;
    
    const response = await fetch(HUGGING_FACE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: enhancementInstruction,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          do_sample: true,
          top_p: 0.9
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle different response formats
    let enhancedPrompt = '';
    if (Array.isArray(data) && data[0]?.generated_text) {
      enhancedPrompt = data[0].generated_text;
    } else if (data.generated_text) {
      enhancedPrompt = data.generated_text;
    } else {
      throw new Error('Unexpected response format from Hugging Face API');
    }

    // Clean up the response - remove the instruction part if it's included
    const cleanedPrompt = enhancedPrompt
      .replace(enhancementInstruction, '')
      .trim()
      .replace(/^["']|["']$/g, ''); // Remove quotes if present

    return cleanedPrompt || prompt; // Fallback to original if cleaning results in empty string
  } catch (error) {
    console.error('Prompt enhancement error:', error);
    
    // Fallback enhancement using simple text manipulation
    return enhancePromptFallback(prompt);
  }
}

function enhancePromptFallback(prompt: string): string {
  // Simple fallback enhancement
  const enhancements = [
    "Please provide a detailed and comprehensive response to:",
    "I need you to thoroughly explain and elaborate on:",
    "Can you give me an in-depth analysis of:",
    "Please provide step-by-step guidance on:",
    "I would like a detailed breakdown of:"
  ];
  
  const randomEnhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
  return `${randomEnhancement} ${prompt}. Please include examples, key points, and actionable insights where relevant.`;
}

export async function generatePromptSuggestions(topic: string): Promise<string[]> {
  const suggestions = [
    `Create a comprehensive guide about ${topic}`,
    `Explain the key concepts and principles of ${topic}`,
    `Provide a step-by-step tutorial on ${topic}`,
    `Compare different approaches to ${topic}`,
    `Analyze the benefits and challenges of ${topic}`,
    `Create a beginner's introduction to ${topic}`,
    `Design a practical implementation plan for ${topic}`,
    `Evaluate the current trends in ${topic}`
  ];
  
  return suggestions.slice(0, 5); // Return top 5 suggestions
}
