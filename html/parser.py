import re
import PyPDF2
import sys
import os
import pandas as pd
import json
import numpy as np

def find_programming_languages_in_resume(resume_text):
    programming_languages = [
        'JavaScript',
        'Python',
        'Java',
        'C',
        'Swift',
        'Ruby',
        'C#',
        'PHP',
        'Kotlin',
        'Rust',
        'Ruby on Rails',
        'Go',
        'TypeScript',
        'Perl',
        'Dart',
        'R',
    ]

    pattern = r'\b(?:' + '|'.join(re.escape(lang) for lang in programming_languages) + r')\b'
    matches = re.findall(pattern, resume_text, re.IGNORECASE)
    unique_matches = list(set(matches))

    return unique_matches

# Read the PDF content from input
pdf_content = sys.argv[1]

# Use the find_programming_languages_in_resume function to find matches
programming_language_matches = find_programming_languages_in_resume(pdf_content)

# Pass programming_language_matches to calculate_domain_sums
domains = [
    "Frontend",
    "Backend",
    "Mobile Dev",
    "Game Dev",
    "Data Science",
    "AI",
    "QA",
    "DevOps",
    "Cybersecurity",
    "DB Admin",
    "Networking",
    "Embedded",
]

def calculate_domain_sums(languages):
    file_path = "programming_languages.xlsx"  # Replace with the path to your Excel file
    df = pd.read_excel(file_path)

    domain_sums = {domain: 0 for domain in domains}

    for language in languages:
        if language in df['Programming Language'].tolist():
            selected_language = df[df['Programming Language'] == language]
            for domain in domains:
                domain_sums[domain] += int(selected_language[domain].values[0])

    return [domain_sums[domain] for domain in domains]

# Example usage:
domain_scores = calculate_domain_sums(programming_language_matches)

# Convert int64 values to regular integers
domain_scores = [int(score) for score in domain_scores]

# Create a JSON result dictionary
result = {
    "domain_scores": domain_scores,
}

# Write the result to a JSON file
with open("result.json", "w") as json_file:
    json.dump(result, json_file)

# Print the JSON result to the console (optional)
print(json.dumps(result))

import pymysql

# Replace these values with your MySQL server details
host = 'localhost'
user = 'root'
port = 3306
password = 'tuddiroot'
database = 'skillstracer'

# Establish a connection to the MySQL server
connection = pymysql.connect(
    host=host,
    user=user,
    port=port,
    password=password,
    database=database
)

# Create a cursor object to interact with the database
cursor = connection.cursor()

# Sample data for the query
programming_language_matches = [
    'Frontend',
    'Backend',
    'MobileDev',
    'GameDev',
    'DataScience',
    'AI',
    'QA',
    'DevOps',
    'Cybersecurity',
    'DBAdmin',
    'Networking',
    'Embedded'
]

# Construct the column names and placeholders dynamically
columns = ', '.join(programming_language_matches[i] for i in range(len(programming_language_matches)))

placeholders = ', '.join(['%s' for _ in programming_language_matches])



insert_query = f"""
INSERT INTO Clienti (Frontend,	Backend, MobileDev, GameDev, DataScience, AI, QA, DevOps, Cybersecurity, DBAdmin, Networking, Embedded)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""
print(insert_query)
# Execute the query with the data
cursor.execute(insert_query, domain_scores)

# Commit the changes to the database
connection.commit()

# Close the cursor and connection
cursor.close()
connection.close()