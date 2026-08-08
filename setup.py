import sqlite3 as sq
def setup():
    conn = sq.connect("database.db")
    conn.row_factory = sq.Row
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM posts")
        print(dict(cursor.fetchall()[0]))
        #cursor.execute("DROP TABLE IF EXISTS posts")
        #cursor.execute("CREATE TABLE posts (id INTEGER PRIMARY KEY AUTOINCREMENT, ip TEXT, message TEXT)")
        #conn.commit()
    except Exception as e:
        conn.rollback()
        print(e)
    finally:
        conn.close()

setup()