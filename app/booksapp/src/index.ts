import express from 'express'
import { 
    addOneBook, 
    getAllBooks, 
    getOneBook, 
    getBooksCategory, 
    getAuthors, 
    getCategories } from './data'

const app = express()
const port = 8080

app.use(express.static('public'))

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});

// Getting all books, with search
app.get('/api/books', (req, res) => {
    const search: string = (req.query.search || "") as string
    getAllBooks(search, (data) => { res.send(JSON.stringify(data)) })
})

// Getting one book
app.get('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id, 10)
    getOneBook(bookId, (book) => {
        if (book != null) res.send(JSON.stringify(book))
        else {
            res.status(404)
            res.send()
        }
    })
})

// Adding one book
app.post('/api/books', (req, res) => {
    console.log('New Books Being added')
    let body = ""
    req
        .on('data', (data) => body += data)
        .on('end', () => {
            const book = JSON.parse(body)
            console.log(book)
            if( book.title && 
                book.image && 
                book.rating && 
                book.numberrating && 
                book.category && 
                book.authors ) {
                addOneBook({
                    id:0, // Needs this for the type of Book
                    title: book.title,
                    image: book.image,
                    category: book.category,
                    rating: book.rating,
                    numberrating: book.numberrating,
                    authors:book.authors},
                (err) => {
                    if(err ) {
                        res.status(400)
                        res.send(err.message)
                    }
                    res.status(200)
                    res.send()
                })
            } else {
                console.log("Here")
                res.status(400)
                res.send("Invalid Book")
            }
        })
})


// Getting books of one category
app.get('/api/categories/:category/books', (req, res) => {
    getBooksCategory(req.params.category, (data) => { 
        res.status(200)
        res.send(JSON.stringify(data)) 
    })
})

// Getting the list of authors
app.get('/api/authors', (req, res) => {
    getAuthors((data) => {
        res.status(200)
        res.send(JSON.stringify(data)) 
    })
})

// Getting the list of categories with counters
app.get('/api/categories', (req, res) => {
    getCategories((data) => {
        res.status(200)
        res.send(JSON.stringify(data)) 
    })
})





















































