import { application } from 'express'
import sqlite from 'sqlite3'

const sqlite3 = sqlite.verbose()

export const db = new sqlite3.Database("db.sqlite", InitDatabase)


// This list exists only to insert initial data into the database
export const books = [
    {
        id: 1,
        title: "Ubik",
        authors: [
            "Philip K. Dick"
        ],
        image: "https://covers.openlibrary.org/b/id/9251896-L.jpg",
        rating: 4,
        numberrating: 300,
        category: "Science fiction"
    },
    {
        id: 2,
        title: "Do Androids dream of electric sheep?",
        authors: [
            "Philip K. Dick"
        ],
        image: "https://covers.openlibrary.org/b/id/11153217-L.jpg",
        rating: 5,
        numberrating: 255,
        category: "Science fiction"
    },
    {
        id: 3,
        title: "The Man in The High Castle",
        authors: [
            "Philip K. Dick"
        ],
        image: "https://covers.openlibrary.org/b/id/10045188-L.jpg",
        rating: 5,
        numberrating: 120,
        category: "Science fiction"
    },
    {
        id: 4,
        title: "Minority Report and other tales",
        authors: [
            "Philip K. Dick"
        ],
        image: "https://covers.openlibrary.org/b/id/911202-L.jpg",
        rating: 3,
        numberrating: 450,
        category: "Science fiction"
    },
    {
        id: 5,
        title: "Dune",
        authors: [
            "Frank Herbert"
        ],
        image: "https://covers.openlibrary.org/b/id/9719751-L.jpg",
        rating: 4,
        numberrating: 450,
        category: "Science fiction"
    },
    {
        id: 6,
        title: "The City of Mist",
        authors: [
            "Carlos Ruiz Zafon"
        ],
        image: "https://covers.openlibrary.org/b/id/10833361-L.jpg",
        rating: 5,
        numberrating: 450,
        category: "Romance"
    },
    {
        id: 7,
        title: "The Angel's Game",
        authors: [
            "Carlos Ruiz Zafon"
        ],
        image: "https://covers.openlibrary.org/b/id/12133051-L.jpg",
        rating: 5,
        numberrating: 450,
        category: "Romance"
    }
]

const authors: {[key:string]:(number[])} = {} 
// This is the typed way of declaring an empty map

books.forEach( b => {
    for(const a in b.authors) {
        if( authors[b.authors[a]] ) {
            authors[b.authors[a]].push(b.id)
        } else {
            authors[b.authors[a]] = [b.id]
        }
    }
})

function InitDatabase(err:Error) {
    if (err) {
        console.log(err.message)
        throw err
    } else {
        console.log("Connected to the database")
        CreateAuthorTable()
        CreateBookTable()
        CreateAuthorBookTable()
    }
}

function CreateAuthorTable() {
    db.run(
        `
CREATE TABLE author(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
)
`
        , InsertAuthors)
}

function InsertAuthors(err:Error) {
    if (err) {
        console.log("Authors' table already created.")
    } else {
        const insert = 'INSERT INTO author (id,name) VALUES (?,?)'
        const names:string[] = Object.keys(authors)
        names.forEach( (a,i) => {
            db.run(insert, [i,a])
        })
        db.run(insert, [99, "Yuval Noah Harari"])
        db.run(insert, [100, "Giuseppe Bernardi"])
        db.run(insert, [101, "David Vandermeulen"])
        db.run(insert, [102, "Daniel Casanave"])
    }
}


function CreateBookTable() {
    db.run(
        `
CREATE TABLE book(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    image TEXT,
    rating INTEGER,
    numberrating INTEGER,
    category TEXT
)
`
        , InsertBooks)
}

function InsertBooks(err:Error) {
    if (err) {
        console.log("Books' table already created.")
    } else {
        const insert =
            `
    INSERT INTO book (id,title, image, rating, numberrating,category) VALUES (?,?,?,?,?,?)
    `
        books.forEach(b => {
            db.run(insert, [b.id, b.title, b.image, b.rating, b.numberrating,b.category])
        })
    }
}




function CreateAuthorBookTable() {
    db.run(
        `
CREATE TABLE author_book(
    author_id INTEGER,
    book_id INTEGER,
    FOREIGN KEY(author_id) REFERENCES author(author_id),
    FOREIGN KEY(book_id) REFERENCES book(book_id)
)
`
        , InsertAuthorBookRelation)
}


function InsertAuthorBookRelation(err:Error) {
    if (err) {
        console.log("Book/Author relation table already created.")
    } else {
        const insert =
            `
INSERT INTO author_book (author_id, book_id) VALUES (?,?)
`
        const getAuthor =
        `
SELECT id FROM Author WHERE name = ?
        `

        for (const name in authors) {
            if (Object.prototype.hasOwnProperty.call(authors, name)) {
                const authorsBooks = authors[name];

                console.log(`**${name}`)
                db.get( getAuthor, [name], (aerr, {id}) => {
                    if( aerr ) {
                        console.log(`Did not found author ${name}`)
                    } else {
                        for (const idx in authorsBooks) {
                            if (Object.prototype.hasOwnProperty.call(authorsBooks, idx)) {
                                const bookId = authorsBooks[idx];
                                console.log(`[${id},${bookId}]`)
                                db.run(insert, [id, bookId])
                            }
                        }
                    }
                })
            }
        }
    }
}



