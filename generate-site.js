const fs = require('fs');
const path = require('path');

const talksData = require('./data.js');

const htmlTemplatePath = path.join(__dirname, 'index.html');
const cssPath = path.join(__dirname, 'style.css');
const jsPath = path.join(__dirname, 'script.js');

const outputHtmlPath = path.join(__dirname, 'index.html'); // Overwrite the template

fs.readFile(htmlTemplatePath, 'utf8', (err, htmlTemplate) => {
    if (err) {
        console.error('Error reading HTML template:', err);
        return;
    }

    fs.readFile(cssPath, 'utf8', (err, cssContent) => {
        if (err) {
            console.error('Error reading CSS file:', err);
            return;
        }

        fs.readFile(jsPath, 'utf8', (err, jsContent) => {
            if (err) {
                console.error('Error reading JavaScript file:', err);
                return;
            }

            // Inject CSS
            let finalHtml = htmlTemplate.replace('/* INLINE_CSS_HERE */', cssContent);

            // Inject JavaScript and talks data
            const talksJson = JSON.stringify(talksData, null, 2);
            const scriptToInject = `
    const talks = ${talksJson};
    ${jsContent}
`;
            finalHtml = finalHtml.replace('// INLINE_JS_HERE', scriptToInject);

            fs.writeFile(outputHtmlPath, finalHtml, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing final index.html:', err);
                    return;
                }
                console.log('Successfully generated index.html');
            });
        });
    });
});
