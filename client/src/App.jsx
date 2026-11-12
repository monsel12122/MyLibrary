
import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:5269/api/books";

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    yearPublished: "",
    isRead: false
  });

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchedBook, setSearchedBook] = useState(null);
  const [searchMessage, setSearchMessage] = useState("");

  const [filterCategory, setFilterCategory] = useState("all");
  const [filterValue, setFilterValue] = useState("");
  const [sortBy, setSortBy] = useState("title");

  async function loadBooks() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Could not load books");

      setBooks(await response.json());
      setError("");
    } catch {
      setError("Unable to connect to the API.");
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  async function searchBook(e) {
    e.preventDefault();
    setSearchedBook(null);
    setSearchMessage("");

    const id = Number(searchId);

    if (!Number.isInteger(id) || id <= 0) {
      setSearchMessage("Enter a valid positive Book ID.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`);

      if (response.status === 404) {
        setSearchMessage(`No book found with ID ${id}.`);
        return;
      }

      if (!response.ok) throw new Error("Search failed");

      const book = await response.json();

      setSearchedBook(book);
      setSearchMessage(`Book found! ID: ${book.id}`);
    } catch {
      setSearchMessage("Unable to search. Check your backend server.");
    }
  }

  function clearSearch() {
    setSearchId("");
    setSearchedBook(null);
    setSearchMessage("");
  }

  async function saveBook(e) {
    e.preventDefault();

    const book = {
      ...form,
      yearPublished: Number(form.yearPublished)
    };

    if (editingId !== null) {
      book.id = editingId;
    }

    try {
      const response = await fetch(
        editingId !== null ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId !== null ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(book)
        }
      );

      if (!response.ok) throw new Error("Save failed");

      setForm({
        title: "",
        author: "",
        genre: "",
        yearPublished: "",
        isRead: false
      });

      setEditingId(null);
      clearSearch();
      await loadBooks();
    } catch {
      setError("Unable to save book.");
    }
  }

  function editBook(book) {
    setEditingId(book.id);

    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      yearPublished: book.yearPublished,
      isRead: book.isRead
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteBook(id) {
    if (!window.confirm("Delete this book?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Delete failed");

      clearSearch();
      await loadBooks();
    } catch {
      setError("Unable to delete book.");
    }
  }

  function resetFilters() {
    setFilterCategory("all");
    setFilterValue("");
    setSortBy("title");
  }

  const displayedBooks = (
    searchedBook ? [searchedBook] : searchMessage ? [] : books
  )
    .filter(book => {
      if (filterCategory === "all" || !filterValue.trim()) {
        return true;
      }

      return String(book[filterCategory] ?? "")
        .toLowerCase()
        .includes(filterValue.trim().toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "yearPublished" || sortBy === "id") {
        return a[sortBy] - b[sortBy];
      }

      return String(a[sortBy] ?? "")
        .localeCompare(String(b[sortBy] ?? ""));
    });

  return (
    <div className="container">
      <header>
        <h1>📚 MyLibrary</h1>
        <p>Your personal book collection manager</p>
      </header>

      <section className="stats">
        <div>Total Books: {books.length}</div>
        <div>
          Books Read: {books.filter(b => b.isRead).length}
        </div>
        <div>
          To Read: {books.filter(b => !b.isRead).length}
        </div>
      </section>

      <section className="panel">
        <h2>
          {editingId !== null ? "Edit Book" : "Add a New Book"}
        </h2>

        <form onSubmit={saveBook}>
          <input
            placeholder="Book Title"
            required
            value={form.title}
            onChange={e =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <input
            placeholder="Author"
            required
            value={form.author}
            onChange={e =>
              setForm({ ...form, author: e.target.value })
            }
          />

          <input
            placeholder="Genre"
            value={form.genre}
            onChange={e =>
              setForm({ ...form, genre: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Year Published"
            min="1"
            max={new Date().getFullYear()}
            required
            value={form.yearPublished}
            onChange={e =>
              setForm({
                ...form,
                yearPublished: e.target.value
              })
            }
          />

          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.isRead}
              onChange={e =>
                setForm({
                  ...form,
                  isRead: e.target.checked
                })
              }
            />
            I have read this book
          </label>

          <button type="submit">
            {editingId !== null ? "Update Book" : "Add Book"}
          </button>
        </form>
      </section>

      {error && <p className="error">{error}</p>}

      <section className="panel">
        <h2>🔎 Search Book by ID</h2>

        <form onSubmit={searchBook}>
          <input
            type="number"
            placeholder="Enter Book ID (e.g. 1)"
            min="1"
            step="1"
            required
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
          />

          <button type="submit">
            Search by ID
          </button>

          <button type="button" onClick={clearSearch}>
            Show All Books
          </button>
        </form>

        {searchMessage && <p>{searchMessage}</p>}
      </section>

      {/* Improved Filter and Sort layout */}
      <section className="panel">
        <h2>Filter and Sort Books</h2>

        <div className="filter-controls">

          <div className="filter-group">
            <label htmlFor="filter-category">
              Filter by Category
            </label>

            <select
              id="filter-category"
              value={filterCategory}
              onChange={e => {
                setFilterCategory(e.target.value);
                setFilterValue("");
              }}
            >
              <option value="all">All Categories</option>
              <option value="author">Author</option>
              <option value="genre">Genre</option>
              <option value="title">Title</option>
            </select>

            {filterCategory !== "all" && (
              <input
                type="text"
                placeholder={`Enter ${filterCategory} to filter`}
                value={filterValue}
                onChange={e =>
                  setFilterValue(e.target.value)
                }
              />
            )}
          </div>

          <div className="filter-group">
            <label htmlFor="sort-books">
              Sort Books By
            </label>

            <select
              id="sort-books"
              value={sortBy}
              onChange={e =>
                setSortBy(e.target.value)
              }
            >
              <option value="title">Title (A-Z)</option>
              <option value="author">Author (A-Z)</option>
              <option value="genre">Genre (A-Z)</option>
              <option value="yearPublished">
                Year Published (Oldest First)
              </option>
              <option value="id">
                Book ID (Ascending)
              </option>
            </select>
          </div>

        </div>

        <button
          type="button"
          className="reset-filter-btn"
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      </section>

      <section className="panel">
        <h2>My Collection</h2>

        {displayedBooks.length === 0 ? (
          <p>
            {searchMessage
              ? "No matching book to display."
              : books.length === 0
                ? "No books yet. Add your first book!"
                : "No books match your current filters."}
          </p>
        ) : (
          <div className="book-grid">
            {displayedBooks.map(book => (
              <div className="book-card" key={book.id}>
                <p>
                  <strong>Book ID: {book.id}</strong>
                </p>

                <h3>{book.title}</h3>
                <p>By {book.author}</p>
                <p>
                  {book.genre} • {book.yearPublished}
                </p>

                <span
                  className={book.isRead ? "read" : "unread"}
                >
                  {book.isRead ? "Read" : "To Read"}
                </span>

                <div className="actions">
                  <button onClick={() => editBook(book)}>
                    Edit
                  </button>

                  <button onClick={() => deleteBook(book.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
