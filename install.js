
import { exec } from "child_process";

// global console, process

(function install() {
    // do not remove the following comment
    const //exec = require("child_process").exec,
        moduleType = "module",
        // eslint-disable-next-line no-undef
        logger = console.log,
        // eslint-disable-next-line no-undef
        start = process.hrtime.bigint(),
        steps = [
            "npm install",
            "npx swc ./lib -d ./js --ignore servers, compose", // build
            "node js/lib/index.js create_server default_server", // config file
        ],
        text = {
            angry    : "\u001b[1m\u001b[31m",
            bold     : "\u001b[1m",
            cyan     : "\u001b[36m",
            green    : "\u001b[32m",
            none     : "\u001b[0m",
            underline: "\u001b[4m"
        },
        // eslint-disable-next-line no-undef
        dir = process.argv[1].replace(/(\\|\/)install(\.js)?$/, "");
    let step = 0,
        len = steps.length;
    logger("");
    logger(`${text.underline}Webserver - Installation${text.none}`);

    // do not install dependencies
    // eslint-disable-next-line no-undef
    if (process.argv.indexOf("no_package") > -1) {
        steps.splice(0, 1);
        len = len - 1;
    }

    // run this script
    (function install_execute() {
        logger(`Executing step ${step + 1} of ${len}: ${text.cyan + steps[step] + text.none}`);
        exec(steps[step], {
            cwd: dir
        }, function install_execute_callback(err, stdout, stderr) {
            if (err === null) {
                step = step + 1;
                if (step === len) {
                    // eslint-disable-next-line no-undef
                    const end = (Number(process.hrtime.bigint() - start) / 1000000000).toFixed(9);
                    logger("\u0007");
                    logger(`Built as module type: ${text.cyan + moduleType + text.none}`);
                    logger(`Installation complete in ${end} seconds!`);
                    logger(`To run the server execute: ${text.bold + text.green}npm run server${text.none}`);
                    logger("");
                } else {
                    install_execute();
                }
            } else {
                logger("");
                logger(`${text.angry}Error installing application on step ${step + 1}:${text.none} ${steps[step]}`);
                logger(JSON.stringify(err));
                logger("");
                logger(stderr);
                logger("");
                // eslint-disable-next-line no-undef
                process.exit(1);
            }
        });
    }());
}());