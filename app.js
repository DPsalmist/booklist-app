// Define Book Class
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Tasks: Handles UI Tasks
class UI {
    // Create static method displayBooks
    static displayBooks(){
        // Create array for books
        const storedBooks = [
            {
                title:'Book One',
                author:'John Doe',
                isbn:'231231',
            },
            {
                title:'Book Two',
                author:'Jane Doe',
                isbn:'455223',
            },
            {
                title:'Book Three',
                author:'Will Smith',
                isbn:'778433',
            },
        ];
    // Store array in var books/
    //const books = storedBooks;
    // Save books in store
    const books = Store.getBooks();

    // Loop through books
    books.forEach((book) => UI.addBookToList(book));
     }

    // Create static method addBookToList
    static addBookToList(book){
        // Get book-list in table body
        const list = document.querySelector('#book-list');
        // Create row data
        const row  =  document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td></td>
            <td><a href='#' class='btn btn-danger btn-small delete'>X<a/></td>
        `;
        // Append row to list  
        list.appendChild(row);
    }

    // Delete a book
    static deleteBookFromList(el){
        // Check if element contains delete class
        if (el.classList.contains('delete')) {
            // Delete the row i.e. parent's parent element (td of tr)
            el.parentElement.parentElement.remove();
        }
    }

    // Clear Input Fields
    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    // Show alert
    static showAlert(msg, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        // Add text to the div
        div.appendChild(document.createTextNode(msg));
        // Grab the parent element
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        // Insert the div alert before the form in the container
        container.insertBefore(div, form);

        // Vanish alert in 2 seconds
        // SetTimeout takes a function and a timeout vaue in millisecs
        setTimeout(()=> document.querySelector('.alert').remove(), 2000);
    } 
}

// Store Class: Handles Storage
class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Store Class: Handles Storage
// class Store {
//     // Get Book From Store
//     static getBooks(){
//         let books;
//         // If books is empty, create ney array
//         if (localStorage.getItem('books') === null){
//             books = [];
//         }else{
//             books = JSON.parse(localStorage.getItem('books'));
//         }
//         return books;
//     }
//     // Add Book To Store
//     static addBook(book) {
//         const books = Store.getBooks();
//         books.push(book);
//         // setItem takes key and string_of_value
//         localStorage.setItem('books', JSON.stringify(books));
//     }
//       // Remove Book From Store
//     static removeBook(isbn){
//         const books = Store.getBooks();
//         // Loop through to see isbn
//         books.forEach((book, index) => {
//             // Check if retrieved book isbn = isbn
//             if(book.isbn === isbn){
//                 // Remove a book index
//                 books.splice(index, 1);
//             }
//         });
//         // Reset localStorage after removing a book
//         localStorage.setItem('books', JSON.stringify(books));
//     }
// }


// Event: Add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent Default Submit
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const isbn = document.querySelector('#isbn').value;
    const author = document.querySelector('#author').value;

    // Validate form data
    if (title === '' || author === '' || isbn === ''){
        UI.showAlert('Please fill in all fields!', 'danger')
    }else{
         // Instantiate book
        const book = new Book(title, author, isbn)
        console.log(book)

        //Add book to UI
        UI.addBookToList(book)
        // Add book to store
        Store.addBook(book);
        // Alert for add book
        UI.showAlert('Book Added Successfully!', 'success');

        // Clear fields
        UI.clearFields()
        }
});

// Event: Remove a book
document.querySelector('#book-list').addEventListener('click', (e)=> {
    //Remove book from UI
    UI.deleteBookFromList(e.target);
    //Remove book from store: we need to traverse the DOM
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    // Alert for remove book
    UI.showAlert('Book Removed Successfully!', 'success');
});
