document.addEventListener("DOMContentLoaded", () => {
   const incompleteBookshelfList = document.getElementById(
      "incompleteBookshelfList"
   );
   const completeBookshelfList = document.getElementById(
      "completeBookshelfList"
   );

   const BOOKSTORAGE = "BOOKSHELF_APPS";
   const currentYear = new Date().getFullYear();

   const saveData = () => {
      localStorage.setItem(BOOKSTORAGE, JSON.stringify(books));
      renderBooks();
   };

   const loadData = () => {
      const data = localStorage.getItem(BOOKSTORAGE);
      return data !== null ? JSON.parse(data) : [];
   };

   const books = loadData();

   const updateData = () => {
      saveData();
   };

   const addButtonListener = (button, eventListener) => {
      button.addEventListener("click", eventListener);
   };

   const addBookToShelf = (title, author, year, isComplete) => {
      const book = {
         id: +new Date(),
         title,
         author,
         year,
         isComplete,
      };
      books.push(book);
      updateData();
      showSuccessPopup();
   };

   const moveBookToShelf = (id, targetShelf) => {
      const bookIndex = books.findIndex((book) => book.id === id);
      if (bookIndex !== -1) {
         books[bookIndex].isComplete = targetShelf === "complete";
         updateData();

         const bookSubmitButton = document.getElementById("bookSubmit");
         const spanElement = bookSubmitButton.querySelector("span");
         if (targetShelf === "complete") {
            spanElement.innerText = "sudah selesai dibaca";
         } else {
            spanElement.innerText = "Belum selesai dibaca";
         }

         const popup = document.createElement("div");
         popup.classList.add(
            targetShelf === "complete" ? "popup-green" : "popup-green"
         );
         popup.innerHTML = `
         <p class="popup-message">Berhasil ${
            targetShelf === "complete"
               ? "selesai dibaca"
               : "dipindahkan ke belum selesai dibaca"
         }!</p>
      `;
         document.body.appendChild(popup);

         setTimeout(() => {
            document.body.removeChild(popup);
         }, 2000);
      }
   };


   const removeBook = (id) => {
      const bookIndex = books.findIndex((book) => book.id === id);
      if (bookIndex !== -1) {
         books.splice(bookIndex, 1);
         updateData();
         showDeletePopup();
      }
   };

   const searchBookForm = document.getElementById("searchBook");
   const searchBookTitleInput = document.getElementById("searchBookTitle");

   searchBookForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const keyword = searchBookTitleInput.value.toLowerCase();
      const filteredBooks = books.filter((book) => {
         return (
            book.title.toLowerCase().includes(keyword) ||
            book.author.toLowerCase().includes(keyword)
         );
      });
      renderBooks(filteredBooks);
   });

   const renderBooks = (booksToRender = books) => {
      incompleteBookshelfList.innerHTML = "";
      completeBookshelfList.innerHTML = "";

      booksToRender.forEach((book) => {
         const bookItem = document.createElement("article");
         bookItem.classList.add("book_item");

         const bookContent = `
         <h3>${book.title}</h3>
         <p>Penulis: ${book.author}</p>
         <p>Tahun: ${book.year}</p>
         <div class="action">
            ${
               book.isComplete
                  ? `<button class="green">Belum selesai dibaca 📘</button>`
                  : `<button class="green">Selesai dibaca 📖</button>`
            }
            <button class="red">Hapus buku 🗑</button>
         </div>
      `;

         bookItem.innerHTML = bookContent;

         const buttons = bookItem.querySelectorAll("button");
         addButtonListener(buttons[0], () => {
            if (book.isComplete) {
               moveBookToShelf(book.id, "incomplete");
            } else {
               moveBookToShelf(book.id, "complete");
            }
         });
         addButtonListener(buttons[1], () => removeBook(book.id));

         if (book.isComplete) {
            completeBookshelfList.appendChild(bookItem);
         } else {
            incompleteBookshelfList.appendChild(bookItem);
         }
      });
   };


   const showDuplicatePopup = () => {
      const popup = document.createElement("div");
      popup.classList.add("popupDuplicate");
      popup.innerHTML = `
      <p class="popup-message">Judul buku sudah ada!</p>
   `;
      document.body.appendChild(popup);

      setTimeout(() => {
         document.body.removeChild(popup);
      }, 2000);
   };

   const showYearInvalid = () => {
      const popup = document.createElement("div");
      popup.classList.add("popupDuplicate");
      popup.innerHTML = `
      <p class="popup-message">Tahun buku maksimal ${currentYear}</p>
   `;
      document.body.appendChild(popup);

      setTimeout(() => {
         document.body.removeChild(popup);
      }, 2000);
   };

   const inputBook = document.getElementById("inputBook");
   inputBook.addEventListener("submit", (event) => {
      event.preventDefault();
      const title = document.getElementById("inputBookTitle").value;
      const author = document.getElementById("inputBookAuthor").value;
      const year = document.getElementById("inputBookYear").value;
      const isComplete = document.getElementById("inputBookIsComplete").checked;

      if (year > currentYear) {
         showYearInvalid();
         return;
      }

      const isTitleExist = books.some((book) => book.title === title);
      const isAuthorExist = books.some((book) => book.author === author);
      if (isTitleExist && isAuthorExist) {
         showDuplicatePopup();
         return;
      }

      addBookToShelf(title, author, year, isComplete);

      document.getElementById("inputBookTitle").value = "";
      document.getElementById("inputBookAuthor").value = "";
      document.getElementById("inputBookYear").value = "";
      document.getElementById("inputBookIsComplete").checked = false;
   });

   const showSuccessPopup = () => {
      const popup = document.createElement("div");
      popup.classList.add("popup");
      popup.innerHTML = `
      <p class="popup-message">Buku berhasil ditambahkan!</p>
   `;
      document.body.appendChild(popup);

      setTimeout(() => {
         document.body.removeChild(popup);
      }, 2000);
   };

   const showDeletePopup = () => {
      const popup = document.createElement("div");
      popup.classList.add("popup-green");
      popup.innerHTML = `
      <p class="popup-message">Buku berhasil dihapus!</p>
   `;
      document.body.appendChild(popup);

      setTimeout(() => {
         document.body.removeChild(popup);
      }, 2000);
   };

   renderBooks();
});
