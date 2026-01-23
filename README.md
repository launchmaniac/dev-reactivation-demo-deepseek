# SMS AI Demo - Reactivation Campaign Chatbot (DeepSeek)

A demo tool that simulates AI-powered SMS conversations for client reactivation campaigns. Built with an iMessage-style interface so you can show clients exactly how the AI would text their leads.

**Powered by DeepSeek** - High-quality AI at a fraction of the cost.

## What This Does

- **iMessage-style chat interface** - Looks like a real text conversation
- **Customizable AI personality** - Set system message and context
- **Live AI responses** - Powered by DeepSeek's models
- **Typing indicator** - Shows realistic "..." when AI is responding
- **Perfect for demos** - Show clients how AI reactivation campaigns work

---

## Quick Start

### Step 1: Get a DeepSeek API Key

1. Go to [platform.deepseek.com](https://platform.deepseek.com)
2. Sign up or log in
3. Go to **API Keys**
4. Click **"Create new API key"**
5. Copy the key
6. Add credits ($5-10 is plenty for demos - DeepSeek is very affordable)

### Step 2: Deploy to Render (Free)

1. **Fork this repo** to your own GitHub account

2. Go to [render.com](https://render.com) and sign up with GitHub

3. Click **"New" → "Web Service"**

4. Select this repo from the list

5. Configure the service:
   - **Name:** `your-demo-name` (this becomes your URL)
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`

6. Add Environment Variable:
   - Click **"Add Environment Variable"**
   - **Key:** `DEEPSEEK_API_KEY`
   - **Value:** *(paste your DeepSeek API key)*

7. Select **Free** tier

8. Click **"Create Web Service"**

9. Wait 1-2 minutes for deployment

10. Your demo is live at `https://your-demo-name.onrender.com`

---

## How to Use

1. **Open the sidebar** (hamburger menu, top-left)

2. **Configure the AI:**
   - **Business Name** - The company name (shows in chat header)
   - **Customer Name** - The lead's name (AI uses this to personalize)
   - **AI Model** - Choose between DeepSeek Chat or Reasoner (R1)
   - **System Message** - AI personality, tone, and rules
   - **Prompt/Context** - Customer details, services, promos, appointment slots

3. **Click "Apply & Start New Chat"** - AI sends the first outreach message

4. **Type responses** as the customer to demo the conversation

---

## DeepSeek Models

| Model | Best For | Speed | Cost |
|-------|----------|-------|------|
| `deepseek-chat` | General conversations, SMS demos | Fast | Very low |
| `deepseek-reasoner` | Complex reasoning, multi-step tasks | Slower | Low |

---

## Customization Examples

### System Message (Personality & Rules)
```
You are a friendly SMS assistant for [Business Name], reaching out to past customers.

Your goal is to:
- Be warm, professional, and concise (SMS style)
- Remind them it's been a while since their last service
- Offer a special discount for returning customers
- Try to book an appointment

Keep messages under 160 characters. Be conversational, not salesy.
```

### Prompt/Context (Knowledge Base)
```
Customer Info:
- Last service: March 2024 (AC tune-up)
- Equipment: Carrier central AC

Current Promotions:
- 15% off tune-ups for returning customers
- Free inspection with any repair

Available appointments:
- Tuesday 2-4pm
- Thursday 10am-12pm
```

---

## Running Locally (Optional)

If you want to run it on your computer instead of deploying:

1. Clone the repo
2. Run `npm install`
3. Create a `.env` file:
   ```
   DEEPSEEK_API_KEY=your-key-here
   ```
4. Run `node server.js`
5. Open `http://localhost:3000`

---

## Tech Stack

- **Backend:** Node.js + Express
- **AI:** DeepSeek (OpenAI-compatible API)
- **Frontend:** Vanilla HTML/CSS/JS
- **Styling:** iMessage-inspired design

---

## Cost Comparison

| Provider | Cost per 1M tokens (input) | Cost per 1M tokens (output) |
|----------|---------------------------|------------------------------|
| DeepSeek | ~$0.14 | ~$0.28 |
| GPT-4o | ~$2.50 | ~$10.00 |
| GPT-4.1 | ~$2.00 | ~$8.00 |

**DeepSeek is ~10-30x cheaper** than OpenAI for comparable quality.

---

## Questions?

Built by Launch Maniac. For support: support@launchmaniac.com
