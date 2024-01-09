import os
import json
import psycopg2
import jwt
import hashlib
import uvicorn
from typing import List, Optional
from pydantic import BaseModel
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from db_utils import init_db, execute_query


class RequestLoginBody(BaseModel):
    login: str
    password: str


class RequestMenuItemBody(BaseModel):
    name: str
    price: float
    size: int


class RequestOrderBody(BaseModel):
    client_name: Optional[str] = None
    client_phone: Optional[str] = None
    items: List[RequestMenuItemBody]


class RequestUserBody(BaseModel):
    name: str
    phone: str
    login: str
    password: str


cwd = os.getcwd()
load_dotenv(os.path.join(cwd, '.env'))

conn = psycopg2.connect(os.getenv('DATABASE_URI'))

build_folder = os.path.join(cwd, 'dist', 'browser')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

def get_user_by_token(token):
    if token == None:
        token = ''
    token = token.replace('Bearer ', '')
    query = "SELECT user_id FROM tokens WHERE token=%s"
    result = execute_query(conn, query, [token], 1)

    if not result:
        return False
    
    query = "SELECT id, name, type, created_at, updated_at FROM users WHERE id=%s"
    
    return execute_query(conn, query, (result['user_id'],), 1)


@app.post('/api/login')
def login(data: RequestLoginBody):
    password = hashlib.md5(data.password.encode())
    query = "SELECT id, name, type, created_at, updated_at FROM users WHERE login=%s AND password=%s"
    user = execute_query(conn, query, [data.login, password.hexdigest()], 1)

    if not user:
        return JSONResponse({'error': 'Login or password is incorrect'}, 400)
    
    token = jwt.encode({'id': user['id']}, 'secret', algorithm='HS256')
    
    query = "INSERT INTO tokens (user_id, token) VALUES (%s, %s) RETURNING token"
    result = execute_query(conn, query, [user['id'], token], 1)
    
    return {'token': result['token'], **user}
    

@app.get('/api/me')
def get_user(request: Request):
    user = get_user_by_token(request.headers.get('Authorization'))

    if not user:
        return JSONResponse({'error': 'Unauthorized'}, 401)
    
    return user
    

@app.get('/api/users')
def get_users(request: Request):
    user = get_user_by_token(request.headers.get('Authorization'))
    
    if not user:
        return JSONResponse({'error': 'Unauthorized'}, 401)
    elif user['type'] != 'admin':
        return JSONResponse({'error': 'Forbidden'}, 403)
    
    query = "SELECT id, name, phone, created_at, updated_at FROM users WHERE type='user'"
    result = execute_query(conn, query)
    
    return result
    

@app.post('/api/users')
def add_user(data: RequestUserBody, request: Request):
    user = get_user_by_token(request.headers.get('Authorization'))
    
    if not user:
        return JSONResponse({'error': 'Unauthorized'}, 401)
    elif user['type'] != 'admin':
        return JSONResponse({'error': 'Forbidden'}, 403)
    
    password = hashlib.md5(data.password.encode())
    
    query = "INSERT INTO users (name, phone, login, password, type) VALUES (%s, %s, %s, %s, %s) RETURNING id, name, phone, created_at, updated_at"
    user = execute_query(conn, query, [data.name, data.phone, data.login, password.hexdigest(), 'user'], 1)
    
    return user
    

@app.delete('/api/users/{id}')
def delete_user(id: str, request: Request):
    user = get_user_by_token(request.headers.get('Authorization'))
    
    if not user:
        return JSONResponse({'error': 'Unauthorized'}, 401)
    elif user['type'] != 'admin':
        return JSONResponse({'error': 'Forbidden'}, 403)
    
    query = "DELETE FROM users WHERE id=%s RETURNING id"
    result = execute_query(conn, query, [id], 1)
    
    return result


@app.get('/api/menu')
def get_menu(request: Request):
    user = get_user_by_token(request.headers.get('Authorization'))
    
    if not user:
        return JSONResponse({'error': 'Unauthorized'}, 401)
    
    query = "SELECT * FROM menu"
    result = execute_query(conn, query)
    
    return result


@app.post('/api/menu')
def add_menu_item(data: RequestMenuItemBody, request: Request):
    user = get_user_by_token(request.headers.get('Authorization'))
    
    if not user:
        return JSONResponse({'error': 'Unauthorized'}, 401)
    elif user['type'] != 'admin':
        return JSONResponse({'error': 'Forbidden'}, 403)
    
    query = "INSERT INTO menu (name, size, price) VALUES (%s, %s, %s) RETURNING *"
    result = execute_query(conn, query, [data.name, data.size, data.price], 1)
    
    return result


@app.delete('/api/menu/{id}')
def delete_menu_item(id: str, request: Request):
    user = get_user_by_token(request.headers.get('Authorization'))
    
    if not user:
        return JSONResponse({'error': 'Unauthorized'}, 401)
    elif user['type'] != 'admin':
        return JSONResponse({'error': 'Forbidden'}, 403)
    
    query = "DELETE FROM menu WHERE id=%s RETURNING id"
    result = execute_query(conn, query, [id], 1)
    
    return result


@app.post('/api/orders')
def add_order(data: RequestOrderBody, request: Request):
    user = get_user_by_token(request.headers.get('Authorization'))
    
    if not user:
        return JSONResponse({'error': 'Forbidden'}, 401)
    
    client_id = None
    
    if data.client_phone:
        query = "SELECT * FROM clients WHERE phone=%s"
        result = execute_query(conn, query, [data.client_phone], 1)

        if result:
            client_id = result['id']
        else:
            query = "INSERT INTO clients (name, phone) VALUES (%s, %s) RETURNING *"
            result = execute_query(conn, query, [data.client_name, data.client_phone], 1)
            client_id = result['id']
    
    items_json = json.dumps([item.model_dump() for item in data.items])
    query = "INSERT INTO orders (user_id, client_id, items) VALUES (%s, %s, %s) RETURNING *"
    result = execute_query(conn, query, [user['id'], client_id, items_json], 1)
    
    return result


@app.get('/')
def index(request: Request):
    return FileResponse(os.path.join(build_folder, "index.html"))


@app.get('/{full_path:path}')
def catch_all(request: Request, full_path: str):
    file_path = os.path.join(build_folder, full_path)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    else:
        return FileResponse(os.path.join(build_folder, "index.html"))
    

# app.mount('/', StaticFiles(directory=build_folder, html=True), name='static')


def init_admin():
    query = "SELECT id FROM users WHERE type='admin'"
    result = execute_query(conn, query, size=1)

    if not result:
        password = hashlib.md5('admin'.encode())
        query = "INSERT INTO users (name, phone, login, password, type) VALUES (%s, %s, %s, %s, %s) RETURNING id"
        execute_query(conn, query, ['Admin', '', 'admin', password.hexdigest(), 'admin'], 1)


if __name__ == '__main__':
    port = int(os.getenv('API_PORT', 80))
    init_db(conn)
    init_admin()
    uvicorn.run('app:app', host='0.0.0.0', port=port, log_level='info')