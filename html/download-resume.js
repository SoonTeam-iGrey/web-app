document.getElementById('uploadButton').addEventListener('click', function () {
    const fileInput = document.getElementById('formFile');
    const file = fileInput.files[0];

    if (file) {
        // Create a FormData object to send the file to the server
        const formData = new FormData();
        formData.append('file', file);

        // Send the file to a Python script on the server using fetch
        fetch('/upload_and_process_pdf', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(result => {
            console.log('Python script result:', result);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        console.log('No file selected');
    }
});