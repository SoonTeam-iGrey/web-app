from flask import Flask, request, jsonify
import subprocess
import PyPDF2
import io

app = Flask(__name__)

@app.route('/upload_and_process_pdf', methods=['POST'])
def upload_and_process_pdf():
    uploaded_file = request.files['file'].read()
    
    # Wrap the bytes in an io.BytesIO object
    pdf_file = io.BytesIO(uploaded_file)
    
    # Create a PDF reader object from the wrapped file
    pdf_reader = PyPDF2.PdfReader(pdf_file)

    # Initialize an empty string to store the extracted text
    text = ""

    # Loop through each page in the PDF and extract text
    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        text += page.extract_text()

    # Print or process the extracted text
    print(text)
    
    # Path to the parser.py script
    parser_script = 'parser.py'

    # Construct the command to run parser.py with the file parameter
    command = ['python', parser_script, text]

    # Execute the command
    subprocess.call(command)

    return 'File parsed'

if __name__ == '__main':
    app.run(debug=True)
