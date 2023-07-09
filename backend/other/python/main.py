import sqlite3

def main():
    # Conectarea la baza de date
    database_path = r'C:\Users\Trudix\Desktop\blockchain\db\data.db'
    conn = sqlite3.connect(database_path)
    cursor = conn.cursor()

    # Crearea tabelului "test" cu coloanele "nume" (text) și "varsta" (integer)
    #cursor.execute('''
     #              CREATE TABLE IF NOT EXISTS test (
      #                 nume TEXT,
       #                varsta INTEGER
        #           )
         #          ''')

    # Inserarea unui nou rând în tabel
    cursor.execute("INSERT INTO test (nume, varsta) VALUES ('alex', 1000)")

    # Salvarea modificărilor
    conn.commit()

    # Selectarea și afișarea datelor
    cursor.execute("SELECT * FROM test")
    rows = cursor.fetchall()
    for row in rows:
        nume = row[0]
        varsta = row[1]
        print("Nume:", nume)
        print("Varsta:", varsta)
        print("--------------------")

    # Închiderea conexiunii cu baza de date
    conn.close()

if __name__ == '__main__':
    main()
