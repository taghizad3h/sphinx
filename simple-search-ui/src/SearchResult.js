import { Table } from "react-bootstrap";

const SearchResult = (props) => {
  const { searchResult } = props;
  return (
    <div style={{ width: "90%", margin: "0 auto" }}>
      <Table
        variant="default"
        style={{ width: "100%", margin: "20px auto" }}
        striped
        bordered
        responsive
        dir="rtl"
      >
        <thead>
          <tr>
            <td style={{ textAlign: "right", width: "5%" }}>ردیف</td>
            <td style={{ textAlign: "right", width: "60%" }}>نتیجه</td>
            <td style={{ textAlign: "right", width: "35%" }}>اسنیپت</td>
          </tr>
        </thead>

        <tbody>
          {searchResult &&
            searchResult.hits.map((result, index) => {
              return (
                <tr key={result.id}>
                  <td style={{textAlign: "right"}}>{index + 1}</td>
                  <td style={{textAlign: "right"}}>{result.txt}</td>
                  <td style={{textAlign: "right"}} dangerouslySetInnerHTML={{__html: result.snippet}}/>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </div>
  );
};

export default SearchResult;
