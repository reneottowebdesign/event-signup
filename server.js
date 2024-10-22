const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve static files from node_modules
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));


// Serve the index.html file for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Utility functions (readFile, writeFile, getSections, cleanSection) same as before
const readFile = async (filePath) => {
    try {
        return await fs.readFile(filePath, 'utf8');
    } catch (err) {
        if (err.code === 'ENOENT') {
            return ''; // Return empty string if file doesn't exist
        }
        throw err;
    }
};

const writeFile = async (filePath, content) => {
    try {
        await fs.writeFile(filePath, content);
    } catch (err) {
        throw err;
    }
};

const getSections = (fileData) => {
    let zusagenSection = 'Zusagen:\n';
    let absagenSection = 'Absagen:\n';

    if (fileData) {
        const sections = fileData.split('\n\n');
        zusagenSection = sections[0].startsWith('Zusagen:') ? sections[0] : zusagenSection;
        absagenSection = sections[1] && sections[1].startsWith('Absagen:') ? sections[1] : absagenSection;
    }
    return { zusagenSection, absagenSection };
};

const cleanSection = (section) => {
    return section.trim().replace(/\n{2,}/g, '\n') + '\n';
};

// Combined route for both submitting new entries and updating existing ones
app.post('/submitOrUpdate', async (req, res) => {
    const { name, email, choice } = req.body;
    const data = `Name: ${name} E-Mail: ${email} Wahl: ${choice},\n`;
    const filePath = path.join(__dirname, 'submissions.txt');

    try {
        // Read the file content
        let fileData = await readFile(filePath);
        let { zusagenSection, absagenSection } = getSections(fileData);

        // Create regex patterns to find existing entries
        const entryPattern = new RegExp(`Name: ${name} E-Mail: ${email} Wahl: ${choice},?\n?`, 'g');
        const existingEntryPattern = new RegExp(`Name: ${name} E-Mail: ${email} Wahl: (zusagen|absagen),?\n?`, 'g');

        // If the entry already exists in the same section, it's a duplicate
        if (fileData.match(entryPattern)) {
            return res.redirect('/?duplicate=true');
        }

        // If the entry exists in the opposite section, remove it (this is the update case)
        if (fileData.match(existingEntryPattern)) {
            zusagenSection = zusagenSection.replace(existingEntryPattern, '');
            absagenSection = absagenSection.replace(existingEntryPattern, '');
        }

        // Append new data to the appropriate section (add new or updated entry)
        if (choice === 'zusagen') {
            zusagenSection += data;
        } else {
            absagenSection += data;
        }

        // Clean up sections
        zusagenSection = cleanSection(zusagenSection);
        absagenSection = cleanSection(absagenSection);

        // Write the updated content to the file
        await writeFile(filePath, `${zusagenSection}\n${absagenSection}`);
        res.redirect('/?success=true');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
