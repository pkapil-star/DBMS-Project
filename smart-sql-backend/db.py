import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Pranshu@7021",
        database="optimizer_db"
    )