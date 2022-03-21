import { db } from './init'

export interface Book {
    id: number,
    title: string,
    authors: string[],
    image: string,
    rating: number,
    numberrating: number,
    category: string
}

export interface Author {
    id: number,
    name: string
}

export function getAllBooks(search: string, fn: (books: Book[]) => void) {
    const sql = `
              SELECT * FROM Book b
              JOIN Author_Book ab ON ab.book_id = b.id
              JOIN Author a ON a.id = ab.author_id
              WHERE b.title LIKE '%' || ? || '%'
              `
    const params: string[] = [search]
    db.all(sql, params, (err, rows) => {
        if (err) {
            console.log("error in database: " + err)
            fn([])
        } else {
            const bbooks = rowsToBooks(rows)
            fn(bbooks)
        }
    })
}

function rowsToBooks(rows:any[]) {

    const selectedBooks: { [key: number]: Book } = {}
    rows.forEach(b => {
        if (selectedBooks[b.book_id]) {
            selectedBooks[b.book_id].authors.push(b.name)
        } else {
            selectedBooks[b.book_id] = {
                id: b.book_id,
                title: b.title,
                image: b.image,
                rating: b.rating,
                numberrating: b.numberrating,
                authors: [b.name],
                category: b.category
            }
        }
    })
    return Object.values(selectedBooks)
}

export function getOneBook(id: number, fn: (book: Book | null) => void) {
    const sql = "SELECT * FROM Book WHERE id = ?"
    const params: string[] = ["" + id]
    db.get(sql, params, (err, row) => {
        if (err) {
            console.log("error in database: " + err)
            fn(null)
        } else {
            console.log(row)
            // get the authors of the book and add it to the book
            fn(row)
        }
    })
}

export function addOneBook(b: Book, fn: (err:Error) => void) {
    console.log(b)

    const insert =
        `
    INSERT INTO book (title, image, rating, numberrating,category) VALUES (?,?,?,?,?)
    `
    const insertRelation =
        `
    INSERT INTO author_book (author_id, book_id) VALUES (?,?)
    `
    db.run(insert, [b.title, b.image, b.rating, b.numberrating, b.category],
        function (err) {
            if (err) {
                console.log(err.message)
                fn(err)
            }
            else {
                const bookId = this.lastID
                console.log(`The id of the new book is ${bookId}`)
                b.authors.forEach(
                    a => {
                        db.run(insertRelation,[a,bookId])
                        console.log(`relation ${a}, ${bookId}`)
                    })
                fn(null)
            }
        })

}

export function getBooksCategory(category: string, fn: (books: Book[]) => void) {
    if( category ) {
        const sql = `
              SELECT * FROM Book b
              JOIN Author_Book ab ON ab.book_id = b.id
              JOIN Author a ON a.id = ab.author_id
              WHERE category = ?
        `
        db.all(sql, [category], (err, rows) => {
            if (err) {
                console.log("error in database: " + err)
                fn([])
            } else {
                const bbooks = rowsToBooks(rows)
                // Now get the authors for each book and add it to the result
                fn(bbooks)
            }
        })

    } else
        fn([])
}

export function getCategories(fn: (categories: string[]) => void) {
    const sql = `
              SELECT category, count(*) as count FROM Book b
              GROUP BY category
        `
        db.all(sql, (err, rows) => {
            if (err) {
                console.log("error in database: " + err)
                fn([])
            } else {
                fn(rows)
            }
        })
}

export function getAuthors(fn: (authors: Author[]) => void) {
    const sql = `
              SELECT * FROM Author
        `
        db.all(sql, (err, rows) => {
            if (err) {
                console.log("error in database: " + err)
                fn([])
            } else {
                fn(rows)
            }
        })
}

