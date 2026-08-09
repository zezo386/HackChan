import fastapi
import sqlite3 as sq
import fastapi.middleware
import fastapi.middleware.cors
from pydantic import BaseModel

app = fastapi.FastAPI()

app.add_middleware(
    fastapi.middleware.cors.CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Post(BaseModel):
    ip: str
    message: str

@app.post("/add_post/")
def add_post(post: Post):
    print(post)
    conn = sq.connect("database.db")
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO posts (ip, message) VALUES (?, ?)",(post.ip, post.message))
        conn.commit()
        return {"message":"post posted"}
    except Exception as e:
        conn.rollback()
        print(e)
        raise fastapi.HTTPException(500,e)
    finally:
        conn.close()

@app.get("/get_posts/")
def select_post():
    conn = sq.connect("database.db")
    conn.row_factory = sq.Row
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM posts ORDER BY id DESC")
        result = [dict(row) for row in cursor.fetchall()]
        return result
    except Exception as e:
        conn.rollback()
        print(e)
        raise fastapi.HTTPException(500,e)
    finally:
        conn.close()
    
    