const crypto = require('crypto');
const { readData, writeData } = require('../utils/storage');

const INCIDENTS_FILE = 'incidents.json';
const COMPLAINTS_FILE = 'complaints.json';

function generateId() {
	return 'INC-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

function createIncident(data) {
	if (!data.category) throw new Error('Incident category is required.');

	const incidents = readData(INCIDENTS_FILE);
	const incident = {
		id: generateId(),
		category: data.category,
		location: data.location || 'Unknown',
		complaintIds: data.complaintIds || [],
		priority: data.priority || 'MEDIUM',
		status: data.status || 'OPEN',
		createdAt: data.createdAt || new Date().toISOString()
	};

	incidents.push(incident);
	if (!writeData(INCIDENTS_FILE, incidents)) throw new Error('Failed to save incident.');
	return incident;
}

function createIncidentFromComplaint(complaint) {
	const complaints = readData(COMPLAINTS_FILE);
	const categoryComplaints = complaints.filter(item => item.category === complaint.category);
	const shouldCreate = complaint.priority === 'CRITICAL' || categoryComplaints.length >= 3;
	if (!shouldCreate) return null;

	const incidents = readData(INCIDENTS_FILE);
	const existing = incidents.find(incident => incident.category === complaint.category && incident.status !== 'CLOSED');
	if (existing) {
		if (!existing.complaintIds.includes(complaint.id)) existing.complaintIds.push(complaint.id);
		if (complaint.priority === 'CRITICAL') existing.priority = 'CRITICAL';
		writeData(INCIDENTS_FILE, incidents);
		return existing;
	}

	return createIncident({
		category: complaint.category,
		location: complaint.station,
		complaintIds: categoryComplaints.map(item => item.id),
		priority: complaint.priority === 'CRITICAL' ? 'CRITICAL' : 'HIGH'
	});
}

function getIncidents() {
	return readData(INCIDENTS_FILE);
}

function getIncidentById(id) {
	const incident = getIncidents().find(item => item.id === id);
	if (!incident) throw new Error(`Incident with ID ${id} not found.`);
	return incident;
}

function updateIncidentStatus(id, status) {
	const incidents = getIncidents();
	const incident = incidents.find(item => item.id === id);
	if (!incident) throw new Error(`Incident with ID ${id} not found.`);
	incident.status = status;
	if (!writeData(INCIDENTS_FILE, incidents)) throw new Error('Failed to update incident.');
	return incident;
}

module.exports = {
	createIncident,
	createIncidentFromComplaint,
	getIncidents,
	getIncidentById,
	updateIncidentStatus
};
