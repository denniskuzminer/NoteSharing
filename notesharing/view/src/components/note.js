import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import CardContent from "@material-ui/core/CardContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Input from "@material-ui/core/Input";
import { Alert, AlertTitle } from "@material-ui/lab";
import Collapse from "@material-ui/core/Collapse";

import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { authMiddleWare } from "../util/auth";

import React, { Component, useState } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const styles = (theme) => ({
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  submitButton: {
    display: "block",
    color: "white",
    textAlign: "center",
    position: "absolute",
    top: 14,
    right: 10,
  },
  floatingButton: {
    position: "fixed",
    bottom: 0,
    right: 0,
  },
  form: {
    width: "96.8%",
    marginLeft: 13,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  toolbar: theme.mixins.toolbar,
  root: {
    minWidth: 220,
    borderRadius: "8px",
    position: "inherit",
  },
  grid: {
    maxWidth: "82.45%",
    marginLeft: theme.spacing(0.25),
    padding: theme.spacing(2),
    position: "absolute",
  },
  noteChange: {
    top: "94px",
    width: "60%",
    marginLeft: 340,
  },
  noteChangeTitle: {
    top: "97px",
    width: "56%",
    marginLeft: 13,
    right: 305,
    borderTopRightRadius: "5px",
    borderTopLeftRadius: "5px",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  pos: {
    marginBottom: 12,
  },
  uiProgess: {
    position: "fixed",
    zIndex: "1000",
    height: "31px",
    width: "31px",
    left: "50%",
    top: "35%",
  },
  dialogeStyle: { marginTop: "14px" },
  viewRoot: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  alert: {
    width: "400px",
    bottom: "8px ",
    right: "16px ",
  },
});

class note extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: "",
      school: "",
      class: "",
      title: "",
      description: "",
      fileUrl: "",
      noteId: "",
      errors: [],
      open: false,
      uiLoading: true,
      buttonType: "",
      viewOpen: false,
      fileUploaded: false,
      empty: false,
      openEmptyField: false,
    };

    this.deleteNoteHandler = this.deleteNoteHandler.bind(this);
    this.handleEditClickOpen = this.handleEditClickOpen.bind(this);
    this.handleViewOpen = this.handleViewOpen.bind(this);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleFileChange = (event) => {
    this.setState({
      file: event.target.files[0],
      fileUploaded: true,
    });
  };

  componentWillMount = () => {
    authMiddleWare(this.props.history);
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    axios
      .get("/notes")
      .then((response) => {
        this.setState({
          notes: response.data,
          uiLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteNoteHandler(data) {
    authMiddleWare(this.props.history);
    const authToken = localStorage.getItem("AuthToken");
    axios.defaults.headers.common = { Authorization: `${authToken}` };
    let noteId = data.note.noteId;
    axios
      .delete(`note/${noteId}`)
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleEditClickOpen(data) {
    this.setState({
      school: data.note.school,
      class: data.note.class,
      title: data.note.title,
      description: data.note.description,
      fileUrl: data.note.fileUrl,
      noteId: data.note.noteId,
      buttonType: "Edit",
      open: true,
    });
  }

  handleViewOpen(data) {
    this.setState({
      school: data.note.school,
      class: data.note.class,
      title: data.note.title,
      description: data.note.description,
      fileUrl: data.note.fileUrl,
      viewOpen: true,
    });
  }

  render() {
    const DialogTitle = withStyles(styles)((props) => {
      const { children, classes, onClose, ...other } = props;
      return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
          <Typography variant="h6">{children}</Typography>
          {onClose ? (
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          ) : null}
        </MuiDialogTitle>
      );
    });

    const DialogContent = withStyles((theme) => ({
      viewRoot: {
        padding: theme.spacing(2),
      },
    }))(MuiDialogContent);

    dayjs.extend(relativeTime);
    const { classes } = this.props;
    const { open, errors, viewOpen } = this.state;

    const handleClickOpen = () => {
      this.setState({
        noteId: "",
        school: "",
        class: "",
        title: "",
        description: "",
        fileUrl: "",
        buttonType: "",
        open: true,
      });
    };

    const handleSubmit = (event) => {
      authMiddleWare(this.props.history);
      event.preventDefault();
      let form_data = new FormData();
      form_data.append("school", this.state.school);
      form_data.append("class", this.state.class);
      form_data.append("title", this.state.title);
      form_data.append("description", this.state.description);
      form_data.append("noteFile", this.state.file);
      let options = {};
      if (
        !this.state.school ||
        !this.state.class ||
        !this.state.title ||
        !this.state.description
      ) {
        this.setState({ empty: true, openEmptyField: true });
        return;
      }
      if (this.state.buttonType === "Edit") {
        options = {
          url: `/note/${this.state.noteId}`,
          method: "put",
          data: form_data,
        };
      } else {
        options = {
          url: "/note",
          method: "post",
          data: form_data,
        };
      }
      const authToken = localStorage.getItem("AuthToken");
      axios.defaults.headers.common = { Authorization: `${authToken}` };
      axios(options)
        .then(() => {
          this.setState({ open: false });
          window.location.reload();
        })
        .catch((error) => {
          if (error.response.status === 403) {
            this.props.history.push("/login");
          } else {
            console.log(error);
            this.setState({
              uiLoading: false,
              imageError: "Error in posting the data",
            });
          }
        });
    };

    const handleViewClose = () => {
      this.setState({ viewOpen: false });
    };

    const handleClose = (event) => {
      this.setState({ open: false });
      this.setState({ fileUploaded: false });
      handleEmptyField(event);
    };

    const handleEmptyField = (event) => {
      this.setState({ openEmptyField: false });
    };

    if (this.state.uiLoading === true) {
      return (
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {this.state.uiLoading && (
            <CircularProgress size={150} className={classes.uiProgess} />
          )}
        </main>
      );
    } else {
      return (
        <main className={classes.content}>
          <div className={classes.toolbar} />

          <IconButton
            className={classes.floatingButton}
            color="primary"
            aria-label="Add Note"
            onClick={handleClickOpen}
          >
            <AddCircleIcon style={{ fontSize: 60 }} />
          </IconButton>
          <Dialog
            maxWidth
            className={classes.noteChange}
            open={open}
            onClose={handleClose}
            // TransitionComponent={Transition}
          >
            <AppBar className={classes.noteChangeTitle}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                  {this.state.buttonType === "Edit"
                    ? "Edit Note"
                    : "Create a new note"}
                </Typography>
                <Button
                  autoFocus
                  color="inherit"
                  onClick={handleSubmit}
                  className={classes.submitButton}
                >
                  {this.state.buttonType === "Edit" ? "Save" : "Submit"}
                </Button>
              </Toolbar>
            </AppBar>

            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="noteTitle"
                    label="Title"
                    name="title"
                    autoComplete="noteTitle"
                    helperText={errors.title}
                    value={this.state.title}
                    error={errors.title ? true : false}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="noteSchool"
                    label="School"
                    name="school"
                    autoComplete="noteSchool"
                    helperText={errors.school}
                    value={this.state.school}
                    error={errors.school ? true : false}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="noteClass"
                    label="Class"
                    name="class"
                    autoComplete="noteClass"
                    helperText={errors.class}
                    value={this.state.class}
                    error={errors.class ? true : false}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    color="primary"
                    type="submit"
                    component="label"
                  >
                    Upload File
                    <Input
                      type="file"
                      style={{ display: "none" }}
                      onChange={this.handleFileChange}
                    />
                  </Button>
                  <div
                    style={{
                      float: "right",
                      marginTop: "8px",
                      fontSize: "16px",
                    }}
                  >
                    {this.state.fileUploaded
                      ? `File chosen: ${this.state.file.name}`
                      : null}
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="noteDescription"
                    label="Description"
                    name="description"
                    autoComplete="noteDescription"
                    multiline
                    rows={6}
                    rowsMax={6}
                    helperText={errors.description}
                    error={errors.description ? true : false}
                    onChange={this.handleChange}
                    value={this.state.description}
                  />
                </Grid>
              </Grid>
            </form>
          </Dialog>

          <Grid container spacing={2} className={classes.grid}>
            {this.state.notes.map((note) => (
              <Grid item xs={12} sm={6}>
                <Card className={classes.root} variant="outlined">
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      {note.title}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      {dayjs(note.createdAt).fromNow()}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {/* {`${note.body.substring(0, 65)}`} */}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => this.handleViewOpen({ note })}
                    >
                      {" "}
                      View{" "}
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => this.handleEditClickOpen({ note })}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => this.deleteNoteHandler({ note })}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Dialog
            onClose={handleViewClose}
            maxWidth={"lg"}
            fullWidth={true}
            open={viewOpen}
            classes={{ paperFullWidth: classes.dialogeStyle }}
            TransitionComponent={Transition}
          >
            <DialogContent>
              <IconButton
                className={classes.closeButton}
                edge="start"
                color="inherit"
                onClick={handleViewClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>

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
                    value={this.state.title}
                    InputProps={{
                      disableUnderline: true,
                    }}
                  />
                </DialogContent>
                <DialogContent dividers>
                  <TextField
                    fullWidth
                    id="noteDetails"
                    name="school"
                    multiline
                    readonly
                    rows={1}
                    rowsMax={25}
                    value={this.state.school}
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
                    value={this.state.class}
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
                    value={this.state.description}
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
                    this.state.fileUrl.includes(".jpg")
                      ? { display: "block" }
                      : { display: "none" }
                  }
                >
                  <img
                    width="940px"
                    height="600px"
                    src={this.state.fileUrl}
                    alt="new"
                  />
                </DialogContent>
                <DialogContent
                  dividers
                  style={
                    this.state.fileUrl.includes(".png")
                      ? { display: "block" }
                      : { display: "none" }
                  }
                >
                  <img
                    width="940px"
                    height="600px"
                    src={this.state.fileUrl}
                    alt="new"
                  />
                </DialogContent>
                <DialogContent
                  dividers
                  style={
                    this.state.fileUrl.includes(".pdf")
                      ? { display: "block" }
                      : { display: "none" }
                  }
                >
                  <iframe
                    className={"pdf"}
                    width="940px"
                    height="600px"
                    frameborder="0"
                    src={`https://docs.google.com/gview?url=${`${this.state.fileUrl}`}&embedded=true`}
                  ></iframe>
                </DialogContent>
              </div>
            </DialogContent>
          </Dialog>
          <div
            onClose={handleEmptyField}
            open={this.state.openEmptyField}
            style={
              this.state.openEmptyField
                ? {
                    display: "block",
                    position: "relative",
                    zIndex: 9999,
                    marginTop: "580px",
                    marginLeft: "830px",
                  }
                : { display: "none" }
            }
          >
            <Collapse in={this.state.openEmptyField}>
              <Alert
                className={classes.alert}
                severity="error"
                open={this.state.openEmptyField}
                onClose={handleEmptyField}
              >
                <AlertTitle>Error</AlertTitle>
                Please make sure that you have filled out all text fields
              </Alert>
            </Collapse>
          </div>
        </main>
      );
    }
  }
}
export default withStyles(styles)(note);
