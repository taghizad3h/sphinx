import json
from time import time
from typing import Dict, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from MySQLdb import _mysql
from MySQLdb.connections import Connection
from MySQLdb.cursors import Cursor
from pydantic import BaseSettings


class Settings(BaseSettings):
    sphinx_host: str = "127.0.0.1"
    sphinx_port: int = 9306
    indexes: Dict = {
        "najaf": {"name": "najaf", "desc": "کتابخانه مدرسه فقاهت"}}
    indexes_names = [v['name'] for v in indexes.values()]


settings = Settings()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['localhost:3000'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def converthighlights(txt):
    return txt.replace('<b>', "<span style=\"color:#ef7d2e;\">").replace('</b>', '</span>')


@app.get("/")
def root():
    return "Sphinx rest api"


@app.get('/indexes')
def indexes():
    # sql_query = "SHOW TABLES"
    # connection = Connection(host='127.0.0.1', port=9306, charset="utf8mb4")
    # cursor = Cursor(connection)
    # result = cursor.execute(sql_query)
    # result = cursor.fetchall()
    return ['najaf_simple', 'najaf_synonym', 'najaf_synonym_stemmer', 'najaf_stemmer', 'najaf_stopword', 'najaf_stemmer_stopword']


@app.get("/search")
def search(query: Optional[str], index: Optional[str] = None, page: Optional[int] = 0, size: Optional[int] = 10):
    t1 = time()
    if not index:
        index = ','.join(settings.indexes_names)

    sql_query = f"select id, project_name, collection_name, project_type, author, gid, txt, url, page_number, owner, SNIPPET(DOCUMENT({{txt}}), QUERY()) from {index} where match('{query}') limit {page}, {size}; show meta;"
    connection = Connection(host='127.0.0.1', port=9306, charset="utf8mb4")
    cursor = Cursor(connection)
    result = cursor.execute(sql_query)
    result = cursor.fetchall()

    hits = []
    for r in result:
        hits.append({'id': r[0],
                     'project_name': r[1],
                     'collection_name': r[2],
                     'project_type': r[3],
                     'author': r[4],
                     'uuid': r[5],
                     'txt': converthighlights(r[6]),
                     'url': r[7],
                     'page_number': r[8],
                     'owner': r[9],
                     'snippet': converthighlights(r[10])})
    result = cursor.nextset()
    result = cursor.fetchall()
    t2 = time()
    response = {}
    response['hits'] = hits
    response['took'] = t2-t1
    response['total_found'] = result[1][1]
    return response


@app.get("/snippet")
def snippets(query: Optional[str], index: Optional[str] = None, page: Optional[int] = 0, size: Optional[int] = 10):
    t1 = time()
    if not index:
        index = ','.join(settings.indexes_names)
    db = _mysql.connect(host="127.0.0.1", port=9306)
    sql_query = f"select id, project_name, collection_name, project_type, author, gid, url, page_number, SNIPPET(DOCUMENT({{txt}}), QUERY()) from {index} where match('{query}') limit {page}, {size};"
    db.query(sql_query)
    result = db.store_result()
    result = result.fetch_row(maxrows=size)
    hits = []
    for r in result:
        hits.append({'id': r[0],
                     'project_name': r[1],
                     'collection_name': r[2],
                     'project_type': r[3],
                     'author': r[4],
                     'uuid': r[5],
                     'url': r[6],
                     'page_number': r[7],
                     'snippet': converthighlights(r[8])})

    response = {}
    t2 = time()
    response['hits'] = hits
    response['took'] = t2-t1
    return response
