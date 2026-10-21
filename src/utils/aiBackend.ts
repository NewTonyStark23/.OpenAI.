// AI Backend Integration - Connects to Ollama (local AI)
// This replaces the template responses with real AI

const OLLAMA_URL = 'http://localhost:11434';
const MODEL = 'llama3.1'; // Can also use 'mistral', 'codellama', etc.

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function sendMessageToAI(
  message: string,
  systemPrompt: string,
  conversationHistory: Message[]
): Promise<string> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: message }
        ],
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.message.content;
  } catch (error) {
    console.error('AI backend error:', error);
    
    // Check if Ollama is running
    try {
      const healthCheck = await fetch(`${OLLAMA_URL}/api/tags`);
      if (!healthCheck.ok) {
        throw new Error('Ollama not responding');
      }
    } catch {
      return `⚠️ **Ollama is not running!**

Please start Ollama in a separate terminal:

\`\`\`bash
ollama serve
\`\`\`

Then download a model (if you haven't already):

\`\`\`bash
ollama pull llama3.1
\`\`\`

After that, refresh this page and try again!`;
    }
    
    return `⚠️ **Error connecting to AI backend**

${error instanceof Error ? error.message : 'Unknown error'}

Make sure:
1. Ollama is running: \`ollama serve\`
2. A model is downloaded: \`ollama pull llama3.1\`
3. Ollama is accessible at ${OLLAMA_URL}`;
  }
}

// Check if Ollama is available
export async function checkOllamaStatus(): Promise<{ available: boolean; models: string[] }> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    if (!response.ok) {
      return { available: false, models: [] };
    }
    const data = await response.json();
    const models = data.models?.map((m: any) => m.name) || [];
    return { available: true, models };
  } catch {
    return { available: false, models: [] };
  }
}

// Get list of available models
export async function getAvailableModels(): Promise<string[]> {
  const { models } = await checkOllamaStatus();
  return models;
}
