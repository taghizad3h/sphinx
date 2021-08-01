from MySQLdb import _mysql
from MySQLdb.cursors import Cursor
from MySQLdb.connections import Connection
query = 'سلام بر حسین'
index = 'najaf_simple'
page = 0
size = 0

# db =_mysql.connect(host="127.0.0.1", port=9306)
sql_query = f"select id, project_name, collection_name, project_type, author, gid, txt, url, page_number, SNIPPET(DOCUMENT({{txt}}), QUERY()) from {index} where match('{query}') limit {page}, {size}; show meta;"
sql_query2 = "select 1 from libeshia; show tables;"
# db.query(sql_query2)
# result = db.store_result()
# print(result)
# result = result.fetch_row(maxrows=4)

connection = Connection(host='127.0.0.1', port=9306, charset="utf8mb4")
cursor = Cursor(connection)
# result = cursor.execute(sql_query)
# result = cursor.fetchall()
# print(result)
# for r in result:
#     print(result.fetchall())

# result = cursor.nextset()
# result = cursor.fetchall()
# print(result[1][1])


result = cursor.execute("SHOW tables;")
print(result)
print(result.fetchall())