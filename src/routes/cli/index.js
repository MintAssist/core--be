#!/usr/bin/env node
require("@knfs-tech/bamimi-autoload")
const { Command } = require("commander");
const program = new Command();

const jobCommand = require("../../kernel/cronjobs");

const boCommand = require("../../portals/bo/cli")

program
    .addCommand(jobCommand)

program
    .addCommand(boCommand)

program.parse(process.argv);
