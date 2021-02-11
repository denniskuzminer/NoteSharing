import React, { Component } from "react";
import SearchBar from "material-ui-search-bar";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import MuiDialogContent from "@material-ui/core/DialogContent";
import book from "./book.jpg";
import axios from "axios";
import { authMiddleWare } from "../util/auth";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = (theme) => ({
  root: {
    borderRadius: 3,
    border: 0,
    height: 48,
    backgroundColor: theme.palette.background.paper,
  },
  dialog: { marginTop: "14px" },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

class search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      results: [],
      open: false,
      item: {
        school: "",
        class: "",
        title: "",
        description: "",
        fileUrl: "",
        noteId: "",
      },
    };
  }

  componentWillMount = (newValue) => {
    console.log("VALUE: " + newValue);
    authMiddleWare(this.props.history);
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .get("/notes/search?string=" + newValue)
      .then((response) => {
        this.setState({
          uiLoading: false,
          results: response.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    console.log("checkValue: " + JSON.stringify(this.state.results));
  };

  // handleClickOpen = () => {
  //   this.setState({ open: true });
  // };

  handleViewClose = () => {
    this.setState({ open: false });
  };

  handleNoteSelect = (param) => {
    this.setState({ item: param });
    this.setState({ open: true });
    console.log(this.state.item);
    console.log(param);
  };

  render() {
    const { classes } = this.props;

    const DialogContent = withStyles((theme) => ({
      viewRoot: {
        padding: theme.spacing(2),
      },
    }))(MuiDialogContent);

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
              marginBottom: 0,
              borderRadius: "8px",
            }}
            onChange={(newValue) => {
              console.log("value: " + newValue);
              this.componentWillMount(newValue);
              this.setState(this.state.notes);
            }}
          />
          <div
            style={
              this.state.results == ""
                ? { display: "none" }
                : { display: "block" }
            }
          >
            <div
              style={{
                marginTop: "15px",
                marginLeft: "220px",
                marginRight: "220px",
                maxWidth: 4000,
                width: 800,
                bottom: 400,
                backgroundColor: "white",
                borderRadius: "8px",
              }}
            >
              <List>
                {this.state.results.map((item) => (
                  <ListItem
                    button
                    className={classes.root}
                    onClick={this.handleNoteSelect.bind(this, item)}
                  >
                    {item.title}, {item.school}, {item.class}
                  </ListItem>
                ))}
              </List>
            </div>
          </div>
          <Dialog
            TransitionComponent={Transition}
            className={classes.dialog}
            maxWidth={"lg"}
            fullWidth={true}
            open={this.state.open}
            onClose={this.handleViewClose.bind(this)}
          >
            <IconButton
              className={classes.closeButton}
              edge="start"
              color="inherit"
              onClick={this.handleViewClose.bind(this)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <DialogContent>
              <div style={{ float: "left" }}>
                <DialogContent dividers>
                  <TextField
                    // fullWidth
                    id="noteDetails"
                    name="title"
                    multiline
                    readonly
                    rows={1}
                    rowsMax={25}
                    value={this.state.item ? this.state.item.title : null}
                    InputProps={{
                      disableUnderline: true,
                    }}
                  />
                </DialogContent>
                <DialogContent dividers>
                  <TextField
                    // fullWidth
                    id="noteDetails"
                    name="school"
                    multiline
                    readonly
                    rows={1}
                    rowsMax={25}
                    value={this.state.item ? this.state.item.school : null}
                    InputProps={{
                      disableUnderline: true,
                    }}
                  />
                </DialogContent>
                <DialogContent dividers>
                  <TextField
                    fullWidth
                    id="noteDetails"
                    name="class"
                    multiline
                    readonly
                    rows={1}
                    rowsMax={25}
                    value={this.state.item ? this.state.item.class : null}
                    InputProps={{
                      disableUnderline: true,
                    }}
                  />
                </DialogContent>
                <DialogContent>
                  <TextField
                    fullWidth
                    id="noteDetails"
                    name="description"
                    multiline
                    readonly
                    // rows={20.8}
                    rowsMax={25}
                    value={this.state.item ? this.state.item.description : null}
                    InputProps={{
                      disableUnderline: true,
                    }}
                  />
                </DialogContent>
              </div>
              <div style={{ float: "right" }}>
                <DialogContent
                  dividers
                  style={
                    this.state.item
                      ? this.state.item.fileUrl.includes(".jpg")
                        ? { display: "block" }
                        : { display: "none" }
                      : null
                  }
                >
                  <img
                    width="940px"
                    height="600px"
                    src={this.state.item ? this.state.item.fileUrl : null}
                    alt="new"
                  />
                </DialogContent>
                <DialogContent
                  dividers
                  style={
                    this.state.item
                      ? this.state.item.fileUrl.includes(".png")
                        ? { display: "block" }
                        : { display: "none" }
                      : null
                  }
                >
                  <img
                    width="940px"
                    height="600px"
                    src={this.state.item ? this.state.item.fileUrl : null}
                    alt="new"
                  />
                </DialogContent>
                <DialogContent
                  dividers
                  style={
                    this.state.item
                      ? this.state.item.fileUrl.includes(".pdf")
                        ? { display: "block" }
                        : { display: "none" }
                      : null
                  }
                >
                  <iframe
                    className={"pdf"}
                    width="940px"
                    height="600px"
                    frameborder="0"
                    src={`https://docs.google.com/gview?url=${`${this.state.item.fileUrl}`}&embedded=true`}
                  ></iframe>
                </DialogContent>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    );
  }
}
export default withStyles(useStyles)(search);
