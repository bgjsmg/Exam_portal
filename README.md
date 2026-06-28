# Interactive Python Descriptive Examination Portal

A single-file, browser-based examination portal for Python descriptive questions, evaluated automatically using the Groq LLM API (free tier).

---

## 📁 Project Structure

```
exam-portal/
├── index.html                  ← Main portal (single HTML file)
├── netlify.toml                ← Netlify deployment config
├── netlify/
│   └── functions/
│       └── evaluate.js         ← Serverless API proxy (keeps API key secure)
└── README.md
```

---

## 🚀 Quick Start (No Server Needed)

1. Open `index.html` directly in Chrome, Edge, or Firefox.
2. On the home screen, enter your **Groq API key** (free at https://console.groq.com).
3. Click **Save Configuration**.
4. Use **Student Login** to attempt the exam, or **Teacher Login** (credentials below) to manage it.

> ⚠️ When running locally, the API key is stored in your browser's LocalStorage.  
> For production, deploy to Netlify and use the serverless function proxy (see below).

---

## 👩‍🏫 Teacher Credentials

| Field    | Value     |
|----------|-----------|
| Username | `teacher` |
| Password | `pass123` |

To change credentials, edit the `TEACHER_CREDS` object in `index.html`.

---

## 🌐 Deploy to Netlify (Recommended for production)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial exam portal"
git remote add origin https://github.com/YOUR_USERNAME/exam-portal.git
git push -u origin main
```

### Step 2 — Connect to Netlify
1. Go to https://netlify.com → **Add new site** → **Import from Git**
2. Select your GitHub repo
3. Build settings:
   - **Publish directory:** `.`  (root)
   - **Functions directory:** `netlify/functions`

### Step 3 — Set Environment Variable
In Netlify → Site Settings → **Environment Variables**:
```
GROQ_API_KEY = gsk_your_actual_key_here
GROQ_MODEL   = llama3-8b-8192   (optional)
```

### Step 4 — Update index.html for server-side proxy
In `index.html`, find the `evaluateAnswer` function and change the fetch URL from:
```
https://api.groq.com/openai/v1/chat/completions
```
to:
```
/api/evaluate
```
And simplify the body to `{ question, modelAnswer, studentAnswer, maxMarks }`.

---

## 🎓 Exam Details

| Property      | Value                              |
|---------------|------------------------------------|
| Subject       | Python Programming                 |
| Questions     | 10 descriptive questions           |
| Total Marks   | 100                                |
| Time Limit    | None                               |
| Attempts      | One per browser (Register Number)  |
| Evaluation    | Groq LLM API (Llama 3 / Mixtral)   |
| Storage       | Browser LocalStorage               |

### Mark Distribution

| Q  | Topic                             | Marks |
|----|-----------------------------------|-------|
| 1  | Python & Sequence Data Types      | 10    |
| 2  | Arithmetic Operators              | 10    |
| 3  | Logical / Membership / Identity   | 10    |
| 4  | if-elif-else                      | 10    |
| 5  | while & for loops                 | 10    |
| 6  | Triangle Programs                 | 15    |
| 7  | break, continue, pass             | 10    |
| 8  | Functions & Pass by Value/Ref     | 10    |
| 9  | Types of Parameters               | 5     |
| 10 | map(), filter(), reduce()         | 10    |

---

## 🔑 Free LLM APIs Supported

| Provider     | Free Tier       | Sign-up Link                        |
|--------------|-----------------|-------------------------------------|
| **Groq**     | ✅ Generous      | https://console.groq.com            |
| OpenRouter   | ✅ Limited       | https://openrouter.ai               |
| Gemini       | ✅ Available     | https://aistudio.google.com         |
| Hugging Face | ✅ Limited       | https://huggingface.co              |

The portal is pre-configured for **Groq** (fastest free option).

---

## 🔒 Security Notes

- Never embed an API key directly in `index.html` for production.
- Use the `netlify/functions/evaluate.js` proxy to keep the key server-side.
- Teacher password should be changed before production use.

---

## 📋 Features

- ✅ Single HTML file — no build step required
- ✅ Teacher: lock/unlock exam, view all results, reset data
- ✅ Student: one-attempt enforcement by Register Number
- ✅ LLM evaluates each answer with marks + feedback
- ✅ Question-wise breakdown with grade and percentage
- ✅ Responsive UI (mobile-friendly)
- ✅ Works on Chrome, Edge, Firefox
- ✅ Free deployment on Netlify or GitHub Pages
