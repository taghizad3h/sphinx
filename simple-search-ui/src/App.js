import Navigation from "./Navigation";
import SearchResult from "./SearchResult";
import { Container } from "react-bootstrap";
import Axios from "axios";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";

const searchURL = "http://127.0.0.1:7000/search";

function App() {
  const [err, setErr] = useState("");
  const [errBool, setErrBool] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [searchResult, setSearchResult] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [query, setQuery] = useState("");
  const [indexNames, setIndexNames] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState("");

  const queryHanlder = () => {
    Axios.get(searchURL, { params: { query: query, index: selectedIndex, page: pageNumber - 1 } })
      .then((response) => {
        setSearchResult(response.data);
      })
      .catch((err) => {
        setErr(err.message);
        setErrBool(true);
        setLoading(false);
        console.log(err);
      });
  };

  const handleSelectedIndexName = (name) => {
    console.log(name);
    setSelectedIndex(name);
  };

  const paginatioHanlder = (newPageNumber) => {
    setPageNumber(newPageNumber);
    console.log(newPageNumber);
    queryHanlder();
  };

  useEffect(() => {
    Axios.get("http://127.0.0.1:7000/indexes")
      .then((response) => {
        setIndexNames(response.data);
        setSelectedIndex(response.data[0])
        console.log("index names "+response.data);
      })
      .catch((err) => {
        setErr(err.message);
        setErrBool(true);
        setLoading(false);
        console.log(err);
      });
  }, []);

  return (
    <Container>
      <Navigation
        query={query}
        setQuery={setQuery}
        queryHanlder={queryHanlder}
        indexNames={indexNames}
        handleSelectedIndexName={handleSelectedIndexName}
        selectedIndex = {selectedIndex}
      />
      <SearchResult searchResult={searchResult} />
      <div className="d-flex justify-content-center">
        {searchResult && (
          <ReactPaginate
            previousLabel={"قبلی"}
            nextLabel={"بعدی"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={setSearchResult.total_found / pageSize}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={(e) => {
              paginatioHanlder(e.selected);
            }}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />
        )}
      </div>
    </Container>
  );
}

export default App;
