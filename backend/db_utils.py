def init_db(conn):
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tokens (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL,
            token VARCHAR NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
            updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR NOT NULL,
            phone VARCHAR NOT NULL,
            login VARCHAR NOT NULL,
            password VARCHAR NOT NULL,
            type VARCHAR NOT NULL,
            CHECK (type IN ('admin', 'user')),
            created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
            updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS clients (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR NOT NULL,
            phone VARCHAR NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
            updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS menu (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR NOT NULL,
            size SMALLINT NOT NULL,
            price FLOAT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
            updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL,
            client_id UUID NULL,
            items JSONB NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
            updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp
        )
    ''')
    conn.commit()
    cursor.close()


def execute_query(conn, query, params=None, size=None):
    cursor = conn.cursor()
    try:
        if params is None:
            cursor.execute(query)
        else:
            cursor.execute(query, params)
        
        result = cursor.fetchall()
        result_dict = [convert_to_dictionary(item, cursor) for item in result]
        
        if size == 1 and not len(result):
            return False
        
        return result_dict[0] if size == 1 else result_dict
    finally:
        conn.commit()
        cursor.close()


def convert_to_dictionary(row, cursor):
    column_names = [desc[0] for desc in cursor.description]
    return dict(zip(column_names, row))