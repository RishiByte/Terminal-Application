#!/usr/bin/env node

const { Command } = require('commander');
const registerComplaintCommand = require('./commands/complaint');
const registerIncidentCommand = require('./commands/incident');
const registerAnalyticsCommand = require('./commands/analytics');
const registerChatCommand = require('./commands/chat');
const pkg = require('../package.json');

const program = new Command();

program
    .name('rail-ai')
    .description('AI-powered Railway Complaint Intelligence System')
    .version(pkg.version);

// Register commands
registerComplaintCommand(program);
registerIncidentCommand(program);
registerAnalyticsCommand(program);
registerChatCommand(program);

program
    .command('exit')
    .description('Exit the application')
    .action(() => console.log('Goodbye.'));

program.parse(process.argv);
