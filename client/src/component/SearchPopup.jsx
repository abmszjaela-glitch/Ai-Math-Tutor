const SearchPopup = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="search-popup">
      <div className="search-popup__overlay search-toggler"></div>

      <div className="search-popup__content">
        <form
          role="search"
          method="get"
          className="search-popup__form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            id="search"
            name="search"
            placeholder="Search Here..."
          />

          <button
            type="submit"
            aria-label="search submit"
            className="search-btn"
          >
            <span>
              <i className="far fa-search"></i>
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchPopup;