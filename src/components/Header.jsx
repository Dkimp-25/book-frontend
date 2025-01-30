const Header = ({ availableCount, soldCount }) => {
  return (
    <header className="header">
      DK Book Stall
      <div className="stats-box">
        <div className="stat-item">
          <h3>Available</h3>
          <p>{availableCount}</p>
        </div>
        <div className="stat-item">
          <h3>Sold</h3>
          <p>{soldCount}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
