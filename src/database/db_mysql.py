import mysql.connector
from mysql.connector import Error


def get_connection():
    """Create a connection to the MySQL database."""
    try:
        connection = mysql.connector.connect(
            host='137.131.136.183',
            database='BDValleReque',
            user='useremote',
            password='12345@Remote'
        )
        if connection.is_connected():
            print("Connected to MySQL database")
            return connection
    except Error as e:
        print(f"Error: {e}")
        return None
    return None

if __name__ == "__main__":
    conn = get_connection()
    if conn:
        conn.close()
