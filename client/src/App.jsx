
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

  async function saveBook(e) {
    e.preventDefault();

    const book = {
      ...form,
      yearPublished: Number(form.yearPublished)
    };

    if (editingId !== null) book.id = editingId;

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
      await loadBooks();
    } catch {
      setError("Unable to delete book.");
    }
  }

  return (
    <div className="container">
      <header>
        <h1>📚 MyLibrary</h1>
        <p>Your personal book collection manager</p>
      </header>

      <section className="stats">
        <div>Total Books: {books.length}</div>
        <div>Books Read: {books.filter(b => b.isRead).length}</div>
        <div>To Read: {books.filter(b => !b.isRead).length}</div>
      </section>

      <section className="panel">
        <h2>{editingId !== null ? "Edit Book" : "Add a New Book"}</h2>

        <form onSubmit={saveBook}>
          <input
            placeholder="Book Title"
            required
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />

          <input
            placeholder="Author"
            required
            value={form.author}
            onChange={e => setForm({ ...form, author: e.target.value })}
          />

          <input
            placeholder="Genre"
            value={form.genre}
            onChange={e => setForm({ ...form, genre: e.target.value })}
          />

          <input
            type="number"
            placeholder="Year Published"
            min="1"
            max={new Date().getFullYear()}
            required
            value={form.yearPublished}
            onChange={e => setForm({ ...form, yearPublished: e.target.value })}
          />

          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.isRead}
              onChange={e => setForm({ ...form, isRead: e.target.checked })}
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
        <h2>My Collection</h2>

        {books.length === 0 ? (
          <p>No books yet. Add your first book!</p>
        ) : (
          <div className="book-grid">
            {books.map(book => (
              <div className="book-card" key={book.id}>
                <h3>{book.title}</h3>
                <p>By {book.author}</p>
                <p>{book.genre} • {book.yearPublished}</p>
                <span className={book.isRead ? "read" : "unread"}>
                  {book.isRead ? "Read" : "To Read"}
                </span>
                <div className="actions">
                  <button onClick={() => editBook(book)}>Edit</button>
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
