const {
	createIncident,
	getIncidents,
	getIncidentById,
	updateIncidentStatus
} = require('../services/incidentService');
const { showError, showSuccess } = require('../utils/display');

function printIncident(incident) {
	console.log(`\n${incident.id} | ${incident.category} | ${incident.priority} | ${incident.status}`);
	console.log(`Location: ${incident.location}`);
	console.log(`Complaints: ${incident.complaintIds.join(', ') || 'None'}`);
	console.log(`Created: ${new Date(incident.createdAt).toLocaleString()}\n`);
}

function registerIncidentCommand(program) {
	const incidentCmd = program
		.command('incident')
		.description('Manage railway incidents');

	incidentCmd.command('create')
		.description('Create an incident')
		.requiredOption('-c, --category <category>', 'Incident category')
		.option('-l, --location <location>', 'Incident location')
		.option('-p, --priority <priority>', 'Incident priority', 'MEDIUM')
		.option('--complaints <ids>', 'Comma-separated complaint IDs')
		.action(options => {
			try {
				const incident = createIncident({
					category: options.category,
					location: options.location,
					priority: options.priority,
					complaintIds: options.complaints ? options.complaints.split(',') : []
				});
				printIncident(incident);
			} catch (error) {
				showError(error.message);
			}
		});

	incidentCmd.command('list')
		.description('List all incidents')
		.action(() => {
			getIncidents().forEach(printIncident);
		});

	incidentCmd.command('view <id>')
		.description('View an incident')
		.action(id => {
			try {
				printIncident(getIncidentById(id));
			} catch (error) {
				showError(error.message);
			}
		});

	incidentCmd.command('update <id> <status>')
		.description('Update incident status')
		.action((id, status) => {
			try {
				updateIncidentStatus(id, status);
				showSuccess(`Incident ${id} status updated to ${status}`);
			} catch (error) {
				showError(error.message);
			}
		});
}

module.exports = registerIncidentCommand;
