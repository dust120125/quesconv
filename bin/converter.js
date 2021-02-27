#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const program = require("commander");

program
    .name("quesconv")
    .usage("filePath [Output]")
    .version("1.0.0")
    .parse(process.argv);
main();

function main() {
    const options = program.opts();
    const file = program.args.shift();
    if (!file) {
        console.log(program.helpInformation());
        process.exit(1);
    }
    const pathInfo = path.parse(file);
    const output = program.args.shift()
        || `${pathInfo.dir}/${pathInfo.name}.output`.concat('.txt');

    try {
        let data = fs.readFileSync(file).toString();
        data = data.replace(/\r\n/g, "\n");
        data += "\n0.";
        const matcher = (/(\d+\..*?)(\(\d\).*?(?= |\n|$))\s(\(\d\).*?(?= |\n|$))\s(\(\d\).*?(?= |\n|$))\s(\(\d\).*?(?= |\n|$))/gms);
        let m;

        const parsedQuestions = [];
        while ((m = matcher.exec(data)) !== null) {
            if (m.index === matcher.lastIndex) {
                matcher.lastIndex++;
            }

            const questTitle = m[1].replace(/^\d+\.|\n/g, '');
            parsedQuestions.push({
                question: questTitle,
                a1: m[2].replace(/\n/g, ''),
                a2: m[3].replace(/\n/g, ''),
                a3: m[4].replace(/\n/g, ''),
                a4: m[5].replace(/\n/g, '')
            });
        }

        const sep = '|';
        const result = parsedQuestions.map((q, idx) => `${sep}${(idx + 1) + '.' + q.question}${sep}${sep}${sep}${sep}${q.a1}${sep}${q.a2}${sep}${q.a3}${sep}${q.a4}`).join("\n");
        fs.writeFileSync(output, '\uFEFF' + result);
        console.log("File output: " + output);
    } catch (err) {
        console.error(err);
    }
}