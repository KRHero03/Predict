import React from "react";
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import Proptypes from 'prop-types';
import axios from 'axios';
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import Fab from '@material-ui/core/Fab';
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InfoIcon from "@material-ui/icons/HelpOutline";
import { setCurrentUser } from "../../actions/authActions";
import { TextField } from "@material-ui/core";
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';


const styles = (theme) => ({
  paper: {
    display: 'flex',
    padding: theme.spacing(1),
    color: theme.palette.text.primary,
    margin: 10,
    transition: 'all 0.2s',
    width: '100%',
    textAlign: 'left',
    '&:hover': {
      transform: 'scale(1.01)'
    },

  },
  paperStyled: {
    display: 'flex',
    padding: theme.spacing(1),
    color: 'white',
    backgroundColor: theme.palette.primary.main,
    transition: 'all 0.2s',
    width: '100%',
    textAlign: 'left',

  },
  base: {
    minHeight: '90vh',
    fontWeight: 7,
    fontSize: 40,
    textAlign: 'left',
    marginTop: '25vh',
  },
  title: {
    fontWeight: 'bold',
  },
  description: {
    marginTop: 10,
  },
  content: {
    marginTop: 10,
  },

  stories: {
    maxHeight: '500px',
    overflow: 'auto',
  },
  tags: {
    marginTop: 30,
    fontWeight: 'normal'
  },
  textThin: {
    fontWeight: 350,
    fontSize: 20
  },
  commentButton: {
    marginTop: 30,
    marginBottom: 30
  },
  author: {
    marginTop: 10,
    display: 'flex',
    alignItems: 'center',
  },
  commentBase: {
    marginTop: 30
  },
  comment: {
    marginTop: 10,
    marginBottom: 10,
    boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.5)',
    borderRadius: '4px',
    padding: 10

  },
  titleBox: {
    marginTop: 30,
    marginBottom: 30
  },
  contentBox: {
    marginTop: 30,
    marginBottom: 30
  },
  previewBox: {
    fontSize: 20,
    fontWeight: 'normal'
  },
  icon: {
    fontSize: 40,
    color: theme.palette.primary.main,
    transition: 'all 0.2s',
    '&:hover': {
      fontSize: 50
    }
  },
  divider: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: 'black'
  },
  Logo: {
    [theme.breakpoints.up('sm')]: {
      height: "250px",
      width: "250px"
    },
  },
  link: {
    color: 'black',
    textDecoration: 'none',
    transition: 'all 0.2s',
    width: '100%',
    '&:hover': {
      textDecoration: 'none',
    }
  },
  extraHeight: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  extraHeight1: {
    minHeight: '90vh',
  },
  textWhite: {
    color: 'white',
  },
  desktop: {
    margin: 10,
    [theme.breakpoints.up('sm')]: {
      display: 'none',

    },
  },
  parallaxgap: {
    display: 'flex',
    minHeight: '300px',
    alignItems: 'center',
    fontSize: 28,
    fontWeight: 7,
    marginTop: 25,
    marginBottom: 25,
    justifyContent: 'center',
  },
  parallax: {

    maxHeight: '300px',
    height: '300px',
    alignItems: 'center',
    fontSize: 48,
    fontWeight: 7,
    color: 'white',
    marginTop: 25,
    justifyContent: 'center',
    [theme.breakpoints.up('sm')]: {

      maxHeight: '300px',
      height: '300px',
      display: 'flex',
      alignItems: 'center',
      fontSize: 42,
      fontWeight: 4,
      color: 'white',
      marginTop: 25,
      justifyContent: 'center',
    },
  },
  dialog: {
    position: 'absolute',
    height: '90%',
    width: '90%',
    margin: theme.spacing(3),
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    color: 'white',
    backgroundColor: theme.palette.primary.main,  
    '&:hover':{
      backgroundColor: theme.palette.secondary.main,  

    }
  },

});

class EditStory extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      user: this.props.auth.user,
      isAuthenticated: this.props.auth.isAuthenticated,
      storyID : this.props.match.params.id,
      isLoading: true,
      title: "",
      content: "",
      tags: [],
      description: "",
      openHelp: false,
      tagString: "",
      openSnackbar: false,
      snackbarText: "",
      isEditStoryClicked: false,
    }
  }
  async componentDidMount() {
    await this.props.setCurrentUser();
    this.setState({
      user: this.props.auth.user,
      isAuthenticated: this.props.auth.isAuthenticated
    })
    if (!(this.state.isAuthenticated)) {
      this.props.history.push('/')
    }


    const response = await axios.post('/api/get_edit_story/',{'storyID':this.state.storyID})

    if(Object.keys(response.data).length==0){
      this.props.history.push('/yourstories/')
      return
    }
    
    this.setState({
      isLoading:false,
      title: response.data.title,
      content: response.data.content,
      description: response.data.description,
      tags: response.data.tags,
      tagString : response.data.tags.join(' '),
    })

  }

  render() {
    const { classes } = this.props;

    const handleContent = (e) => {
      this.setState({
        content: e.target.value
      })
    }
    const handleTitle = (e) => {
      this.setState({
        title: e.target.value
      })
    }
    const handleDescription = (e) => {
      this.setState({
        description: e.target.value
      })
    }

    const handleTags = (e) => {
      const tagString = e.target.value
      const tagData = tagString.split(' ').filter((e) => { return e.length > 0 }).splice(0, 5)
      this.setState({
        tags: tagString.length > 0 ? tagData : [],
        tagString: tagString
      })

    }

    const handleHelpDialog = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      this.setState({
        openHelp: !this.state.openHelp
      })
    }


    const handleSnackbar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      this.setState({
        openSnackbar: !this.state.openSnackbar
      })
    }


    const showMessage = (msg) => {
      this.setState({
        snackbarText: msg,
        openSnackbar: true
      })
    }

    const editStory = async () => {
      this.setState({
        isEditStoryClicked: true
      })
      const storyResponse = await axios.post('/api/edit_story', {
        'storyID': this.state.storyID,
        'title': this.state.title,
        'description': this.state.description,
        'content': this.state.content,
        'tags': this.state.tags
      })

      this.setState({
        isEditStoryClicked: false
      })
      if (storyResponse.data.error !== undefined) {
        showMessage(storyResponse.data.error)
        return
      }
      this.props.history.push('/story/' + storyResponse.data.id)

      
    }
    return (
      <div>
        {this.state.isLoading ? (

          <Container className={classes.base}>
            <LinearProgress />
          </Container>
        ) :
          (

            <Container className={classes.base}>
              <Grid item xs={12} className={classes.title}>
                Edit Story
              </Grid>
              <Divider className={classes.divider} />
              <Grid container xs={12} justify="space-between">
                <Grid item xs={12} sm={5} className={classes.contentBox}>
                  <Grid item xs={12}>

                    <TextField
                      autoFocus
                      margin="dense"
                      id="titleTextField"
                      label="Title"
                      value={this.state.title}
                      onChange={handleTitle}
                      type="text"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12}>

                    <TextField
                      autoFocus
                      margin="dense"
                      id="descriptionTextField"
                      label="Description"
                      value={this.state.description}
                      onChange={handleDescription}
                      type="text"
                      fullWidth
                      multiline
                      rows="3"
                    />
                  </Grid>
                  <Grid item xs={12}>

                    <TextField
                      autoFocus
                      margin="dense"
                      id="contentTextField"
                      label="Content"
                      value={this.state.content}
                      onChange={handleContent}
                      type="text"
                      fullWidth
                      multiline
                      rows="15"
                    />
                  </Grid>
                  <Grid item xs={12}>

                    <TextField
                      autoFocus
                      margin="dense"
                      id="tagTextField"
                      label="Tags"
                      value={this.state.tagString}
                      onChange={handleTags}
                      type="text"
                      fullWidth
                    />
                  </Grid>

                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid item xs={12}>
                    <Typography variant="h4">Preview</Typography>
                  </Grid>
                  <Grid item xs={12} className={classes.title}>
                    {this.state.title}
                  </Grid>
                  <Grid item xs={12} className={classes.description}>
                    <Typography color="textSecondary">
                      {this.state.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <ReactMarkdown plugins={[gfm]} className={classes.previewBox}>
                      {this.state.content}
                    </ReactMarkdown>
                  </Grid>
                  <Grid item xs={12} className={classes.tags}>
                    {
                      this.state.tags.map((tag, idx) => {
                        if (idx % 2) return (
                          <Chip label={tag} style={{ marginLeft: 5, marginRight: 5 }} color="secondary" />)
                        else return (
                          <Chip label={tag} style={{ marginLeft: 5, marginRight: 5 }} color="primary" />)
                      })
                    }
                  </Grid>
                </Grid>
                <Grid item xs={12} style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                  {this.state.isEditStoryClicked ? (
                    <CircularProgress />
                  ) : (

                      <Button style={{ width: '100%', marginBottom: 30, marginTop: 30 }} onClick={editStory} color="primary" variant="contained">
                        EDIT STORY
                      </Button>
                    )}
                </Grid>
              </Grid>
              <Dialog class={classes.dialog}
                aria-describedby="alert-dialog-description" onClose={handleHelpDialog} open={this.state.openHelp}>

                <DialogTitle id="alert-dialog-title">XPert | Write a Story</DialogTitle>
                <DialogContent>
                  <Typography>
                    Hi there! We are glad that you want to write a story and
                    express yourself in the best possible way.
                                </Typography>
                  <br />
                  <Typography>
                    The Editor consists of spaces where you can fill in the Title, Description, Content
                    as well as the Tags for your Story.
                                </Typography>
                  <br />
                  <Typography>
                    The editor you see in this page is exclusively designed to accomodate
                    a hassle free writing experience. It uses Markdown as its primary writing
                    language for the Content.
                                </Typography>
                  <br />
                  <Typography>
                    Please refer a guide of Markdown &nbsp;
                                    <a href="https://en.wikipedia.org/wiki/Markdown" target="blank" className={classes.link}>here</a>.
                                </Typography>
                  <br />
                  <Typography>
                    As far as the Tags are concerned, you can only enter upto 5 Tags for your story.
                    Each Tag must be separated with Space Characters (" ").
                                </Typography>
                  <br />
                  <Typography>
                    Hope these guidelines help you have an enriching experience! Good Luck!
                                </Typography>
                </DialogContent>
              </Dialog>
            
            

            </Container>
          )}
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.state.openSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbar}
          message={this.state.snackbarText}
          action={
            <React.Fragment>
              <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbar}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />

      <Fab aria-label="Help" className={classes.fab} onClick={handleHelpDialog}>
        <InfoIcon/>
      </Fab>

      </div>
    )
  }
}



const mapStateToProps = state => ({
  auth: state.auth
});

EditStory.propTypes = {
  classes: Proptypes.object.isRequired,
}
export default connect(mapStateToProps,
  { setCurrentUser })(withStyles(styles)(EditStory));