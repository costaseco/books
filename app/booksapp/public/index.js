// This file is to be imported after books.js in index.html

function filterByCategory(category) {
    fetch(`/api/categories/${category}/books`)
        .then(data => data.json())
        .then(books => { console.log(books); fillBooks(books) })    
}

function fillCategories(categories) {
    const div = document.getElementById("countcategories")

    categories.forEach(
        c => {
            const p = document.createElement("P")
            const a = document.createElement("A")
            a.innerHTML = `<a href="">${c.category} (${c.count})</a>`
            a.addEventListener("click", 
                (e) => { e.preventDefault(); filterByCategory(c.category)})
            p.append(a)
            div.append(p)
        })
}

function loadAndFillCategories() {
    fetch("/api/categories")
        .then(data => data.json())
        .then(categories => fillCategories(categories))
}

window.onload = () => {
    loadAndFillBooks() 
    loadAndFillCategories()

    installOtherEventHandlers()
}