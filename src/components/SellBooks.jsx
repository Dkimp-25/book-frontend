import { useState } from "react";
import { useOutletContext } from "react-router-dom";

const SellBooks = () => {
  const { books, setBooks } = useOutletContext();
  const [formData, setFormData] = useState({ title: "", author: "", price: "", quantity: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const existingBook = books.find((b) => b.title === formData.title);
    
    if (existingBook) {
      // Update quantity in the database
      try {
        const response = await fetch(`http://localhost:5000/api/book/${existingBook.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: existingBook.quantity + Number(formData.quantity),
          }),
        });

        if (response.ok) {
          // Update book quantity in the local state
          setBooks(
            books.map((b) =>
              b.title === formData.title
                ? { ...b, quantity: b.quantity + Number(formData.quantity) }
                : b
            )
          );
        } else {
          console.error("Failed to update book quantity in the database.");
        }
      } catch (error) {
        console.error("Error updating book quantity:", error);
      }
    } else {
      // Add new book to the database
      try {
        const response = await fetch("http://localhost:5000/api/book", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            author: formData.author,
            amount: formData.price,
            quantity: formData.quantity,
          }),
        });

        if (response.ok) {
          const newBook = await response.json();
          setBooks([...books, newBook]); // Add the new book to local state
        } else {
          console.error("Failed to add new book to the database.");
        }
      } catch (error) {
        console.error("Error adding new book:", error);
      }
    }

    setFormData({ title: "", author: "", price: "", quantity: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sell Books</h2>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Author"
        value={formData.author}
        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
      />
      <button type="submit">Sell</button>
    </form>
  );
};

export default SellBooks;
