#!/usr/bin/env node

require('shelljs/global');

var path = require('path'),
    fs = require('fs'),
    configurationFileName = require(path.resolve('./.npmpl.json')),
    debugLogFileName = path.resolve('./npmpl-debug.log'),
    command = process.argv[2],
    option = process.argv[3];
if (!command) {
    console.log('Error: missing command.');
    console.log('Syntax:');
    console.log('   npmpl link|unlink [-od|-op]');
    console.log('   npmpl link|unlink [--only-dependencies|--only-packages]');
    process.exit(1);
}

var isLink = command === 'link',
    isOnlyDependenciesRequest = option === '-od' || option === '--only-dependencies',
    isOnlyPackagesRequest = option === '-op' || option === '--only-packages',
    debugLogFile = fs.createWriteStream(debugLogFileName),
    packages = configurationFileName.packages.reduce(function (accumulator, packageOrPattern) {
        var results;

        if (packageOrPattern.indexOf('*') >= 0) {
            results = ls(packageOrPattern);
        } else {
            if (test('-d', packageOrPattern)) {
                results = [packageOrPattern]
            }
        }

        return accumulator.concat(results);
    }, []);

log('Matching packages found:');
packages.forEach(function (pkg) {
    log(' - ' + pkg);
});

if (!isOnlyDependenciesRequest) {
    log((isLink ? 'Linking' : 'Unlinking') + ' packages:');
    packages.forEach(execInProjectFolder(function (project) {
        var command = isLink ? 'link' : 'unlink';
        log(' - ' + project, executeAction('npm ' + command));
    }));
}

if (!isOnlyPackagesRequest) {
    log((isLink ? 'Linking' : 'Unlinking') + ' dependencies:');
    packages.forEach(execInProjectFolder(linkMatchingDependencies(packages, isLink)));
}

debugLogFile.end();
console.log('Debug log written to:', debugLogFileName);

function linkMatchingDependencies(packages, isLink) {
    return function (project) {
        var pkg = require(path.resolve('./package.json'));

        Object.keys(pkg.dependencies)
            .filter(function (dependencyName) {
                return packages.indexOf(dependencyName) >= 0;
            })
            .forEach(function (dependencyName) {
                var command = isLink ? 'link' : 'unlink';

                log(' - ' + project + ' -> ' + dependencyName, executeAction('npm ' + command + ' ' + dependencyName));
            });
    }
}

function execInProjectFolder(command) {
    return function (project) {
        if (test('-d', project)) {
            cd(project);
            command(project);
            cd('..');
        } else {
            throw new Error('Path: "' + project + '" not found.');
        }
    };
}

function log(logMessage, action) {
    console.log(logMessage);
    debugLogFile.write(logMessage + '\n');

    if (action) {
        debugLogFile.write(action() + '\n');
    }
}

function executeAction(command) {
    return function () {
        return exec(command, {async: false, silent: true}).output;
    }
}
