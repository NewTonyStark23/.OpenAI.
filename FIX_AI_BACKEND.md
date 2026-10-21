# 🔧 CRITICAL FIX: Connect Real AI Backend

## The Problem

Your chat is showing **generic template responses** instead of real AI because:
- The frontend has NO AI backend connected
- It's using `codeGenerator.ts` which returns canned responses
- The RULE_BOOK system prompt isn't being used by any real AI

## The Solution

You need to connect a **real AI model** to the frontend. Here's how:

---

## Option 1: Use Ollama (Recommended - Free & Local)

### Step 1: Install Ollama

**Mac/Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Windows:**
Download from: https://ollama.com/download

### Step 2: Download a Model

```bash
# Recommended: Llama 3.1 (8B) - Fast and capable
ollama pull llama3.1

# Or: Mistral (7B) - Good balance
ollama pull mistral

# Or: Code Llama (7B) - Better for coding
ollama pull codellama
```

### Step 3: Start Ollama Server

```bash
ollama serve
```

Ollama will run on: `http://localhost:11434`

### Step 4: Tell Your AI to Update the Frontend

Give your AI this instruction:

```
Update the OpenAI Platform frontend to connect to Ollama instead of using template responses.

Changes needed:

1. Create a new file: src/utils/aiBackend.ts

```typescript
// AI Backend Integration - Connects to Ollama
const OLLAMA_URL = 'http://localhost:11434';
const MODEL = 'llama3.1'; // or 'mistral', 'codellama'

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
    return `⚠️ AI backend not available. Make sure Ollama is running:\n\n\`\`\`bash\nollama serve\n\`\`\`\n\nAnd a model is downloaded:\n\n\`\`\`bash\nollama pull llama3.1\n\`\`\``;
  }
}
```

2. Update src/App.tsx to use the real AI:

Replace the handleSendMessage function with:

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

  // Get system prompt (RULE_BOOK)
  const systemPrompt = getSystemPrompt();
  
  // Build conversation history
  const history = messages.map(m => ({
    role: m.role as 'user' | 'assistant',
    content: m.content
  }));

  try {
    // Send to real AI
    const aiResponse = await sendMessageToAI(content, systemPrompt, history);
    
    const aiMsg: ChatMessage = {
      id: crypto.randomUUID(), role: 'assistant',
      content: aiResponse, timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiMsg]);
  } catch (error) {
    const errorMsg: ChatMessage = {
      id: crypto.randomUUID(), role: 'assistant',
      content: '⚠️ Error connecting to AI backend. Check console for details.',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, errorMsg]);
  }

  setIsAIBusy(false);
  setAiStatus('');
};
```

3. Add CORS support to Ollama (if needed):

Create a file ~/.ollama/config.json:

```json
{
  "origins": ["http://localhost:5173"]
}
```

Then restart Ollama.
```

### Step 5: Test It

1. Start Ollama: `ollama serve`
2. Start frontend: `npm run dev`
3. Open http://localhost:5173
4. Type "hi" in chat
5. You should get a REAL AI response with the RULE_BOOK personality!

---

## Option 2: Use OpenAI API

If you have an OpenAI API key:

Tell your AI:

```
Update src/utils/aiBackend.ts to use OpenAI API:

```typescript
const OPENAI_API_KEY = 'your-api-key-here'; // Store in .env file

export async function sendMessageToAI(
  message: string,
  systemPrompt: string,
  conversationHistory: Array<{role: 'user' | 'assistant', content: string}>
): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4', // or 'gpt-3.5-turbo'
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('AI backend error:', error);
    return `⚠️ Error connecting to OpenAI. Check your API key and internet connection.`;
  }
}
```

Store your API key in .env:

```
VITE_OPENAI_API_KEY=sk-your-key-here
```
```

---

## Option 3: Use Claude API

If you have an Anthropic API key:

Tell your AI:

```
Update src/utils/aiBackend.ts to use Claude API:

```typescript
const ANTHROPIC_API_KEY = 'your-api-key-here';

export async function sendMessageToAI(
  message: string,
  systemPrompt: string,
  conversationHistory: Array<{role: 'user' | 'assistant', content: string}>
): Promise<string> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        system: systemPrompt,
        messages: [
          ...conversationHistory,
          { role: 'user', content: message }
        ],
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`Claude error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('AI backend error:', error);
    return `⚠️ Error connecting to Claude. Check your API key.`;
  }
}
```
```

---

## 🎯 What This Fixes

After connecting a real AI backend:

✅ Chat will use the RULE_BOOK personality  
✅ Responses will be unique and contextual  
✅ AI will remember conversation history  
✅ "Roided up Opus" mentality will be active  
✅ No more generic template responses  

---

## 🚀 Quick Start (Ollama)

```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Start frontend
npm run dev

# Open browser
http://localhost:5173

# Test
Type: "hi"
Expected: Real AI response with personality!
```

---

## 📋 Summary

**The Problem:** Frontend uses template responses, not real AI  
**The Solution:** Connect Ollama/OpenAI/Claude backend  
**The Result:** Real AI with RULE_BOOK personality  

**Give your AI the instructions above and it will fix the issue!**
