from dotenv import load_dotenv
load_dotenv()
import os
from sqlalchemy import create_engine, text

def run_migration():
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        print("DATABASE_URL not found in environment!")
        return

    print(f"Connecting to database...")
    engine = create_engine(db_url)
    with engine.connect() as conn:
        print("Adding 'gmail_auth_state' column if not exists...")
        conn.execute(text('ALTER TABLE "user" ADD COLUMN IF NOT EXISTS gmail_auth_state TEXT;'))
        conn.commit()
        print("Migration successful! Column 'gmail_auth_state' has been verified/added.")

if __name__ == '__main__':
    run_migration()
