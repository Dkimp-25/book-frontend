import { useState } from "react";

const AddBookForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    quantity: "",
  });


  
  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.price || !formData.quantity) {
      alert("All fields are required.");
      return;
    }

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
      const newBook = await response.json();
      alert("Book added successfully!");
    } catch (error) {
      console.error("Error adding book:", error);
    }

    setFormData({ title: "", author: "", price: "", quantity: "" });
  };

  return (
    <form onSubmit={handleAddBook}>
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
        onChange={(e) =>
          setFormData({ ...formData, quantity: e.target.value })
        }
      />
      <button type="submit">Add Book</button>
    </form>
  );
};

export default AddBookForm;
