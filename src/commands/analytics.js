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

function registerAnalyticsCommand(program) {
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
