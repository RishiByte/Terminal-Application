const crypto = require('crypto');
const { readData, writeData } = require('../utils/storage');

const COMPLAINTS_FILE = 'complaints.json';

function generateId() {
    return 'CMP-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

function createComplaint(data) {
    if (!data.complainantName) throw new Error("Complainant name is required.");
    if (!data.trainNumber) throw new Error("Train number/name is required.");
    if (!data.coach) throw new Error("Coach is required.");
    if (!data.station) throw new Error("Station/location is required.");
    if (!data.description) throw new Error("Complaint description is required.");

    const complaints = readData(COMPLAINTS_FILE);
    
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
        // AI fields to be populated later
        category: null,
        priority: null,
        assignedDepartment: null
    };

    complaints.push(newComplaint);
    
    if (writeData(COMPLAINTS_FILE, complaints)) {
        return newComplaint;
    } else {
        throw new Error("Failed to save complaint to storage.");
    }
}

function getComplaints() {
    return readData(COMPLAINTS_FILE);
}

function getComplaintById(id) {
    const complaints = readData(COMPLAINTS_FILE);
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) throw new Error(`Complaint with ID ${id} not found.`);
    return complaint;
}

function updateComplaintStatus(id, status) {
    const complaints = readData(COMPLAINTS_FILE);
    const index = complaints.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Complaint with ID ${id} not found.`);
    
    complaints[index].status = status;
    
    if (writeData(COMPLAINTS_FILE, complaints)) {
        return complaints[index];
    } else {
        throw new Error("Failed to update complaint status in storage.");
    }
}

module.exports = {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaintStatus
};
