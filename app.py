import io
import csv
import nltk
import pandas as pd
from flask import Flask, request, render_template
from PyPDF2 import PdfReader
from docx import Document

from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

from rapidfuzz import fuzz
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Download essential NLTK data if needed
nltk.download("punkt", quiet=True)
nltk.download("punkt_tab", quiet=True)
nltk.download("stopwords", quiet=True)
nltk.download("wordnet", quiet=True)

app = Flask(__name__)

# -------------------------------------------------------------------------
#  1. LOAD SKILLS & FILE-BASED SYNONYMS + WEIGHTS
# -------------------------------------------------------------------------
SKILL_CSV_PATH = "skill_data/allskills.csv"
SYNONYMS_CSV_PATH = "skill_data/synonyms.csv"
WEIGHTS_CSV_PATH = "skill_data/skill_weights.csv"

skills_df = pd.read_csv(SKILL_CSV_PATH)
ALL_SKILLS = set(skills_df["skill"].str.lower().unique())

def load_synonyms_from_csv(filepath) -> dict:
    """
    Load synonyms from a CSV with columns:
      skill, synonyms (semicolon-separated)
    Returns a dict: { skill: [synonym1, synonym2, ...], ... }
    """
    synonyms_dict = {}
    with open(filepath, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            skill = row["skill"].strip().lower()
            # Split the synonyms on semicolon, strip whitespace
            if row["synonyms"].strip():
                syn_list = [s.strip().lower() for s in row["synonyms"].split(";")]
            else:
                syn_list = []
            synonyms_dict[skill] = syn_list
    return synonyms_dict

def load_weights_from_csv(filepath) -> dict:
    """
    Load skill weights from a CSV with columns:
      skill, weight
    Returns a dict: { skill: float_weight, ... }
    """
    weights_dict = {}
    with open(filepath, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            skill = row["skill"].strip().lower()
            weight = float(row["weight"].strip())
            weights_dict[skill] = weight
    return weights_dict

# Load synonyms and skill weights from CSV
SYNONYMS = load_synonyms_from_csv(SYNONYMS_CSV_PATH)
SKILL_WEIGHTS = load_weights_from_csv(WEIGHTS_CSV_PATH)

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

def tokenize_and_normalize(text: str) -> str:
    """
    1. Tokenize text.
    2. Keep alpha-only tokens.
    3. Remove stopwords.
    4. Lemmatize.
    5. Return a single string for easier substring and fuzzy matching.
    """
    tokens = word_tokenize(text.lower())
    cleaned = []
    for t in tokens:
        if t.isalpha() and t not in stop_words:
            cleaned.append(lemmatizer.lemmatize(t))
    return " ".join(cleaned)

# -------------------------------------------------------------------------
#  4. PHRASE & FUZZY MATCHING
# -------------------------------------------------------------------------
def phrase_match(normalized_text: str, skill_pool: set) -> set:
    """
    Direct substring check for each skill + its synonyms in the normalized text.
    """
    found_skills = set()
    for skill in skill_pool:
        # synonyms + skill itself
        variants = [skill] + SYNONYMS.get(skill, [])
        for variant in variants:
            if variant.lower() in normalized_text:
                found_skills.add(skill)
                break
    return found_skills

def fuzzy_match(normalized_text: str, skill_pool: set, threshold=80) -> set:
    """
    Use RapidFuzz partial ratio to find approximate matches above the threshold.
    """
    found_skills = set()
    for skill in skill_pool:
        variants = [skill] + SYNONYMS.get(skill, [])
        for variant in variants:
            score = fuzz.partial_ratio(variant.lower(), normalized_text)
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
    We do not strictly need to tokenize further; raw text is fine.
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
    If a skill doesn't exist in SKILL_WEIGHTS, default to 1.0
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

    # 1) Clean/normalize the job description text
    jd_normalized_text = tokenize_and_normalize(job_description)

    # 2) Identify relevant JD skills using phrase + fuzzy on the normalized JD
    jd_phrase_skills = phrase_match(jd_normalized_text, ALL_SKILLS)
    jd_fuzzy_skills = fuzzy_match(jd_normalized_text, ALL_SKILLS, threshold=85)
    jd_relevant_skills = jd_phrase_skills.union(jd_fuzzy_skills)

    results_data = []
    for f in resume_files:
        # Extract and normalize the resume text
        raw_resume_text = extract_text_in_memory(f)
        normalized_resume_text = tokenize_and_normalize(raw_resume_text)

        # Match skills using the same approach
        pm_matches = phrase_match(normalized_resume_text, jd_relevant_skills)
        fm_matches = fuzzy_match(normalized_resume_text, jd_relevant_skills, threshold=80)
        combined_skills = pm_matches.union(fm_matches)

        # Compute missing skills, similarity (on raw text), and weighted ATS
        missing = jd_relevant_skills - combined_skills
        cosim = round(get_cosine_similarity(job_description, raw_resume_text), 3)
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
