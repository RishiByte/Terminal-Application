const readline = require('readline');
const { analyzeAssistant } = require('../services/aiService');
const { createComplaint } = require('../services/complaintService');
const { showError } = require('../utils/display');

function askQuestion(reader, question) {
    return new Promise(resolve => reader.question(question, resolve));
}

function registerChatCommand(program) {
    program
        .command('chat')
        .description('Get AI help with a complaint')
        .action(async () => {
            const reader = readline.createInterface({ input: process.stdin, output: process.stdout });
            try {
                const description = (await askQuestion(reader, 'Complaint description: ')).trim();
                if (!description) throw new Error('Complaint description is required.');

                const analysis = await analyzeAssistant(description);
                console.log('\nAI ASSISTANT');
                console.log(`Category: ${analysis.category}`);
                console.log(`Priority: ${analysis.priority}`);
                console.log(`Department: ${analysis.department}`);
                console.log('\nSuggested Response:');
                console.log(`"${analysis.suggestedResponse}"`);

                const answer = (await askQuestion(reader, '\nDo you want to register this complaint? (y/n) ')).trim();
                if (answer.toLowerCase() !== 'y') {
                    console.log('Complaint was not registered.');
                    return;
                }

                const complaint = await createComplaint({
                    complainantName: 'Chat User',
                    trainNumber: 'Unknown',
                    coach: 'Unknown',
                    station: 'Unknown',
                    description,
                    analysis,
                    timestamp: new Date().toISOString()
                });
                console.log(`Complaint registered with ID: ${complaint.id}`);
            } catch (error) {
                showError(error.message);
            } finally {
                reader.close();
            }
        });
}

module.exports = registerChatCommand;