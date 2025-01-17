# Free ATS Scorer

- **Check out our application**: [https://sps-free-ats-scorer.onrender.com](https://sps-free-ats-scorer.onrender.com)

**Free ATS Scorer** is a web application that compares candidate resumes against a given job description. It uses NLP techniques (via NLTK), fuzzy matching, weighted skills, and TF-IDF cosine similarity to generate an ATS-like score, highlight matched skills, and identify any missing skills.

## Table of Contents
1. [Features](#features)
2. [Technologies](#technologies)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Project Details](#project-details)
6. [Developer](#developer)
7. [License](#license)

---

## Features
- **Multi-file Extraction**: Parse PDF, DOCX, and TXT files to extract resume text.
- **Skill Matching**: 
  - **Phrase Matching**: Leverages precompiled regex patterns to find exact terms.
  - **Fuzzy Matching**: Uses [RapidFuzz](https://github.com/maxbachmann/RapidFuzz) for approximate matches (e.g., “Pyton” → “Python”).
- **Weighted Skill Scoring**: Assigns different weights to skills, allowing some skills to carry higher importance than others.
- **TF-IDF Cosine Similarity**: Compares the overall text similarity between a candidate’s resume and the job description.
- **Interactive Editing**: Users can view and edit resumes online to add missing skills, then download the updated document in .docx format.
- **Reporting**: Generate CSV reports summarizing matched skills, missing skills, ATS scores, and cosine similarities across multiple resumes.

---

## Technologies
- **Language**: Python
- **Framework**: Flask
- **NLP Libraries**: [NLTK](https://www.nltk.org/), [spacy](https://spacy.io/), [RapidFuzz](https://github.com/maxbachmann/RapidFuzz)
- **Data Processing**: [pandas](https://pandas.pydata.org/), [scikit-learn](https://scikit-learn.org/)
- **File Handling**: [PyPDF2](https://pypi.org/project/PyPDF2/), [python-docx](https://pypi.org/project/python-docx/)
- **Frontend**: [Bootstrap](https://getbootstrap.com/)

## Project Details
- **Technologies**: Python, Flask, NLTK, RapidFuzz, scikit-learn, PyPDF2, and Bootstrap.
- **Key Features**:
  - Extracts text from multiple resume file types (PDF, DOCX, TXT).
  - Advanced skill matching (phrase, fuzzy, and weighted scoring).
  - Cosine similarity analysis between resume and job description.
  - Responsive, user-friendly interface.

---

## Developer
- **Name**: Suraj Singh  
- **LinkedIn**: [https://www.linkedin.com/in/suraj-singh-093a6822a](https://www.linkedin.com/in/suraj-singh-093a6822a)

---

## License
This project is licensed under the [MIT License](./LICENSE).

---
