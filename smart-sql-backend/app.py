from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_connection
import bcrypt

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "Backend Running 🚀"


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    query = data.get("query")

    score = 80
    severity = "LOW"
    execution_time = 120

    # save to DB
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO queries (query, score, severity, execution_time) VALUES (%s, %s, %s, %s)",
        (query, score, severity, execution_time)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({
        "query": query,
        "score": score,
        "severity": severity,
        "executionTime": execution_time
    })


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    name = (data.get("name") or "").strip()

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400
    if len(password) < 6:
        return jsonify({"message": "Password must be at least 6 characters"}), 400

    password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    conn = get_connection()
    cur = conn.cursor()
    try:
        # Check if email already exists
        cur.execute("SELECT user_id FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({"message": "An account with this email already exists"}), 409

        # Get next user_id (no auto_increment due to FK constraints)
        cur.execute("SELECT COALESCE(MAX(user_id), 0) + 1 FROM users")
        next_id = cur.fetchone()[0]

        cur.execute(
            "INSERT INTO users (user_id, name, email, password_hash) VALUES (%s, %s, %s, %s)",
            (next_id, name or email.split("@")[0], email, password_hash),
        )
        conn.commit()
    except Exception as e:
        err = str(e)
        cur.close()
        conn.close()
        return jsonify({"message": "Registration failed: " + err}), 400

    cur.close()
    conn.close()
    return jsonify({"message": "Account created successfully"}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    conn = get_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()
    conn.close()

    if not user:
        return jsonify({"message": "No account found with that email"}), 401

    stored_hash = user.get("password_hash")
    if not stored_hash:
        return jsonify({"message": "Account has no password set. Please register first."}), 401

    if not bcrypt.checkpw(password.encode(), stored_hash.encode()):
        return jsonify({"message": "Incorrect password"}), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user["user_id"],
            "name": user.get("name", ""),
            "email": user["email"],
        },
    }), 200


if __name__ == "__main__":
    app.run(debug=True, port=5001)
