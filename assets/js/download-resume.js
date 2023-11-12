document.getElementById('uploadButton').addEventListener('click', async function () {
    const fileInput = document.getElementById('formFile');
    const file = fileInput.files[0]; // Get the selected file

    if (file) {
        const reader = new FileReader();

        reader.onload = async function (e) { // Make this function async
            const arrayBuffer = e.target.result;
            const byteArray = new Uint8Array(arrayBuffer);

            // Send the data to a Python script using the clipboard
            const data = { byteArray };

            if (navigator.clipboard) {
                navigator.clipboard.writeText(JSON.stringify(data))
                .then(async function() {
                    // Fetch data from the server
                    const formData = new FormData();
                    formData.append('file', file);
                    try {
                        const response = await fetch("http://127.0.0.1:5000/upload_and_process_pdf", {
                            method: "POST",
                            body: formData,
                        });

                        // Handle the response here
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                })
                .catch(function(error) {
                    console.error('Error writing to clipboard:', error);
                });
            } else {
                console.error('Clipboard API is not supported in this browser');
            }
        };

        // Read the selected file as an ArrayBuffer
        reader.readAsArrayBuffer(file);
    } else {
        console.log('No file selected');
    }
});
