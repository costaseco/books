// This is the code for the client application
// This does not contain the solution to the second assignment 

// li.innerHTML = 
// `<div class="bookbox">
//     <img src="https://covers.openlibrary.org/b/id/9251896-L.jpg">
//     <div>
//         <h2>Ubik</h2>
//         <h3>Philip K. Dick</h3>
//     </div>
//     <div>
//         <span class="star yellowstar">★</span>
//         <span class="star yellowstar">★</span>
//         <span class="star yellowstar">★</span>
//         <span class="star yellowstar">★</span>
//         <span class="star">★</span>
//         <span>(300)</span>
//     </div>
// </div>`


function toggleWishList(bookid) {
    const li = document.getElementById(`bookId${"" + bookid}`)
    li.classList.toggle('hidden')

    const addButton = document.getElementById(`addButtonId${bookid}`)
    addButton.classList.toggle('hidden')
    console.log(addButton)

    const removeButton = document.getElementById(`removeButtonId${bookid}`)
    removeButton.classList.toggle('hidden')
    console.log(removeButton)
}

function createBookBox(book) {
    // This is to be replaced by the appropriate code to 
    // construct the HTML elements in JavaScript
    const li = document.createElement("LI")
    const div = document.createElement("DIV")
    const img = document.createElement("IMG")
    img.src = book.image
    div.append(img)
    const div2 = document.createElement("DIV")
    const h2 = document.createElement("H2")
    h2.innerText = book.title
    const h3 = document.createElement("H3")
    h3.innerText = book.authors.join(", ")
    div2.append(h2)
    div2.append(h3)
    div.append(div2)
    const div3 = document.createElement("DIV")

    // Stars

    for(let i = 0; i < 5; i++ ) {
        const star = document.createElement("SPAN")
        star.classList.add("star")
        star.innerText = '★'
        if (book.rating > i) star.classList.add("yellowstar")
        div3.append(star)
    }

    const span6 = document.createElement("SPAN")
    span6.innerText = `(${book.numberrating})`
    div3.append(span6)

    const div4 = document.createElement("DIV")

    const addButton = document.createElement("BUTTON")
    addButton.innerText = 'Add to wish list'
    addButton.id = `addButtonId${book.id}`
    addButton.addEventListener("click", () => toggleWishList(book.id));
    div4.append(addButton)
    
    const removeButton = document.createElement("BUTTON")
    removeButton.innerText = 'Remove from wish list'
    removeButton.id = `removeButtonId${book.id}`
    removeButton.addEventListener("click", () => toggleWishList(book.id));
    removeButton.classList.add('hidden')
    div4.append(removeButton)
    
    div3.append(div4)

    div.append(div3)
    li.append(div)
    return li
}

function createBookWishListItem(book) {
    const li = document.createElement('LI')
    li.classList.add('hidden')
    li.id = `bookId${""+book.id}`
    li.innerText = book.title
    return li
}

function fillBooks(books) {
    const wishlist = document.getElementById('wishlist')
    const list = document.getElementById('listofbooks')

    list.innerHTML = ""
    for (const idx in books) {
        const li = createBookBox(books[idx])
        list.append(li)

        const wli = createBookWishListItem(books[idx])
        wishlist.append(wli)
    }
}

function loadAndFillBooks(search) {
    let query = ""
    if (search != undefined)
        query = `?search=${search}`

    fetch('/api/books')
    .then(data => data.json())
    .then(books => { fillBooks(books) })
}


function applySearch() {
    const input = document.getElementById("searchinput")
    const text = input.value
    loadAndFillBooks(text)
}

function toggleMenu(num) {
    const menus = document.getElementsByClassName("submenu")
    for (let i = 0; i < menus.length; i++) {
        if( i == num ) {
            menus[i].classList.toggle("hidden")
        } else {
            menus[i].classList.add("hidden")
        }
    }
}

function installOtherEventHandlers() {
    // Events to open and close menus
    const menus = document.getElementsByClassName("menuitem")
    for(let i = 0; i < menus.length; i++) {
        menus[i].addEventListener("click", (e) => {toggleMenu(i)})
    }

    // Events to call loadAndFillBooks with a new search value
    document.getElementById("searchbutton").addEventListener("click", applySearch)
    document.getElementById("searchinput").addEventListener("change", applySearch)
}


