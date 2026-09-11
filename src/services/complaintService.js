const crypto = require('crypto');
const { readData, writeData } = require('../utils/storage');
const { analyzeComplaint, analyzeImage } = require('./aiService');
const { createIncidentFromComplaint } = require('./incidentService');

const COMPLAINTS_FILE = 'complaints.json';
const departments = {
    Cleanliness: 'Housekeeping',
    Electrical: 'Electrical',
    Security: 'Security',
    Medical: 'Medical',
    Catering: 'Catering',
    Ticketing: 'Customer Service',
    Other: 'Customer Service'
};

function getDepartment(category) {
    return departments[category] || departments.Other;
}

function generateId() {
    return 'CMP-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

function validateComplaint(data) {
    if (!data.complainantName) throw new Error('Complainant name is required.');
    if (!data.trainNumber) throw new Error('Train number/name is required.');
    if (!data.coach) throw new Error('Coach is required.');
    if (!data.station) throw new Error('Station/location is required.');
    if (!data.description) throw new Error('Complaint description is required.');
}

async function createComplaint(data) {
    validateComplaint(data);

    const complaints = readData(COMPLAINTS_FILE);
    const analysis = data.analysis || await analyzeComplaint(data.description);
    const imageAnalysis = data.imagePath ? await analyzeImage(data.imagePath) : null;
    const escalated = analysis.priority === 'CRITICAL';
    const department = escalated ? 'Control Room' : getDepartment(analysis.category);
    
    const newComplaint = {
        id: generateId(),
        status: 'REGISTERED',
        createdAt: data.timestamp || new Date().toISOString(),
        complainantName: data.complainantName,
        phoneEmail: data.phoneEmail || null,
        trainNumber: data.trainNumber,
        pnr: data.pnr || null,
        coach: data.coach,
        seat: data.seat || null,
        station: data.station,
        description: data.description,
        imagePath: data.imagePath || null,
        videoPath: data.videoPath || null,
        imageAnalysis,
        category: analysis.category,
        priority: analysis.priority,
        sentiment: analysis.sentiment,
        department,
        assignedDepartment: department,
        escalated,
        reason: analysis.reason,
        suggestedResponse: analysis.suggestedResponse || null,
        aiAnalysis: analysis
    };

    complaints.push(newComplaint);
    
    const saved = writeData(COMPLAINTS_FILE, complaints);
    if (!saved) {
        throw new Error('Failed to save complaint to storage.');
    }

    createIncidentFromComplaint(newComplaint);
    return newComplaint;
}

function getComplaints() {
    return readData(COMPLAINTS_FILE);
}

function getComplaintById(id) {
    const complaints = readData(COMPLAINTS_FILE);
    const complaint = complaints.find(item => item.id === id);
    if (!complaint) throw new Error(`Complaint with ID ${id} not found.`);
    return complaint;
}

function updateComplaintStatus(id, status) {
    const complaints = readData(COMPLAINTS_FILE);
    const index = complaints.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Complaint with ID ${id} not found.`);
    
    complaints[index].status = status;
    
    const saved = writeData(COMPLAINTS_FILE, complaints);
    if (!saved) {
        throw new Error('Failed to update complaint status in storage.');
    }

    return complaints[index];
}

module.exports = {
    createComplaint,
    getDepartment,
    getComplaints,
    getComplaintById,
    updateComplaintStatus
};
