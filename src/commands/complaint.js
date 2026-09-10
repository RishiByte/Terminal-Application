const { createComplaint, getComplaints, getComplaintById, updateComplaintStatus } = require('../services/complaintService');
const { analyzeImage } = require('../services/aiService');
const { showError, showSuccess, printConfirmation, printComplaintDetails, printComplaintList } = require('../utils/display');

function registerComplaintCommand(program) {
    const complaintCmd = program
        .command('complaint')
        .description('Manage railway complaints');

    complaintCmd
        .command('add')
        .description('Create a new complaint')
        .requiredOption('-n, --name <name>', 'Complainant name')
        .requiredOption('-t, --train <train>', 'Train number/name')
        .requiredOption('-c, --coach <coach>', 'Coach number (e.g., B4)')
        .requiredOption('-s, --station <station>', 'Station or location')
        .requiredOption('-d, --desc <description>', 'Complaint description')
        .option('-p, --contact <contact>', 'Phone or email')
        .option('--pnr <pnr>', 'PNR number')
        .option('--seat <seat>', 'Seat number')
        .option('--image <path>', 'Optional image path')
        .option('--video <path>', 'Optional video path')
        .action(async (options) => {
            try {
                const complaintData = {
                    complainantName: options.name,
                    phoneEmail: options.contact,
                    trainNumber: options.train,
                    pnr: options.pnr,
                    coach: options.coach,
                    seat: options.seat,
                    station: options.station,
                    description: options.desc,
                    imagePath: options.image,
                    videoPath: options.video,
                    timestamp: new Date().toISOString()
                };

                const complaint = await createComplaint(complaintData);
                printConfirmation(complaint);
            } catch (error) {
                showError(error.message);
            }
        });

    complaintCmd
        .command('list')
        .description('List all complaints')
        .action(() => {
            try {
                const complaints = getComplaints();
                printComplaintList(complaints);
            } catch (error) {
                showError(error.message);
            }
        });

    complaintCmd
        .command('image <path>')
        .description('Analyze complaint image evidence')
        .action(async (imagePath) => {
            try {
                console.log(JSON.stringify(await analyzeImage(imagePath), null, 2));
            } catch (error) {
                showError(error.message);
            }
        });

    complaintCmd
        .command('view <id>')
        .description('View a specific complaint by ID')
        .action((id) => {
            try {
                const complaint = getComplaintById(id);
                printComplaintDetails(complaint);
            } catch (error) {
                showError(error.message);
            }
        });

    complaintCmd
        .command('update <id> <status>')
        .description('Update the status of a complaint')
        .action((id, status) => {
            try {
                updateComplaintStatus(id, status);
                showSuccess(`Complaint ${id} status updated to ${status}`);
            } catch (error) {
                showError(error.message);
            }
        });
}

module.exports = registerComplaintCommand;
