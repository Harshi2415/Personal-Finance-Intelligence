from sqlalchemy import text
from app.database import engine

with engine.connect() as connection:
    result = connection.execute(
        text("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name
        """)
    )

    print("Tables in database:")
    for row in result:
        print(row[0])