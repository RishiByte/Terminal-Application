# 🚆 RAIL-AI

### AI-Powered Railway Complaint Intelligence & Management System

> **Turn unstructured passenger complaints into actionable railway intelligence.**

RAIL-AI is a terminal-based intelligent complaint management system designed to help railway authorities **ingest, classify, prioritize, analyze, and manage passenger complaints** using Artificial Intelligence.

Instead of treating every complaint equally, RAIL-AI understands the complaint, identifies its category and severity, detects potentially critical situations, recommends appropriate actions, and provides operational insights through a powerful command-line interface.

---

## ✨ Why RAIL-AI?

Railway complaint systems receive thousands of complaints covering:

* 🚆 Train and coach issues
* 🧹 Cleanliness
* 🍱 Food quality
* 💧 Water availability
* ❄️ Air conditioning
* 🛡️ Security concerns
* 👨‍✈️ Staff behaviour
* 🚑 Medical emergencies
* ⚙️ Infrastructure failures
* 🛠️ Maintenance problems

The challenge isn't simply **storing complaints**.

The real challenge is:

> **Which complaint needs attention first, what is it about, who should handle it, and what action should be taken?**

RAIL-AI addresses this problem by transforming raw complaints into structured, prioritized operational information.

---

# 🎯 Core Objectives

RAIL-AI aims to:

1. Automatically understand passenger complaints.
2. Categorize complaints using AI.
3. Determine complaint severity and priority.
4. Extract useful information such as train, coach, issue type, and affected passengers.
5. Detect duplicate or related complaints.
6. Recommend appropriate actions.
7. Identify trains or locations experiencing unusual complaint activity.
8. Provide railway staff with a centralized terminal command center.
9. Generate concise operational reports.
10. Reduce the time required to manually process large volumes of complaints.

---

# 🧠 Key Features

## 1. 🤖 AI Complaint Classification

RAIL-AI analyzes natural-language complaints and automatically identifies their category.

Example:

```text
Passenger Complaint:

"The AC in coach B4 has stopped working and elderly
passengers are having difficulty because of the heat."
```

RAIL-AI:

```text
Category        : AC / Coach Maintenance
Priority        : CRITICAL
Sentiment       : NEGATIVE
Coach           : B4
Affected Group  : Elderly Passengers
```

---

## 2. 🚨 Intelligent Priority Detection

Not every complaint requires the same response time.

RAIL-AI assigns priority based on factors such as:

* Severity
* Number of affected passengers
* Safety implications
* Medical urgency
* Infrastructure impact
* Sentiment
* Operational disruption

Example:

```text
CRITICAL
Medical emergency
Security threat
Major infrastructure failure

HIGH
AC failure
Water shortage
Major cleanliness issue

MEDIUM
Food quality
Staff behaviour

LOW
General feedback
Minor inconvenience
```

---

## 3. 🔍 Entity Extraction

The system extracts important information from unstructured text.

```text
Input:

"Water is unavailable in coach S6 of train 12951
since the last station."

Extracted:

Train       → 12951
Coach       → S6
Issue       → Water shortage
Duration    → Since last station
Category    → Facilities
Priority    → HIGH
```

This converts human-written complaints into structured operational data.

---

## 4. 🔁 Duplicate Complaint Detection

Multiple passengers may report the same problem.

Instead of treating them as completely separate incidents, RAIL-AI can identify potentially related complaints.

Example:

```text
Complaint #1021
"AC not working in B4"

Complaint #1037
"Coach B4 AC is broken"

Complaint #1042
"Very hot inside B4, AC stopped"
```

RAIL-AI:

```text
⚠ POSSIBLE DUPLICATE INCIDENT

Likely Incident:
Train 12951 / Coach B4 / AC Failure

Affected Complaints:
3

Priority:
CRITICAL
```

This helps prevent duplicate work and highlights the scale of an incident.

---

# 🚆 Train-Level Intelligence

Railway staff can inspect complaints associated with a particular train.

```text
$ rail-ai train 12951
```

Example:

```text
╭────────────────────────────────────────────╮
│             TRAIN 12951                    │
╰────────────────────────────────────────────╯

ACTIVE COMPLAINTS       18
CRITICAL                 3
HIGH                     7
MEDIUM                   8

CRITICAL INCIDENTS
────────────────────────────────────────────

01  Medical Assistance
    Coach: B2
    Status: OPEN

02  AC Failure
    Coach: B4
    Status: IN PROGRESS

03  Security Complaint
    Coach: A1
    Status: OPEN

AI RECOMMENDATION
────────────────────────────────────────────

1. Resolve medical assistance immediately.
2. Dispatch maintenance to Coach B4.
3. Escalate security complaint to security personnel.
```

---

# 📊 Complaint Analytics

RAIL-AI provides operational statistics directly in the terminal.

```text
$ rail-ai analytics
```

Example:

```text
COMPLAINT ANALYTICS
────────────────────────────────────

Total Complaints       1,284

By Category

Cleanliness            █████████████  28%
Food                   ██████████     21%
Maintenance            ████████       17%
Facilities             ██████         13%
Security               █████          10%
Staff Behaviour        ███             7%
Other                  ██              4%
```

This allows authorities to identify recurring problems and operational bottlenecks.

---

# 🧭 Intelligent Search

Instead of relying only on rigid filters, users can query the system naturally.

```text
$ rail-ai search "critical complaints in train 12951"
```

or:

```text
$ rail-ai search "water related complaints"
```

or:

```text
$ rail-ai search "security complaints from today"
```

The system translates the query into relevant filters and returns actionable results.

---

# 📝 Automated Situation Reports

RAIL-AI can generate concise reports for railway staff.

```text
$ rail-ai report --train 12951
```

Example:

```text
══════════════════════════════════════════
        SITUATION REPORT — TRAIN 12951
══════════════════════════════════════════

Total Active Complaints       18
Critical                       3
High                           7
Medium                         8

TOP ISSUES

1. AC Failure — Coach B4
2. Medical Assistance — Coach B2
3. Water Shortage — Coach S6

IMMEDIATE ACTIONS

→ Medical assistance required in B2
→ Maintenance required in B4
→ Water supply inspection required in S6

Generated by RAIL-AI
══════════════════════════════════════════
```

---

# 🖥️ Terminal-First Experience

RAIL-AI is intentionally designed as a **CLI application**.

Instead of building another generic dashboard, the project focuses on a fast operational interface that can be used by technical and administrative staff.

Example:

```bash
rail-ai dashboard
rail-ai complaints
rail-ai complaint analyze <id>
rail-ai train <train-number>
rail-ai search "<query>"
rail-ai analytics
rail-ai report
rail-ai incidents
```

---

# 🏗️ System Architecture

```text
                  ┌─────────────────────┐
                  │   Passenger Input   │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │ Complaint Ingestion │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │   AI Processing     │
                  │                     │
                  │ • Classification    │
                  │ • Entity Extraction │
                  │ • Sentiment         │
                  │ • Priority          │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │ Incident Detection  │
                  │                     │
                  │ • Duplicates        │
                  │ • Related Issues    │
                  │ • Escalation        │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │   Decision Engine   │
                  │                     │
                  │ • Recommendations   │
                  │ • Routing           │
                  │ • Prioritization    │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │   CLI Command       │
                  │      Center         │
                  └─────────────────────┘
```

---

# 🛠️ Technology Stack

| Layer                | Technology                     |
| -------------------- | ------------------------------ |
| Language             | Python                         |
| CLI Framework        | Typer                          |
| Terminal UI          | Rich                           |
| Database             | SQLite / PostgreSQL            |
| AI Processing        | LLM API                        |
| Similarity Detection | Embeddings / Vector Similarity |
| Data Processing      | Pandas                         |
| Testing              | Pytest                         |
| Configuration        | Environment Variables          |

The architecture is intentionally modular so individual AI components can be replaced without rewriting the entire system.

---

# 📁 Project Structure

```text
rail-ai/
│
├── app/
│   ├── cli/
│   │   ├── commands.py
│   │   └── dashboard.py
│   │
│   ├── ai/
│   │   ├── classifier.py
│   │   ├── extractor.py
│   │   ├── priority.py
│   │   └── recommender.py
│   │
│   ├── incidents/
│   │   ├── detector.py
│   │   └── deduplicator.py
│   │
│   ├── database/
│   │   ├── models.py
│   │   └── repository.py
│   │
│   ├── analytics/
│   │   └── reports.py
│   │
│   └── config.py
│
├── data/
│   └── sample_complaints.json
│
├── tests/
│
├── .env.example
├── requirements.txt
├── pyproject.toml
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

* Python 3.10+
* pip
* Git
* An API key for the configured AI provider

---

## Installation

Clone the repository:

```bash
git clone https://github.com/<your-username>/rail-ai.git
cd rail-ai
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it.

### Linux / macOS

```bash
source .venv/bin/activate
```

### Windows

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# 🔐 Environment Variables

Create a `.env` file:

```env
AI_API_KEY=your_api_key_here
DATABASE_URL=sqlite:///rail_ai.db
```

> Never commit your `.env` file or API keys to version control.

---

# ▶️ Running the Application

Start the CLI:

```bash
python -m app
```

Or, if installed as a CLI package:

```bash
rail-ai
```

View available commands:

```bash
rail-ai --help
```

---

# 💻 Example Workflow

### 1. Submit a complaint

```bash
rail-ai complaint add \
  --train 12951 \
  --coach B4 \
  --text "AC has stopped working and passengers are struggling."
```

### 2. Analyze it

```bash
rail-ai complaint analyze 1021
```

### 3. View the train

```bash
rail-ai train 12951
```

### 4. View critical incidents

```bash
rail-ai incidents --priority critical
```

### 5. Generate a report

```bash
rail-ai report --train 12951
```

---

# 🧪 Testing

Run the test suite:

```bash
pytest
```

For verbose output:

```bash
pytest -v
```

---

# 🔒 Responsible AI

RAIL-AI is designed as a **decision-support system**, not an autonomous authority.

AI-generated classifications and recommendations should be reviewed by authorized railway personnel before consequential actions are taken.

The system should:

* Clearly distinguish AI-generated recommendations from verified information.
* Avoid fabricating incident details.
* Preserve the original passenger complaint.
* Provide confidence scores where appropriate.
* Allow human override of AI decisions.
* Log important classification and escalation decisions.

---

# 🎯 Future Roadmap

The current system focuses on intelligent complaint processing and operational triage.

Future versions could include:

* [ ] Real railway complaint API integration
* [ ] Multilingual complaint processing
* [ ] Hindi and regional-language support
* [ ] Voice-based complaint ingestion
* [ ] Real-time incident streaming
* [ ] Geographic incident clustering
* [ ] Predictive complaint volume analysis
* [ ] Automated department assignment
* [ ] SLA breach prediction
* [ ] SMS/email escalation
* [ ] Historical trend analysis
* [ ] Railway-zone level analytics
* [ ] Offline/local AI model support

---

# 🌍 Potential Impact

RAIL-AI can help transform railway complaint management from a **reactive ticket-processing workflow** into a more **intelligent incident-management workflow**.

Instead of simply answering:

> "How many complaints do we have?"

RAIL-AI attempts to answer:

> **"What is happening, how serious is it, where is it happening, and what should we address first?"**

That distinction is the core of the project.

---

# 🏆 Why This Project Matters

Large-scale public transportation systems generate huge amounts of unstructured feedback.

Manually reading every complaint, identifying its severity, finding related complaints, and determining the appropriate response can be slow and inconsistent.

RAIL-AI introduces an intelligent processing layer that can help staff:

**Understand → Prioritize → Correlate → Act**

The goal isn't to replace railway personnel.

The goal is to give them **better information, faster.**

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Add tests where appropriate.
5. Commit your changes.

```bash
git commit -m "feat: add complaint clustering"
```

6. Push the branch.

```bash
git push origin feature/your-feature
```

7. Open a Pull Request.

---

# 📜 License

This project is intended for educational, research, and demonstration purposes.

Add the appropriate open-source license to the repository before production use.

---

# 👥 Team

**RAIL-AI**

Built as a technology solution for intelligent railway complaint management.

---

## 🚆 RAIL-AI

**From complaints to intelligence.
From intelligence to action.**
