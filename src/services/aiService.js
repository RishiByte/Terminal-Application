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
	const image = fs.readFileSync(imagePath);
	const extension = path.extname(imagePath).toLowerCase();
	const metadata = {
		filename: path.basename(imagePath),
		fileType: extension.slice(1) || 'unknown',
		fileSize: file.size,
		width: null,
		height: null
	};

	if (extension === '.png' && image.toString('hex', 0, 8) === '89504e470d0a1a0a') {
		metadata.width = image.readUInt32BE(16);
		metadata.height = image.readUInt32BE(20);
	}
	if (extension === '.jpg' || extension === '.jpeg') {
		for (let offset = 2; offset < image.length - 9;) {
			if (image[offset] !== 0xff) break;
			const marker = image[offset + 1];
			const length = image.readUInt16BE(offset + 2);
			if (marker >= 0xc0 && marker <= 0xc3) {
				metadata.height = image.readUInt16BE(offset + 5);
				metadata.width = image.readUInt16BE(offset + 7);
				break;
			}
			offset += length + 2;
		}
	}

	const apiUrl = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions';
	if (!process.env.AI_API_KEY || !apiUrl.includes('openai.com')) {
		return { metadata, text: '', issue: 'Image OCR unavailable' };
	}

	try {
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
						{ type: 'text', text: 'Return only JSON with keys issue and text. Identify the likely issue and transcribe any visible text in this image.' },
						{ type: 'image_url', image_url: { url: `data:image/${metadata.fileType};base64,${image.toString('base64')}` } }
					]
				}]
			})
		});

		if (!response.ok) throw new Error('Image AI request failed');
		const result = await response.json();
		return { metadata, ...JSON.parse(result.choices[0].message.content) };
	} catch (error) {
		return { metadata, text: '', issue: 'Image OCR unavailable' };
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
