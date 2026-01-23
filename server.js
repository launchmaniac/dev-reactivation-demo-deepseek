require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Store conversation history per session (in-memory for demo)
const conversations = new Map();

// Initialize DeepSeek client (OpenAI-compatible API)
const deepseek = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com'
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { sessionId, message, systemMessage, promptContext, isNewConversation, model } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Initialize or reset conversation
        if (isNewConversation || !conversations.has(sessionId)) {
            conversations.set(sessionId, {
                systemMessage: systemMessage || 'You are a helpful assistant.',
                promptContext: promptContext || '',
                messages: []
            });
        }

        const conversation = conversations.get(sessionId);

        // Update system message and context if provided
        if (systemMessage) {
            conversation.systemMessage = systemMessage;
        }
        if (promptContext !== undefined) {
            conversation.promptContext = promptContext;
        }

        // Add user message to history
        conversation.messages.push({
            role: 'user',
            content: message
        });

        // Build the full system prompt (system message + context)
        let fullSystemPrompt = conversation.systemMessage;
        if (conversation.promptContext) {
            fullSystemPrompt += `\n\n--- CONTEXT & KNOWLEDGE BASE ---\n${conversation.promptContext}`;
        }

        // Build messages array for DeepSeek
        const apiMessages = [
            { role: 'system', content: fullSystemPrompt },
            ...conversation.messages
        ];

        // Call DeepSeek API - use requested model or fall back to env var or default
        const selectedModel = model || process.env.DEEPSEEK_MODEL || 'deepseek-chat';
        const completion = await deepseek.chat.completions.create({
            model: selectedModel,
            messages: apiMessages,
            max_tokens: 2000,
            temperature: 0.7
        });

        const assistantMessage = completion.choices[0].message.content;

        // Add assistant response to history
        conversation.messages.push({
            role: 'assistant',
            content: assistantMessage
        });

        res.json({
            response: assistantMessage,
            sessionId
        });

    } catch (error) {
        console.error('DeepSeek API Error:', error);
        res.status(500).json({
            error: 'Failed to get response from AI',
            details: error.message
        });
    }
});

// Clear conversation endpoint
app.post('/api/clear', (req, res) => {
    const { sessionId } = req.body;
    if (sessionId && conversations.has(sessionId)) {
        conversations.delete(sessionId);
    }
    res.json({ success: true });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasApiKey: !!process.env.DEEPSEEK_API_KEY });
});

app.listen(PORT, () => {
    console.log(`SMS Demo UI server running on http://localhost:${PORT}`);
});
