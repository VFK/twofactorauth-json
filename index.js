const YAML = require('yaml');
const fs = require('fs');

const tfaDir = './twofactorauth';
const outputDir = './generated'

let results = fs.readdirSync(`${tfaDir}/_data`).flatMap(yamlFile => {
    const file = fs.readFileSync(`${tfaDir}/_data/${yamlFile}`, 'utf8');
    
    let parsed = YAML.parse(file);
    if (!Array.isArray(parsed.websites)) {
        return null;
    }

    let items = parsed.websites.filter(item => Array.isArray(item.tfa) && item.tfa.includes('totp'));
    let group = yamlFile.replace('.yml', '');
    return items.map(item => {
        return {
            group: group,
            name: item.name,
            url: item.url,
            image: `${group}/${item.img}`
        };
    });
}).filter(item => item);

console.log(`Generated ${results.length} items.`);

fs.mkdirSync(outputDir);
fs.writeFileSync(`${outputDir}/data.json`, JSON.stringify(results));
fs.renameSync(`${tfaDir}/img`, `${outputDir}/img`);
