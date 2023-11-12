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
print(sys.argv)
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

