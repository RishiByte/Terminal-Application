const fs = require('fs');
const path = require('path');

const fallbackAnalysis = {
	category: 'Other',
	priority: 'MEDIUM',
	sentiment: 'NEUTRAL',
	department: 'Customer Service',
	reason: 'AI analysis was unavailable'
};

async function analyzeImage(imagePath) {
	if (!fs.existsSync(imagePath)) throw new Error('Image file not found.');

	const file = fs.statSync(imagePath);
	const fileInfo = {
		filename: path.basename(imagePath),
		extension: path.extname(imagePath),
		fileSize: file.size
	};

	const apiUrl = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions';
	if (!process.env.AI_API_KEY || !apiUrl.includes('openai.com')) {
		return { issue: 'Image AI not available', severity: 'UNKNOWN', text: '', ...fileInfo };
	}

	try {
		const image = fs.readFileSync(imagePath).toString('base64');
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.AI_API_KEY}`
			},
			body: JSON.stringify({
				model: process.env.AI_MODEL || 'gpt-4o-mini',
				response_format: { type: 'json_object' },
				messages: [{
					role: 'user',
					content: [
						{ type: 'text', text: 'Return only JSON with keys issue, severity, and text. Identify the likely issue, severity, and any visible text in this image.' },
						{ type: 'image_url', image_url: { url: `data:image/${fileInfo.extension.slice(1)};base64,${image}` } }
					]
				}]
			})
		});

		if (!response.ok) throw new Error('Image AI request failed');
		const result = await response.json();
		return { ...JSON.parse(result.choices[0].message.content), ...fileInfo };
	} catch (error) {
		return { issue: 'Image analysis unavailable', severity: 'UNKNOWN', text: '', ...fileInfo };
	}
}

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

module.exports = { analyzeComplaint, analyzeImage };
