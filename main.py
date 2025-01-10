import io
import nltk
import pandas as pd
from flask import Flask, request, render_template
from PyPDF2 import PdfReader
from docx import Document

from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords, wordnet
from nltk.stem import WordNetLemmatizer

from rapidfuzz import fuzz
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Download essential NLTK data if needed
nltk.download("punkt", quiet=True)
nltk.download("stopwords", quiet=True)
nltk.download("wordnet", quiet=True)

app = Flask(__name__)

# -------------------------------------------------------------------------
#  1. LOAD SKILLS & SYNONYMS
# -------------------------------------------------------------------------
SKILL_CSV_PATH = "ATS/skill_data/allskills.csv"
skills_df = pd.read_csv(SKILL_CSV_PATH)

ALL_SKILLS = set(skills_df["skill"].str.lower().unique())

SYNONYMS = {
    # Data Analysis / BI
    "excel": ["microsoft excel", "ms excel", "excel spreadsheet", "spreadsheet software"],
    "power bi": ["microsoft power bi", "ms power bi"],
    "tableau": ["tableau desktop", "tableau prep", "tableau server"],
    "sql": ["structured query language", "sql server", "mysql", "postgresql", "pl/sql", "oracle sql"],
    "r": ["r programming", "r language", "r scripting"],
    "data wrangling": ["data cleaning", "data munging", "data preprocessing", "data pre-processing"],
    "data visualization": ["data viz", "charts and graphs", "visual analytics"],
    "data mining": ["knowledge discovery in databases", "kdd"],
    "statistical analysis": ["stats", "statistical modeling"],

    # Data Science / Machine Learning
    "python": ["python3", "py"],
    "machine learning": ["ml", "supervised learning", "unsupervised learning", "reinforcement learning"],
    "deep learning": ["dl", "neural networks", "cnn", "rnn", "transformer"],
    "scikit-learn": ["sklearn", "scikit learn", "scikit"],
    "tensorflow": ["tf", "tensorflow 2.0"],
    "pytorch": ["torch", "pytorch lightning"],
    "big data": ["large-scale data", "hadoop", "hdfs", "spark", "hadoop ecosystem"],
    "nlp": ["natural language processing", "text analytics", "text mining"],
    "cloud computing": ["aws", "amazon web services", "azure", "microsoft azure", "gcp", "google cloud platform"],

    # Full-Stack Development
    "html": ["hypertext markup language"],
    "css": ["cascading style sheets"],
    "javascript": ["js"],
    "node.js": ["node", "node js", "nodejs"],
    "react": ["reactjs", "react.js"],
    "angular": ["angularjs", "angular.js"],
    "vue": ["vue.js", "vuejs"],
    "django": [],
    "flask": [],

    # Project Management
    "project management": ["pmp", "managing projects"]
}

SKILL_WEIGHTS = {
    # Data Analysis / BI
    "excel": 1.0,
    "power bi": 1.2,
    "tableau": 1.2,
    "sql": 1.5,
    "r": 2.0,
    "data wrangling": 1.8,
    "data visualization": 1.8,
    "data mining": 2.0,
    "statistical analysis": 2.0,

    # Data Science / ML
    "python": 2.0,
    "machine learning": 2.5,
    "deep learning": 2.5,
    "scikit-learn": 2.0,
    "tensorflow": 2.0,
    "pytorch": 2.5,
    "big data": 2.0,
    "nlp": 2.2,
    "cloud computing": 2.0,

    # Full-Stack
    "html": 1.0,
    "css": 1.0,
    "javascript": 1.8,
    "node.js": 2.0,
    "react": 1.8,
    "angular": 1.8,
    "vue": 1.6,
    "django": 1.5,
    "flask": 1.5,

    # Project Management
    "project management": 1.5
}

# -------------------------------------------------------------------------
#  2. FILE TEXT EXTRACTION
# -------------------------------------------------------------------------
def extract_text_in_memory(file) -> str:
    """
    Extract text from PDF, DOCX, or TXT file in memory (no saving to disk).
    """
    filename = file.filename.lower()
    file_data = file.read()

    if filename.endswith(".pdf"):
        text_content = ""
        pdf_reader = PdfReader(io.BytesIO(file_data))
        for page in pdf_reader.pages:
            text_content += (page.extract_text() or "") + " "
        return text_content

    elif filename.endswith(".docx"):
        text_content = ""
        doc = Document(io.BytesIO(file_data))
        for para in doc.paragraphs:
            text_content += para.text + " "
        return text_content

    elif filename.endswith(".txt"):
        return file_data.decode("utf-8", errors="ignore")

    return ""

# -------------------------------------------------------------------------
#  3. NLTK TOKENIZATION & LEMMATIZATION
# -------------------------------------------------------------------------
stop_words = set(stopwords.words("english"))
lemmatizer = WordNetLemmatizer()

def nltk_tokenize_and_lemmatize(text: str) -> list:
    """
    Tokenize, remove stopwords/punctuation, and lemmatize the text.
    """
    tokens = word_tokenize(text.lower())
    clean_tokens = []
    for t in tokens:
        if t.isalpha() and t not in stop_words:
            clean_tokens.append(lemmatizer.lemmatize(t))
    return clean_tokens

# -------------------------------------------------------------------------
#  4. MATCHING FUNCTIONS
# -------------------------------------------------------------------------
def phrase_match(full_text: str, skill_pool: set) -> set:
    """
    Direct substring check for each skill/synonym in the text.
    """
    found_skills = set()
    lower_text = full_text.lower()
    for skill in skill_pool:
        variants = [skill] + SYNONYMS.get(skill, [])
        for variant in variants:
            if variant.lower() in lower_text:
                found_skills.add(skill)
                break
    return found_skills

def fuzzy_match(full_text: str, skill_pool: set, threshold=80) -> set:
    """
    RapidFuzz partial ratio to find approximate matches above the threshold.
    """
    found_skills = set()
    lower_text = full_text.lower()
    for skill in skill_pool:
        variants = [skill] + SYNONYMS.get(skill, [])
        for variant in variants:
            score = fuzz.partial_ratio(variant.lower(), lower_text)
            if score >= threshold:
                found_skills.add(skill)
                break
    return found_skills

# -------------------------------------------------------------------------
#  5. TF-IDF COSINE SIMILARITY
# -------------------------------------------------------------------------
def get_cosine_similarity(text1: str, text2: str) -> float:
    """
    TF-IDF-based cosine similarity between text1 and text2.
    """
    tfidf = TfidfVectorizer()
    matrix = tfidf.fit_transform([text1, text2])
    sim = cosine_similarity(matrix[0], matrix[1])
    return float(sim)

# -------------------------------------------------------------------------
#  6. WEIGHTED ATS SCORE
# -------------------------------------------------------------------------
def calculate_weighted_ats(job_skills: set, matched_skills: set) -> float:
    """
    Compute skill coverage weighted by SKILL_WEIGHTS.
    """
    total_score = 0.0
    matched_score = 0.0
    for skill in job_skills:
        weight = SKILL_WEIGHTS.get(skill, 1.0)
        total_score += weight
        if skill in matched_skills:
            matched_score += weight
    if total_score == 0:
        return 0.0
    return round((matched_score / total_score) * 100, 2)

# -------------------------------------------------------------------------
#  7. FLASK ROUTES
# -------------------------------------------------------------------------
@app.route("/")
def home():
    return render_template("matchresume.html")

@app.route("/matcher", methods=["POST"])
def matcher():
    job_description = request.form.get("job_description", "").strip()
    resume_files = request.files.getlist("resumes")

    if not job_description:
        return render_template("matchresume.html", message="Please provide a job description.")
    if not resume_files:
        return render_template("matchresume.html", message="Please upload at least one resume.")

    jd_text_lower = job_description.lower()

    # Identify relevant JD skills
    jd_phrase_skills = phrase_match(jd_text_lower, ALL_SKILLS)
    jd_fuzzy_skills = fuzzy_match(jd_text_lower, ALL_SKILLS, threshold=85)
    jd_relevant_skills = jd_phrase_skills.union(jd_fuzzy_skills)

    results_data = []
    for f in resume_files:
        resume_text = extract_text_in_memory(f)

        pm_matches = phrase_match(resume_text, jd_relevant_skills)
        fm_matches = fuzzy_match(resume_text, jd_relevant_skills, threshold=80)
        combined_skills = pm_matches.union(fm_matches)

        missing = jd_relevant_skills - combined_skills
        cosim = round(get_cosine_similarity(job_description, resume_text), 3)
        ats_score = calculate_weighted_ats(jd_relevant_skills, combined_skills)

        results_data.append({
            "filename": f.filename,
            "matched_skills": sorted(list(combined_skills)),
            "missing_skills": sorted(list(missing)),
            "ats_score": ats_score,
            "cosine_similarity": cosim
        })

    # Sort by ATS score descending
    results_data = sorted(results_data, key=lambda x: x["ats_score"], reverse=True)

    return render_template(
        "matchresume.html",
        message="Review your ATS results here ==>",
        relevant_skills=sorted(list(jd_relevant_skills)),
        top_resumes=results_data
    )

if __name__ == "__main__":
    app.run(debug=True)
