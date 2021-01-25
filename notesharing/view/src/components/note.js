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

import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { authMiddleWare } from "../util/auth";

import React, { Component } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const styles = (theme) => ({
  // .., // Existing CSS elements
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
    width: "90%",
    marginLeft: 13,
    marginTop: theme.spacing(11),
  },
  toolbar: theme.mixins.toolbar,
  root: {
    minWidth: 470,
  },
  noteChange: { top: "20px", width: "90%" },
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
  dialogeStyle: {
    maxWidth: "50%",
  },
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
      form_data.append("class", this.state.school);
      form_data.append("title", this.state.title);
      form_data.append("description", this.state.description);
      form_data.append("noteFile", this.state.file);
      let options = {};
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
      //   for (var value of form_data.values()) {
      //     console.log(value);
      //   }
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
          }
          console.log(error);
          this.setState({
            uiLoading: false,
            imageError: "Error in posting the data",
          });

          //   this.setState({ open: true, errors: error.response.data });
          //   console.log(error);
        });
    };

    const handleViewClose = () => {
      this.setState({ viewOpen: false });
    };

    const handleClose = (event) => {
      this.setState({ open: false });
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
            // fullScreen
            className={classes.noteChange}
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
          >
            <AppBar className={classes.noteChange}>
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
                    : "Create a new Note"}
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
                    label="Note Title"
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
                  <Button variant="contained" component="label">
                    Upload File
                    <input type="file" onChange={this.handleFileChange} />
                  </Button>
                  {/* <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="noteFile"
                    label="Class"
                    name="class"
                    autoComplete="noteClass"
                    helperText={errors.class}
                    value={this.state.fileUrl}
                    error={errors.fileUrl ? true : false}
                    onChange={this.handleChange}
                  /> */}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="noteDescription"
                    label="Note Description"
                    name="description"
                    autoComplete="noteDescription"
                    multiline
                    rows={3}
                    rowsMax={25}
                    helperText={errors.description}
                    error={errors.description ? true : false}
                    onChange={this.handleChange}
                    value={this.state.description}
                  />
                </Grid>
              </Grid>
            </form>
          </Dialog>

          <Grid container spacing={2}>
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
            aria-labelledby="customized-dialog-title"
            open={viewOpen}
            fullWidth
            classes={{ paperFullWidth: classes.dialogeStyle }}
          >
            <DialogTitle id="customized-dialog-title" onClose={handleViewClose}>
              {this.state.title}
            </DialogTitle>
            <DialogContent dividers>
              <TextField
                fullWidth
                id="noteDetails"
                name="body"
                multiline
                readonly
                rows={1}
                rowsMax={25}
                value={this.state.body}
                InputProps={{
                  disableUnderline: true,
                }}
              />
            </DialogContent>
          </Dialog>
        </main>
      );
    }
  }
}
export default withStyles(styles)(note);
