# Rail-AI

Rail-AI is a small Node.js terminal application for registering and managing railway passenger complaints. It can use an OpenAI-compatible API for complaint analysis, assistant suggestions, and image OCR. It also includes simple rule-based routing, incident detection, analytics, and predictive-maintenance checks.

## Features

- Register, list, view, and update complaints
- AI complaint analysis for category, priority, sentiment, department, and reason
- Simple category-based department routing
- Critical and repeated-category incident creation
- Terminal analytics dashboard
- Rule-based recurring issue and maintenance-risk detection
- Image metadata and optional AI OCR/image analysis
- One-shot AI complaint assistant with confirmation before saving
- JSON file storage in `data/`

## Installation

Requirements: Node.js 18 or newer.

```bash
npm install
```

## AI Setup

AI features work with an OpenAI-compatible chat completions endpoint. Without an API key, complaint analysis and the assistant use simple fallback values, while image analysis returns metadata with empty OCR text.

Create a `.env` file:

```env
AI_API_KEY=your_api_key_here
AI_API_URL=https://api.openai.com/v1/chat/completions
AI_MODEL=gpt-4o-mini
```

The project does not load `.env` files automatically. Load it in the shell before running the app:

```bash
set -a
source .env
set +a
```

Never commit real API keys.

## Commands

Run commands with:

```bash
node src/index.js <command>
```

Complaint management:

```bash
node src/index.js complaint add --name "Riya" --train 12951 --coach B4 --station "New Delhi" --desc "The AC is not working"
node src/index.js complaint list
node src/index.js complaint view CMP-XXXXXXXX
node src/index.js complaint update CMP-XXXXXXXX RESOLVED
node src/index.js complaint image ./evidence.png
```

Other features:

```bash
node src/index.js analytics
node src/index.js dashboard
node src/index.js incident create --category Security --location "Coach B4"
node src/index.js incident list
node src/index.js incident view INC-XXXXXXXX
node src/index.js incident update INC-XXXXXXXX CLOSED
node src/index.js predict
node src/index.js chat
node src/index.js exit
```

`chat` asks for a complaint description, displays the AI result and suggested response, then asks whether to register it. A confirmed chat complaint uses `Unknown` for train, coach, and station because those details are not collected by the simple assistant flow.

## Example Workflow

```bash
# Install dependencies
npm install

# Load optional AI settings
set -a; source .env; set +a

# Register a complaint with optional evidence
node src/index.js complaint add \
  --name "Riya" \
  --train 12951 \
  --coach B4 \
  --station "New Delhi" \
  --desc "The AC is not working" \
  --image ./evidence.png

# Review operations
node src/index.js analytics
node src/index.js incident list
node src/index.js predict
```

## Limitations

- This is a local JSON-file application, not a multi-user database system.
- AI results depend on the configured provider, model, network, and API key.
- Without an API key, fallback values are used and OCR text is empty.
- Image OCR uses the existing AI provider when it supports image input; there is no separate OCR or computer-vision pipeline.
- Predictive maintenance is an explainable rule: three matching category/train/coach complaints create a recurring issue, with risk equal to complaint count multiplied by 10 and capped at 100. It is not machine learning.
- Incident detection and department routing use simple rules and do not replace operational review.
- The CLI has no authentication, permissions, or encrypted storage.
