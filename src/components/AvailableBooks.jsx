import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import AddBookForm from "./AddBookForm";

const AvailableBooks = () => {
  const { books, setBooks } = useOutletContext();

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/book"); // Update with your backend API URL
      const data = await response.json();
      setBooks(data); // Set books state to fetched data
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []); // Fetch books on initial render

  const handleDelete = async (index) => {
    try {
      const bookToDelete = books[index];

      // Delete the book from the backend
      const response = await fetch(`http://localhost:5000/api/book/${bookToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // If successful, update the frontend by removing the deleted book from the books state
        setBooks(books.filter((_, i) => i !== index));
      } else {
        console.error("Failed to delete book");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div className="book-list">
      <h2>Available Books</h2>
      {books.length > 0 ? (
        <div className="book-grid">
          {books.map((book, index) => (
            <div key={index} className="book-card">
              <p><strong>Title:</strong> {book.title}</p>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Price:</strong> ₹{book.amount}</p>
              <p><strong>Quantity:</strong> {book.quantity}</p>
              <button
                className="delete-button"
                onClick={() => handleDelete(index)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No books available.</p>
      )}
      <hr />
      <h3>Add a New Book</h3>
      <AddBookForm />
    </div>
  );
};

export default AvailableBooks;
