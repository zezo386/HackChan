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
        for row in result:
            row["upvotes"] = max(len(row["upvoters"].split(","))-1,0)
            row["downvotes"] = max(len(row["downvoters"].split(","))-1,0)
        return result
    except Exception as e:
        conn.rollback()
        print(e)
        raise fastapi.HTTPException(500,e)
    finally:
        conn.close()

@app.get("/toggle_upvote/")
def toggle_upvote(ip: str, id: int):
    conn = sq.connect("database.db")
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT upvoters FROM posts WHERE id=?",(id,))
        post = cursor.fetchone()[0]
        if post:
            result = ""
            if ip in post:
                for upvote in post.split(","):
                    if upvote == ip or not upvote:
                        continue
                    result+=upvote+","
            else:
                result = post+","+ip
        else:
            result = ip+","
        cursor.execute("UPDATE posts SET upvoters=? WHERE id=?",(result,id))

        cursor.execute("SELECT downvoters FROM posts WHERE id=?",(id,))
        post = cursor.fetchone()[0]
        if post:
            if ip in post:
                result = ""
                for downvote in post.split(","):
                    if downvote == ip or not downvote:
                        continue
                    result+=downvote+","
                cursor.execute("UPDATE posts SET downvoters = ? WHERE id = ?",(result,id))
        conn.commit()
    except Exception as e:
        conn.rollback()
        print(e)
        raise fastapi.HTTPException(500,e)
    finally:
        conn.close()

@app.get("/toggle_downvote/")
def toggle_downvote(ip: str, id: int):
    conn = sq.connect("database.db")
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT downvoters FROM posts WHERE id=?",(id,))
        post = cursor.fetchone()[0]
        if post:
            if ip in post:
                result = ""
                for upvote in post.split(","):
                    if ip == upvote or not upvote:
                        continue
                    result += upvote+","
            else:
                result = post+","+ip
        else:
            result = ip+","
        cursor.execute("UPDATE posts SET downvoters=? WHERE id=?",(result,id))

        cursor.execute("SELECT upvoters FROM posts WHERE id=?",(id,))
        post = cursor.fetchone()[0]
        if post:
            if ip in post:
                result = ""
                for upvote in post.split(","):
                    if ip == upvote or not upvote:
                        continue
                    result += upvote+","
                cursor.execute("UPDATE posts SET upvoters=? WHERE id=?",(result,id))
        conn.commit()
    except Exception as e:
        conn.rollback()
        print(e)
        raise fastapi.HTTPException(500,e)
    finally:
        conn.close()
    