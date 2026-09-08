#!/usr/bin/env node

const { Command } = require('commander');
const registerComplaintCommand = require('./commands/complaint');
const pkg = require('../package.json');

const program = new Command();

program
    .name('rail-ai')
    .description('AI-powered Railway Complaint Intelligence System')
    .version(pkg.version);

// Register commands
registerComplaintCommand(program);

program.parse(process.argv);
