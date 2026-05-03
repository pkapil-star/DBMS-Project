from db import get_connection

def analyze_query(query):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    result = {
        "query": query,
        "score": 100,
        "severity": "LOW",
        "issues": [],
        "suggestions": [],
        "optimizedQuery": query,
        "rowsScanned": 0,
        "executionTime": 0,
        "improvements": []
    }

    # JOIN check
    if "JOIN" in query.upper():
        result["issues"].append("JOIN detected — index required")
        result["score"] -= 10

    # WHERE check
    if "WHERE" not in query.upper():
        result["issues"].append("No WHERE — full scan")
        result["score"] -= 20

    # EXPLAIN
    try:
        cursor.execute(f"EXPLAIN {query}")
        explain = cursor.fetchall()
        result["rowsScanned"] = sum(row.get("rows", 0) for row in explain)
    except:
        result["issues"].append("Query failed")

    # Optimization
    if "LIMIT" not in query.upper():
        result["optimizedQuery"] = query + " LIMIT 10"
        result["improvements"].append({
            "before": query,
            "after": result["optimizedQuery"],
            "description": "Added LIMIT"
        })

    # Severity
    if result["score"] < 50:
        result["severity"] = "HIGH"
    elif result["score"] < 80:
        result["severity"] = "MEDIUM"

    cursor.close()
    conn.close()

    return result