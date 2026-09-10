const chalk = require('chalk');
const { readData } = require('../utils/storage');

function countBy(complaints, field, fallback) {
	return complaints.reduce((counts, complaint) => {
		const value = complaint[field] || fallback;
		counts[value] = (counts[value] || 0) + 1;
		return counts;
	}, {});
}

function printCounts(title, counts) {
	console.log(`\n${chalk.bold(title + ':')}`);
	Object.entries(counts).forEach(([name, count]) => console.log(`${name}: ${count}`));
}

function predictIssues() {
	const complaints = readData('complaints.json');
	const groups = {};

	complaints.forEach(complaint => {
		const key = `${complaint.category || 'Other'}|${complaint.trainNumber}|${complaint.coach}`;
		if (!groups[key]) groups[key] = [];
		groups[key].push(complaint);
	});

	return Object.values(groups)
		.filter(group => group.length >= 3)
		.map(group => {
			const first = group[0];
			const riskScore = Math.min(group.length * 10, 100);
			return {
				category: first.category || 'Other',
				train: first.trainNumber,
				coach: first.coach,
				complaints: group.length,
				riskScore,
				status: riskScore >= 70 ? 'HIGH RISK' : 'RECURRING ISSUE',
				recommendation: `Inspect the ${(first.category || 'general').toLowerCase()} system in this coach.`
			};
		});
}

function printPredictions() {
	console.log('\n' + chalk.bold.cyan('PREDICTIVE MAINTENANCE'));
	const issues = predictIssues();
	if (issues.length === 0) {
		console.log('No recurring issues found.');
		return;
	}
	issues.forEach(issue => {
		console.log(`\nTrain: ${issue.train}`);
		console.log(`Coach: ${issue.coach}`);
		console.log(`Issue: ${issue.category}`);
		console.log(`Complaints: ${issue.complaints}`);
		console.log(`Risk Score: ${issue.riskScore}`);
		console.log(`Status: ${issue.status}`);
		console.log(`Recommendation: ${issue.recommendation}`);
	});
}

function registerAnalyticsCommand(program) {
	program
		.command('predict')
		.description('Show recurring issues and maintenance risks')
		.action(printPredictions);

	program
		.command('analytics')
		.alias('dashboard')
		.description('Show complaint analytics dashboard')
		.action(() => {
			const complaints = readData('complaints.json');
			const resolved = complaints.filter(complaint => complaint.status === 'RESOLVED').length;
			const critical = complaints.filter(complaint => complaint.priority === 'CRITICAL').length;

			console.log('\n' + chalk.bold.cyan('RAIL MADAD DASHBOARD'));
			console.log('══════════════════════════════════');
			console.log(`Total Complaints: ${complaints.length}`);
			console.log(`Open: ${complaints.length - resolved}`);
			console.log(`Resolved: ${resolved}`);
			console.log(`Critical: ${critical}`);

			printCounts('By Category', countBy(complaints, 'category', 'Other'));
			printCounts('By Department', countBy(complaints, 'department', 'Customer Service'));
			printCounts('By Priority', countBy(complaints, 'priority', 'MEDIUM'));
			console.log('');
		});
}

module.exports = registerAnalyticsCommand;
module.exports.predictIssues = predictIssues;
