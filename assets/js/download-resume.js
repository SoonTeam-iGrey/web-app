document.getElementById("uploadButton").addEventListener("click", function () {
    const fileInput = document.getElementById("formFile");
    const pdfContent = document.getElementById("pdfContent");

    const selectedFile = fileInput.files[0];
    if (!selectedFile) {
        pdfContent.textContent = "Please select a PDF file.";
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const pdfContent = event.target.result;

        // Call the Python script with the PDF content
        callPythonScript(pdfContent);
    };

    reader.readAsText(selectedFile);
});

function callPythonScript(pdfContent) {
    const { spawn } = require('child_process');
    const pythonProcess = spawn('python', ['parser.py', pdfContent]);

    pythonProcess.stdout.on('data', (data) => {
        const parsedText = data.toString();
        document.getElementById('pdfContent').textContent = parsedText;
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
    });
}