import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

const BuyBooks = () => {
  const { books, setBooks, soldCount, setSoldCount } = useOutletContext();
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [message, setMessage] = useState("");
  const [purchasedBooks, setPurchasedBooks] = useState([]);

  useEffect(() => {
    // Clear previous local storage data
    localStorage.removeItem("books");
    localStorage.removeItem("purchasedBooks");

    const storedBooks = localStorage.getItem("books");

    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    } else {
      const fetchBooks = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/book");
          const data = await response.json();
          setBooks(data);
          localStorage.setItem("books", JSON.stringify(data));
          const totalSoldCount = data.reduce((acc, book) => acc + book.soldCount, 0);
          setSoldCount(totalSoldCount);
        } catch (error) {
          console.error("Error fetching books:", error);
        }
      };

      fetchBooks();
    }

    setPurchasedBooks([]);
  }, [setBooks, setSoldCount]);

  const handleQuantityChange = (index, value) => {
    setSelectedQuantities({
      ...selectedQuantities,
      [index]: value,
    });
  };

  const handleBuy = async (index) => {
    const selectedQuantity = parseInt(selectedQuantities[index] || 0, 10);
  
    if (!selectedQuantity || selectedQuantity <= 0) {
      setMessage("Please select a valid quantity.");
      return;
    }
  
    if (books[index].quantity < selectedQuantity) {
      setMessage(`Only ${books[index].quantity} available for "${books[index].title}".`);
      return;
    }
  
    // Update the soldCount in the backend
    try {
      const response = await fetch(`http://localhost:5000/api/book/soldCount/${books[index].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          soldQuantity: selectedQuantity,
        }),
      });
  
      if (response.ok) {
        // Update the frontend (e.g., decrement the quantity, update sold count)
        const updatedBooks = [...books];
        updatedBooks[index].quantity -= selectedQuantity;
        updatedBooks[index].soldCount += selectedQuantity;
        setBooks(updatedBooks);

        // Fetch the updated sold count
        const soldResponse = await fetch("http://localhost:5000/api/book");
        const soldBooks = await soldResponse.json();
        const updatedSoldCount = soldBooks.reduce((acc, book) => acc + book.soldCount, 0);
        setSoldCount(updatedSoldCount);

        setSelectedQuantities({ ...selectedQuantities, [index]: 0 });
        setMessage("Purchase successful!");
      } else {
        setMessage("Failed to update sold count.");
      }
    } catch (error) {
      console.error("Error updating sold count:", error);
      setMessage("Error occurred during the purchase.");
    }
  };

  return (
    <div className="buy-books">
      <h2>Buy Books</h2>
      {message && <p className="message">{message}</p>}
      {books.length > 0 ? (
        <div className="book-grid">
          {books.map((book, index) => (
            <div key={index} className="book-card">
              <p><strong>Title:</strong> {book.title}</p>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Price:</strong> ₹{book.amount}</p>
              <p><strong>Available Quantity:</strong> {book.quantity}</p>
              <div className="quantity-box">
                <label>
                  Quantity:{" "}
                  <input
                    type="number"
                    min="1"
                    max={book.quantity}
                    value={selectedQuantities[index] || ""}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    placeholder="Select quantity"
                  />
                </label>
              </div>
              <button
                onClick={() => handleBuy(index)}
                className="buy-button buy-button-green"
              >
                Buy
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No books available for purchase.</p>
      )}

      {purchasedBooks.length > 0 && (
        <div className="purchased-books">
          <h3>Books Purchased:</h3>
          <ul>
            {purchasedBooks.map((book, index) => (
              <li key={index}>
                <strong>{book.title}</strong> by {book.author} - {book.quantity} copies for ₹
                {book.price * book.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BuyBooks;
