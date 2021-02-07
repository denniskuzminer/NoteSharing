import React, { Component } from "react";
import SearchBar from "material-ui-search-bar";
import book from "./book.jpg";
import axios from "axios";
import { authMiddleWare } from "../util/auth";

export default class search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      results: [],
    };
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
        onChange={(newValue) => {
        console.log("value: " + newValue);
        this.componentWillMount(newValue);
        this.setState(this.state.notes)
        }}
      //  onRequestSearch={() => console.log("value" + this.state.value)} // doSomethingWith(finalQuery)
        />
        </div>
      </main>
    );
  }
  //get searched notes
  componentWillMount = (newValue) => {
    console.log("VALUE: " + newValue)
    authMiddleWare(this.props.history);
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .get("/notes/search?string=" + newValue)
      .then((response) => {
        this.setState({
          uiLoading: false,
          results: response.data
        });
      })
      .catch((err) => {
        console.log(err);
      });
      console.log("checkValue: " + this.state.results);
  }
}
/*
fix form upload - pull up, upload file not shown, style the pdf viewer
*/
