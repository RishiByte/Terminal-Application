const fallbackAnalysis = {
	category: 'Other',
	priority: 'MEDIUM',
	sentiment: 'NEUTRAL',
	department: 'Customer Service',
	reason: 'AI analysis was unavailable'
};

async function analyzeComplaint(description) {
	try {
		if (!process.env.AI_API_KEY) return fallbackAnalysis;

		const response = await fetch(process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.AI_API_KEY}`
			},
			body: JSON.stringify({
				model: process.env.AI_MODEL || 'gpt-4o-mini',
				temperature: 0,
				response_format: { type: 'json_object' },
				messages: [{
					role: 'user',
					content: `Analyze this railway complaint and return only JSON with these keys: category, priority, sentiment, department, reason. Priority must be LOW, MEDIUM, HIGH, or CRITICAL. Sentiment must be POSITIVE, NEUTRAL, or NEGATIVE. Reason must be short. Complaint: ${description}`
				}]
			})
		});

		if (!response.ok) throw new Error('AI request failed');
		const result = await response.json();
		return JSON.parse(result.choices[0].message.content);
	} catch (error) {
		return fallbackAnalysis;
	}
}

module.exports = { analyzeComplaint };
