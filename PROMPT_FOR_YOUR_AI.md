# 📋 Copy This Prompt to Your AI

## Give this exact instruction to your AI assistant:

---

```
I need you to fix the OpenAI Platform so it uses a real AI backend instead of template responses.

The problem: The chat is showing generic canned responses from codeGenerator.ts instead of real AI with the RULE_BOOK personality.

The solution: Connect Ollama (local AI) to the frontend.

Please make these changes:

1. Create src/utils/aiBackend.ts with this code:

```typescript
const OLLAMA_URL = 'http://localhost:11434';
const MODEL = 'llama3.1';

export async function sendMessageToAI(
  message: string,
  systemPrompt: string,
  conversationHistory: Array<{role: 'user' | 'assistant', content: string}>
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
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.message.content;
  } catch (error) {
    console.error('AI backend error:', error);
    return `⚠️ AI backend not available. Please start Ollama:\n\n\`\`\`bash\nollama serve\n\`\`\`\n\nAnd download a model:\n\n\`\`\`bash\nollama pull llama3.1\n\`\`\``;
  }
}
```

2. Update src/App.tsx - replace the handleSendMessage function with:

```typescript
import { sendMessageToAI } from './utils/aiBackend';
import { getSystemPrompt } from './utils/systemPrompt';

const handleSendMessage = async (content: string) => {
  const userMsg: ChatMessage = {
    id: crypto.randomUUID(), role: 'user', content, timestamp: new Date(),
  };
  setMessages(prev => [...prev, userMsg]);
  setIsAIBusy(true);
  setAiStatus('Thinking...');

  const systemPrompt = getSystemPrompt();
  const history = messages.map(m => ({
    role: m.role as 'user' | 'assistant',
    content: m.content
  }));

  try {
    const aiResponse = await sendMessageToAI(content, systemPrompt, history);
    const aiMsg: ChatMessage = {
      id: crypto.randomUUID(), role: 'assistant',
      content: aiResponse, timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiMsg]);
  } catch (error) {
    const errorMsg: ChatMessage = {
      id: crypto.randomUUID(), role: 'assistant',
      content: '⚠️ Error connecting to AI. Make sure Ollama is running.',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, errorMsg]);
  }

  setIsAIBusy(false);
  setAiStatus('');
};
```

3. Make sure these imports are at the top of App.tsx:
- import { sendMessageToAI } from './utils/aiBackend';
- import { getSystemPrompt } from './utils/systemPrompt';

After making these changes, I'll need to:
1. Install Ollama from https://ollama.com
2. Run: ollama pull llama3.1
3. Run: ollama serve
4. Then the chat will use real AI with the RULE_BOOK personality!

Please implement these changes now.
```

---

## 🚀 After Your AI Makes the Changes

Run these commands:

```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Start the app
npm run dev

# Open browser
http://localhost:5173
```

Now when you type "hi" in chat, you'll get a REAL AI response with the "roided up Opus" personality from the RULE_BOOK!

---

## ✅ What This Fixes

- ✅ Real AI responses (not templates)
- ✅ RULE_BOOK personality active
- ✅ Conversation memory
- ✅ Contextual, unique responses
- ✅ No more generic "I've generated code" messages

---

## 🎯 Quick Test

After setup, try these:

```
Type: "hi"
Expected: Friendly, personalized greeting with personality

Type: "build a todo app"
Expected: Detailed, thoughtful response about building a production-ready todo app

Type: "what's your personality?"
Expected: Response reflecting the RULE_BOOK principles
```

---

**That's it! Give the prompt above to your AI and it will fix everything.** 🚀
