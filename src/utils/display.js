const chalk = require('chalk');

function showSuccess(message) {
    console.log(chalk.green(`✔ ${message}`));
}

function showError(message) {
    console.log(chalk.red(`✖ ${message}`));
}

function showInfo(message) {
    console.log(chalk.blue(`ℹ ${message}`));
}

function showWarning(message) {
    console.log(chalk.yellow(`⚠ ${message}`));
}

function printConfirmation(complaint) {
    console.log('\n' + chalk.bold.cyan('══════════════════════════════════════════'));
    console.log(chalk.bold.cyan('          COMPLAINT CONFIRMATION'));
    console.log(chalk.bold.cyan('══════════════════════════════════════════'));
    console.log('');
    console.log(`${chalk.bold('Complaint ID:')}   ${chalk.green(complaint.id)}`);
    console.log(`${chalk.bold('Status:')}         ${chalk.yellow(complaint.status)}`);
    if (complaint.category) console.log(`${chalk.bold('Category:')}       ${complaint.category}`);
    if (complaint.priority) console.log(`${chalk.bold('Priority:')}       ${complaint.priority}`);
    if (complaint.assignedDepartment) console.log(`${chalk.bold('Department:')}     ${complaint.assignedDepartment}`);
    console.log('');
    console.log(`${chalk.bold('Next Step:')}      Your complaint is being analyzed and routed.`);
    console.log(chalk.bold.cyan('══════════════════════════════════════════') + '\n');
}

function printComplaintDetails(complaint) {
    console.log('\n' + chalk.bold.blue('══════════════════════════════════════════'));
    console.log(chalk.bold.blue(`          COMPLAINT ${complaint.id}`));
    console.log(chalk.bold.blue('══════════════════════════════════════════'));
    console.log('');
    console.log(`${chalk.bold('Name:')}         ${complaint.complainantName}`);
    if (complaint.phoneEmail) console.log(`${chalk.bold('Contact:')}      ${complaint.phoneEmail}`);
    console.log(`${chalk.bold('Train:')}        ${complaint.trainNumber}`);
    if (complaint.pnr) console.log(`${chalk.bold('PNR:')}          ${complaint.pnr}`);
    console.log(`${chalk.bold('Coach:')}        ${complaint.coach}`);
    if (complaint.seat) console.log(`${chalk.bold('Seat:')}         ${complaint.seat}`);
    console.log(`${chalk.bold('Station:')}      ${complaint.station}`);
    console.log(`${chalk.bold('Status:')}       ${chalk.yellow(complaint.status)}`);
    console.log(`${chalk.bold('Created:')}      ${new Date(complaint.createdAt).toLocaleString()}`);
    console.log('');
    console.log(`${chalk.bold('Description:')}`);
    console.log(`  ${complaint.description}`);
    console.log(chalk.bold.blue('══════════════════════════════════════════') + '\n');
}

function printComplaintList(complaints) {
    if (complaints.length === 0) {
        showInfo('No complaints found.');
        return;
    }
    console.log('\n' + chalk.bold.blue('ID            | Status     | Train | Coach | Name'));
    console.log(chalk.gray('─────────────────────────────────────────────────────────────'));
    complaints.forEach(c => {
        console.log(`${c.id.padEnd(13)} | ${c.status.padEnd(10)} | ${c.trainNumber.padEnd(5)} | ${c.coach.padEnd(5)} | ${c.complainantName}`);
    });
    console.log('');
}

module.exports = {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    printConfirmation,
    printComplaintDetails,
    printComplaintList
};
