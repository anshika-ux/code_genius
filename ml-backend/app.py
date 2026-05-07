from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import Ridge
from sklearn.multioutput import MultiOutputRegressor
from sklearn.pipeline import Pipeline
import numpy as np

app = Flask(__name__)
CORS(app)

# ─────────────────────────────────────────────
#  Rich training dataset covering MERN, Node.js,
#  Java, Python, HR/Behavioral domains.
#  Scores: [subject_expertise (0-10), communication_skill (0-10)]
# ─────────────────────────────────────────────
training_texts = [
    # --- High quality answers (8-10) ---
    "Middleware is a function in Express that has access to the request and response objects. It sits in the middle of the request-response cycle and can execute code, modify request/response objects, end the cycle, or call the next middleware using next(). Common uses include authentication, logging, and error handling.",
    "React hooks like useState and useEffect allow functional components to manage state and side effects. useState returns a state variable and a setter function. useEffect runs after every render by default but can be controlled with a dependency array to run only when specific values change.",
    "MongoDB uses collections and documents instead of tables and rows. Documents are stored as BSON, a binary form of JSON. It supports flexible schemas, horizontal scaling via sharding, and rich query operations. Indexes improve query performance significantly.",
    "Node.js is a runtime built on Chrome's V8 engine that allows JavaScript to run server-side. It uses an event-driven, non-blocking I/O model which makes it lightweight and efficient for I/O-heavy applications like APIs and real-time services.",
    "The event loop in Node.js handles asynchronous operations. It continuously checks the call stack and callback queue, executing callbacks when the stack is empty. This allows Node to handle many concurrent connections without threading overhead.",
    "Promises in JavaScript represent eventual completion or failure of async operations. They have three states: pending, fulfilled, and rejected. Async/await is syntactic sugar over promises that makes asynchronous code look synchronous and is easier to read.",
    "Java's object-oriented principles include encapsulation, inheritance, polymorphism, and abstraction. Encapsulation wraps data and methods together. Inheritance allows a class to extend another. Polymorphism lets objects be treated as their parent type. Abstraction hides implementation details.",
    "In Python, list comprehensions provide a concise way to create lists. They consist of an expression followed by a for clause and optional if conditions. For example, [x*2 for x in range(10) if x % 2 == 0] creates a list of even numbers doubled.",
    "REST APIs use HTTP methods: GET retrieves resources, POST creates, PUT updates, PATCH partially updates, and DELETE removes. They are stateless, meaning each request contains all information needed. Proper status codes like 200, 201, 404, 500 communicate outcomes.",
    "My greatest strength is problem-solving. When facing a challenge, I break it down into smaller components, research possible solutions, and iterate. In my previous project I optimized a slow database query by adding indexes, reducing load time from 3 seconds to 200ms.",
    "I handle conflict by first listening to the other person's perspective without interruption, then clearly expressing my own view, and finally finding a compromise that works for both parties. I believe communication is key to resolving disagreements professionally.",
    "Redux manages global application state using a single store, actions that describe what happened, and reducers that specify how state changes. It enables predictable state management and makes debugging easier with time-travel debugging via Redux DevTools.",
    "JWT tokens consist of three parts: header, payload, and signature. The header specifies the algorithm, the payload contains claims about the user, and the signature verifies the token's integrity. They are used for stateless authentication since the server doesn't need to store sessions.",
    "SQL joins combine rows from multiple tables: INNER JOIN returns matching rows, LEFT JOIN returns all left rows with matched right, RIGHT JOIN the opposite, FULL JOIN returns all rows from both. They are essential for relational database queries.",
    "Docker containers package an application with all its dependencies ensuring consistency across environments. A Dockerfile defines the image. Containers are lightweight compared to VMs as they share the host OS kernel.",

    # --- Medium quality answers (4-7) ---
    "Middleware is something that sits between client and server. It can do things like check if a user is logged in before they access a route.",
    "React hooks are functions that let you use state in functional components. useState is one hook and useEffect is another.",
    "MongoDB is a NoSQL database that stores data in JSON-like documents instead of tables.",
    "Node.js lets you run JavaScript on the server side. It is fast and good for web apps.",
    "The event loop processes tasks in Node.js. It helps handle async operations.",
    "Promises help with asynchronous code. They can be pending, resolved, or rejected.",
    "Java is object oriented and supports inheritance and polymorphism among other things.",
    "Python list comprehensions are a shorter way to create lists from existing ones.",
    "REST APIs use HTTP methods. GET is for reading and POST is for creating things.",
    "My strength is that I work hard and I am a quick learner when given new tasks to do.",
    "I try to stay calm during conflicts and talk things through with my coworkers.",
    "Redux is a state management library for React that uses a global store.",
    "JWT is used for authentication. It is a token that is sent with each request.",
    "SQL joins are used to combine data from multiple tables in a database.",
    "Docker is used to containerize applications so they can run anywhere.",

    # --- Poor quality answers (0-3) ---
    "I don't know what middleware is exactly but I think it helps apps work.",
    "Hooks are things in React. I haven't used them much.",
    "MongoDB stores data somewhere, not sure exactly how.",
    "Node.js is JavaScript I think for backends.",
    "Event loop is a loop that handles events.",
    "Promises are like callbacks but better maybe.",
    "Java has classes and objects.",
    "Python is a programming language for data science.",
    "REST API is an API that uses the internet.",
    "My strength is communication and teamwork.",
    "I handle conflicts by avoiding them usually.",
    "Redux is complex, I have only used it a little.",
    "JWT is a token for login.",
    "Joins combine tables.",
    "Docker is for deployment I think.",
]

training_scores = [
    # High quality (subject 8-10, communication 8-10)
    [9.0, 9.0],
    [9.0, 8.5],
    [8.5, 8.0],
    [9.0, 8.5],
    [9.0, 9.0],
    [8.5, 9.0],
    [9.0, 8.5],
    [8.5, 8.0],
    [8.5, 8.5],
    [7.5, 9.0],
    [7.0, 9.5],
    [9.0, 8.5],
    [9.0, 8.5],
    [8.5, 8.0],
    [8.5, 8.0],
    # Medium quality (subject 4-7, communication 4-7)
    [5.0, 5.5],
    [5.5, 5.0],
    [5.0, 4.5],
    [5.5, 5.0],
    [5.0, 5.0],
    [5.5, 5.5],
    [5.0, 5.0],
    [5.5, 5.0],
    [5.0, 5.0],
    [4.0, 5.5],
    [4.5, 5.0],
    [5.5, 5.0],
    [5.0, 5.0],
    [5.0, 4.5],
    [5.0, 5.0],
    # Poor quality (subject 0-3, communication 0-3)
    [1.5, 2.0],
    [1.0, 1.5],
    [1.5, 1.5],
    [2.0, 2.0],
    [1.5, 1.5],
    [2.0, 2.0],
    [2.0, 2.0],
    [2.0, 1.5],
    [1.5, 1.5],
    [1.0, 3.0],
    [1.5, 2.5],
    [2.0, 2.0],
    [2.0, 2.0],
    [1.5, 1.5],
    [2.0, 2.0],
]

model_pipeline = Pipeline(
    [
        ("tfidf", TfidfVectorizer(max_features=3000, ngram_range=(1, 2))),
        ("regressor", MultiOutputRegressor(Ridge(alpha=0.5)))
    ]
)

model_pipeline.fit(training_texts, training_scores)


def compute_readiness_score(subject: float, communication: float) -> int:
    """Compute a 0-100 readiness score from 0-10 subscores."""
    weighted = (subject * 0.6) + (communication * 0.4)
    return max(0, min(100, int(round(weighted * 10))))


def get_readiness_level(score: int) -> str:
    if score >= 80:
        return "Interview Ready"
    elif score >= 65:
        return "Ready"
    elif score >= 45:
        return "Developing"
    else:
        return "Needs Preparation"


def extract_strengths(subject: float, communication: float, answer: str) -> list:
    strengths = []
    word_count = len(answer.split())

    if subject >= 8:
        strengths.append("Strong technical knowledge demonstrated")
    elif subject >= 6:
        strengths.append("Good foundational understanding of the topic")

    if communication >= 8:
        strengths.append("Clear and well-structured explanation")
    elif communication >= 6:
        strengths.append("Reasonably clear communication")

    if word_count >= 50:
        strengths.append("Detailed response with good depth")
    elif word_count >= 20:
        strengths.append("Adequate answer length")

    keywords = ["example", "instance", "such as", "for example", "use case", "because", "therefore"]
    if any(kw in answer.lower() for kw in keywords):
        strengths.append("Effective use of examples or reasoning")

    return strengths if strengths else ["Attempt made to answer the question"]


def extract_improvements(subject: float, communication: float, answer: str) -> list:
    improvements = []
    word_count = len(answer.split())

    if subject < 6:
        improvements.append("Deepen technical knowledge — review core concepts and documentation")
    if communication < 6:
        improvements.append("Structure your answer: use the STAR method (Situation, Task, Action, Result)")
    if word_count < 15:
        improvements.append("Provide a more detailed answer — aim for at least 3-4 sentences")
    if word_count < 30:
        improvements.append("Include real-world examples to illustrate your points")

    vague_words = ["maybe", "i think", "not sure", "i don't know", "probably", "i guess"]
    if any(vw in answer.lower() for vw in vague_words):
        improvements.append("Speak with more confidence — avoid uncertain phrases like 'I think' or 'maybe'")

    return improvements if improvements else ["Continue practicing to refine and deepen your answers"]


def format_feedback(subject: float, communication: float, answer: str, readiness: int, level: str) -> str:
    parts = []
    parts.append(f"Readiness Score: {readiness}/100 — {level}.")

    if subject >= 8:
        parts.append("Technical expertise: Excellent. Your answer demonstrates a strong grasp of the concept.")
    elif subject >= 6:
        parts.append("Technical expertise: Good. Your answer covers the basics but could include more depth.")
    elif subject >= 4:
        parts.append("Technical expertise: Fair. Try to explain the concept more accurately with specific details.")
    else:
        parts.append("Technical expertise: Needs improvement. Review the topic thoroughly and practice explaining it clearly.")

    if communication >= 8:
        parts.append("Communication: Excellent. Your response is clear, structured, and easy to follow.")
    elif communication >= 6:
        parts.append("Communication: Good. Your answer is understandable but could benefit from better structure.")
    elif communication >= 4:
        parts.append("Communication: Fair. Try organizing your thoughts before speaking and use transition phrases.")
    else:
        parts.append("Communication: Needs improvement. Practice structuring your answers using the STAR framework.")

    return " ".join(parts)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "Smart Interview Readiness Predictor v2.0"})


@app.route("/predict", methods=["POST"])
def predict():
    """Enhanced endpoint returning readiness score, level, strengths, and improvements."""
    data = request.get_json(force=True)
    question = data.get("question", "")
    answer = data.get("answer", "")
    tech_stack = data.get("techStack", "general")

    if not answer.strip():
        return jsonify({
            "readinessScore": 0,
            "subjectMatterExpertise": 0,
            "communicationSkills": 0,
            "readinessLevel": "Needs Preparation",
            "feedback": "No answer provided. Please speak or type your response.",
            "strengths": [],
            "improvements": ["Provide an answer to receive feedback"]
        })

    text = f"Question: {question} Answer: {answer} TechStack: {tech_stack}"
    prediction = model_pipeline.predict([text])[0]
    subject_score = float(max(0, min(10, prediction[0])))
    communication_score = float(max(0, min(10, prediction[1])))

    readiness = compute_readiness_score(subject_score, communication_score)
    level = get_readiness_level(readiness)
    strengths = extract_strengths(subject_score, communication_score, answer)
    improvements = extract_improvements(subject_score, communication_score, answer)
    feedback_text = format_feedback(subject_score, communication_score, answer, readiness, level)

    return jsonify({
        "readinessScore": readiness,
        "subjectMatterExpertise": round(subject_score, 1),
        "communicationSkills": round(communication_score, 1),
        "readinessLevel": level,
        "feedback": feedback_text,
        "strengths": strengths,
        "improvements": improvements
    })


@app.route("/feedback", methods=["POST"])
def feedback():
    """Legacy endpoint — kept for backward compatibility."""
    data = request.get_json(force=True)
    question = data.get("question", "")
    answer = data.get("answer", "")
    tech_stack = data.get("techStack", "general")

    text = f"Question: {question} Answer: {answer} TechStack: {tech_stack}"
    prediction = model_pipeline.predict([text])[0]
    subject_score = max(0, min(10, int(round(prediction[0]))))
    communication_score = max(0, min(10, int(round(prediction[1]))))
    readiness = compute_readiness_score(subject_score, communication_score)
    level = get_readiness_level(readiness)
    feedback_text = format_feedback(subject_score, communication_score, answer, readiness, level)

    return jsonify({
        "subjectMatterExpertise": subject_score,
        "communicationSkills": communication_score,
        "readinessScore": readiness,
        "readinessLevel": level,
        "feedback": feedback_text,
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
