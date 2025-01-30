import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";

const App = () => {
  const [books, setBooks] = useState([]);
  const [soldCount, setSoldCount] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/books");
        const data = await response.json();
        setBooks(data);

        const soldResponse = await fetch("http://localhost:5000/api/soldCount");
        const soldData = await soldResponse.json();
        setSoldCount(soldData.soldCount); 
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const totalAvailableBooks = books.reduce((acc, book) => acc + book.quantity, 0);

  return (
    <div>
      <Header availableCount={totalAvailableBooks} soldCount={soldCount} />
      <nav>
        <Link to="/app">Home</Link> | <Link to="/app/buy">Buy Books</Link> |{" "}
        <Link to="/app/sell">Sell Books</Link>
      </nav>
      <Outlet context={{ books, setBooks, soldCount, setSoldCount }} />
    </div>
  );
};

export default App;
