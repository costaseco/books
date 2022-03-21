// This file is to be imported after books.js in add.html

function fillCategories(newcategories) {
    const categories = document.getElementById("inputcategory")
    
    const option = document.createElement("OPTION")
    option.value = ""
    option.innerText = "New Category"
    categories.append(option)

    newcategories.forEach( c => {
        const option = document.createElement("OPTION")
        option.value = c.category
        option.innerText = c.category
        categories.append(option)
    })
}

let authors = []
function fillAuthors(newauthors) {
    authors = newauthors;
}
function addAuthorField(id) {
    const div = document.getElementById("authors")
    const select = document.createElement("SELECT")
    select.id = `selectAuthor${id}`
    select.classList.add('selectAuthor')

    const option = document.createElement("OPTION")
    option.value = ""
    option.innerText = "Select One Author"
    select.append(option)

    authors.forEach( a => {
        const option = document.createElement("OPTION")
        option.value = a.id
        option.innerText = a.name
        select.append(option)
    })
    div.append(select)
}

function loadCategoriesAndAuthors() {
    fetch("/api/categories")
    .then( data => data.json() )
    .then( categories => fillCategories(categories))

    fetch("/api/authors")
    .then( data => data.json() )
    .then( authors => { fillAuthors(authors); addAuthorField(0) })
}

function newAuthor(e) {
    e.preventDefault()
    addAuthorField(authors.length)
}

let thereareerrors = false;
function cleanErrors() {
    thereareerrors = false;
    const errors = document.getElementById("errors")
    errors.innerHTML = ""
}

function addError(error) {
    thereareerrors = true;
    const errors = document.getElementById("errors")

    const li = document.createElement("LI")
    li.innerText = error
    errors.append(li)
}

function addNewBook(book) {
    fetch("/api/books", {
        method: "POST",
        headers: {
            'content-type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(book)
    })
    .then(data => {if (data.ok) {  window.location.replace("/")}} )
}


function handleSubmit(e) {
    e.preventDefault()

    cleanErrors()

    const title = document.getElementById("inputtitle").value
    const image = document.getElementById("inputimage").value
    const rating = document.getElementById("inputrating").value
    const numberrating = document.getElementById("inputnumberrating").value
    const category = document.getElementById("inputcategory").value
    const newcategory = document.getElementById("newcategory").value

    if (! title ) addError("Please fill title.")
    if (! image ) addError("Please fill image.")
    if (! rating ) addError("Please fill rating.")
    if (! numberrating ) addError("Please fill numberrating.")
    if (!category && !newcategory) addError("Please fill category.")

    const authorsinputs = document.getElementsByClassName("selectAuthor")
    const authors = Array.from(authorsinputs).map(i => i.value).filter(v => v != '')

    if (authors.length == 0) addError("Please select at least one author.")

    const book = { title, image, rating, numberrating, category: category || newcategory, authors}
    console.log(book)

    if( ! thereareerrors ) {
        addNewBook(book)
    }
}

window.onload = () => { 
    loadCategoriesAndAuthors(); 

    installOtherEventHandlers();

    const form = document.getElementById("mainform")
    form.addEventListener("submit", handleSubmit)

    const button1 = document.getElementById("newauthor")
    button1.addEventListener("click", newAuthor)

    const button2 = document.getElementById("newbook")
    button2.addEventListener("click", handleSubmit)
}