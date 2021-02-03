import React, { Component } from "react";
import SearchBar from "material-ui-search-bar";
import book from "./book.jpg";

export default class search extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
  }
  render() {
    return (
      <main>
        <div
          style={{
            padding: "15px",
            marginTop: "63px",
            height: "400px",
            backgroundRepeat: "no-repeat",
            backgroundSize: "auto",
            backgroundImage: `url(${book})`,
            borderRadius: "5px",
          }}
        >
          <div
            style={{
              marginLeft: "460px",
              marginRight: "220px",
              marginTop: "100px",
              width: 300,
              fontSize: "30px",
              textAlign: "center",
              fontWeight: "bolder",
              backgroundColor: "grey",
              color: "white",
              borderRadius: "5px",
            }}
          >
            Search All Notes
          </div>
          <SearchBar
            value={this.state.value}
            style={{
              margin: "220px",
              marginTop: "15px",
              maxWidth: 4000,
              width: 800,
            }}
            onChange={(newValue) => this.setState({ value: newValue })}
            // onRequestSearch={() => doSomethingWith(this.state.value)}
          />
        </div>
      </main>
    );
  }
}
/*
fix form upload - pull up, upload file not shown, style the pdf viewer
*/
