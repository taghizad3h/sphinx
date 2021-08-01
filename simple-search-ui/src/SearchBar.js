import { Component } from "react";

class SearchBar extends Component {
  constructor() {
    super();
    this.state = {query:""}
  }

  render() {
    return (
      <div className="input-group col-md-4">
        <input
          className="form-control py-2"
          type="search"
          placeholder="search"
          value={this.state.query}
          onChange={event=>this.setState({query:event.target.value})}
        />
        <span className="input-group-append">
          <button className="btn btn-outline-secondary" type="button" onClick={this.props.searchHandler}>
            <i className="fa fa-search"></i>

          </button>
        </span>
      </div>
    );
  }
}

export default SearchBar;
