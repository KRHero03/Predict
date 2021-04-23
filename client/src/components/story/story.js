import React from "react";
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import Proptypes from 'prop-types';
import axios from 'axios';
import Container from "@material-ui/core/Container";
import Snackbar from '@material-ui/core/Snackbar';
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Link from "@material-ui/core/Link";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import Fab from '@material-ui/core/Fab';
import Fade from '@material-ui/core/Fade';

import { setCurrentUser } from "../../actions/authActions";
import { CircularProgress, Icon, Portal } from "@material-ui/core";

const styles = (theme) => ({
  paper: {
    display: 'flex',
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.primary,
    margin: 10,
    transition: 'all 0.2s',
    width: '100%',
    textAlign: 'left',
    '&:hover': {
      transform: 'scale(1.01)'
    },

  },
  base: {
    minHeight: '90vh',
    fontWeight: 300,
    fontSize: 24,
    textAlign: 'left',
    marginTop: '25vh',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 40,
  },
  description: {
    marginTop: 10,
  },
  content: {
    marginTop: 10,
  },
  tags: {
    marginTop: 30,
    fontWeight: 'normal'
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
    marginTop: 30,
    marginBottom: 30
  },
  commentScroll: {
    maxHeight: '500px',
    overflow: 'auto',
  },
  comment: {
    marginTop: 10,
    marginBottom: 10,
    boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.5)',
    borderRadius: '4px',
    padding: 10,
    display: 'block',
    width: '100%'
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
  previewBox: {
    fontSize: 20,
    fontWeight: 'normal'
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(5),
    right: theme.spacing(5),
    color: 'white',
    backgroundColor: theme.palette.primary.main,  
    '&:hover':{
      backgroundColor: theme.palette.secondary.main,  

    }
  },

});

class Story extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      storyID: this.props.match.params.id,
      user: this.props.auth.user,
      isAuthenticated: this.props.auth.isAuthenticated,
      story: {},
      followed: false,
      upvoted: false,
      upvotes: 0,
      authorDetails: {},
      isLoading: true,
      comments: [],
      tags: [],
      isAuthorUser: false,
      openComment: false,
      commentData: "",
      openSnackbar: false,
      snackbarText: "",
      isFollowedClicked: false,
      isUpvoteClicked: false,
      isAddCommentClicked: false,
      anchorMenu : null,
      openMenu: false
    }
  }
  async componentDidMount() {
    await this.props.setCurrentUser();
    this.setState({
      user: this.props.auth.user,
      isAuthenticated: this.props.auth.isAuthenticated
    })

    const storyResponse = await axios.post('/api/get_story', { 'storyID': this.state.storyID })
    if (Object.keys(storyResponse.data).length===0) {
      this.props.history.push('/')
      return
    }

    this.setState({
      story: storyResponse.data,
      upvotes: storyResponse.data.upvotes,
    })
    const authorResponse = await axios.post('/api/user_details', { 'userID': this.state.story.authorID })
    this.setState({
      authorDetails: authorResponse.data
    })

    if (this.state.user._id == this.state.authorDetails._id) {
      this.setState({
        isAuthorUser: true
      })
    }
    const followedResponse = await axios.post('/api/check_followed', { 'userID1': this.state.user._id, 'userID2': this.state.authorDetails._id })

    this.setState({
      followed: followedResponse.data
    })

    const upvotedResponse = await axios.post('/api/check_upvoted', { 'userID': this.state.user._id, 'storyID': this.state.storyID })

    this.setState({
      upvoted: upvotedResponse.data
    })


    await Promise.all(this.state.story.comments.map(async (commentObj) => {
      const commentID = commentObj.id
      const commentResponse = await axios.post('/api/get_comment', { 'commentID': commentID })
      this.setState({
        comments: [...this.state.comments, commentResponse.data]
      })
    }))

    let comments = this.state.comments

    comments.sort((a, b) => {
      return new Date(b.comment.timestamp) - new Date(a.comment.timestamp);
    })
    this.setState({
      comments: comments
    })
    
    await Promise.all(this.state.story.tags.map(async (tagObj) => {
      const tagID = tagObj.id
      const tagResponse = await axios.post('/api/get_tag', { 'id': tagID })
      this.setState({
        tags: [...this.state.tags, tagResponse.data]
      })
    }))

    this.setState({
      isLoading: false
    })

  }


  render() {
    const { classes } = this.props;

    const toggleFollowed = async () => {
      this.setState({
        isFollowedClicked: true
      })
      if (this.state.followed) {
        await axios.post('/api/remove_followed', { 'userID1': this.state.user._id, 'userID2': this.state.authorDetails._id })

        this.setState({
          followed: false
        })
        showMessage("Unfollowed " + this.state.authorDetails.name + ".")
      } else {

        await axios.post('/api/add_followed', { 'userID1': this.state.user._id, 'userID2': this.state.authorDetails._id })

        this.setState({
          followed: true
        })
        showMessage("Followed " + this.state.authorDetails.name + ".")

      }
      this.setState({
        isFollowedClicked: false
      })
    }

    const _handleTextFieldChange = (e) => {
      this.setState({
        commentData: e.target.value
      });
    }

    const handleSnackbar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      this.setState({
        openSnackbar: !this.state.openSnackbar
      })
    }
    const handleMenu = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      this.setState({
        openMenu: !this.state.openMenu,
        anchorMenu : event.currentTarget,
      })
    }

    const showMessage = (msg) => {

      this.setState({
        snackbarText: msg,
        openSnackbar: true,
      })
    }
    const addComment = async () => {
      this.setState({
        isAddCommentClicked: true
      })
      if (this.state.commentData.length > 0) {
        const response = await axios.post('/api/add_comment', { 'userID': this.state.user._id, 'commentData': this.state.commentData, 'storyID': this.state.storyID })
        let comments = this.state.comments
        comments.push(response.data)

        comments.sort((a, b) => {
          return new Date(b.comment.timestamp) - new Date(a.comment.timestamp);
        })
        this.setState({
          comments: comments
        })
        showMessage("Comment added.")
      } else {
        showMessage("Please enter a valid comment.")
      }
      this.setState({
        isAddCommentClicked: false
      })

    }

    const toggleUpvoted = async () => {
      this.setState({
        isUpvoteClicked: true,
      })
      if (this.state.upvoted) {
        await axios.post('/api/remove_upvote', { 'userID': this.state.user._id, 'storyID': this.state.storyID })
        this.setState({
          upvoted: false,
          upvotes: this.state.upvotes - 1,
        })
        showMessage("Removed upvote from \"" + this.state.story.title + "\".")
      } else {

        await axios.post('/api/add_upvote', { 'userID': this.state.user._id, 'storyID': this.state.storyID })
        this.setState({
          upvoted: true,
          upvotes: this.state.upvotes + 1,
          snackbarText: "Story Upvoted!",
        })
        showMessage("Upvoted \"" + this.state.story.title + "\".")

      }
      this.setState({
        isUpvoteClicked: false,
      })
    }

    const editStory = () => {

      this.props.history.push('/editstory/'+this.state.storyID)
      return
    }

    const deleteStory = async () => {
      
      await axios.post('/api/delete_story',{'storyID':this.state.storyID})
      showMessage("Deleted your Story!")
      this.props.history.push('/yourstories/')
      return
    }

    const formatDate = (date) => {
      const d = new Date(date)
      const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
      const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
      const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
      const displayDate = `${mo} ${da}, ${ye}`
      return displayDate
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
              
              <Grid container xs={12} justify="space-between">
                <Grid item xs={12} className={classes.title}>
                  {this.state.story.title}
                </Grid>
              </Grid>
                
              
              <Grid item xs={12} className={classes.author}>
                <a href={'/user/' + this.state.authorDetails._id} >
                  <Avatar alt={this.state.authorDetails.name} src={this.state.authorDetails.photo} style={{ display: 'inline-block' }} />
                </a>
                <div style={{ marginLeft: 10 }}>

                  <a href={'/user/' + this.state.authorDetails._id} className={classes.link}><Typography color="textSecondary">{this.state.authorDetails.name}</Typography></a>
                  <Typography color="textSecondary">{
                    formatDate(this.state.story.timestamp)
                  }</Typography>
                </div>
                {this.state.isAuthenticated ?
                  this.state.isAuthorUser ? (null) :
                    this.state.isFollowedClicked ? (
                      <CircularProgress />
                    ) : (
                        this.state.followed ?
                          (

                            <Button style={{ marginLeft: 10 }} onClick={toggleFollowed} color="primary" variant="contained">
                              Followed
                            </Button>
                          ) :
                          (

                            <Button style={{ marginLeft: 10 }} onClick={toggleFollowed} color="primary" variant="outlined">
                              Follow
                            </Button>
                          )
                      )
                  :
                  (null)}
              </Grid>
              <Grid item xs={12} className={classes.description}>
                <Typography color="textSecondary">
                  {this.state.story.description}
                </Typography>
              </Grid>
              <Divider className={classes.divider} />
              <Grid item xs={12} className={classes.content}>
                <ReactMarkdown plugins={[gfm]} className={classes.previewBox}>

                  {this.state.story.content}
                </ReactMarkdown>
              </Grid>
              <Divider className={classes.divider} />
              <Grid item xs={12} className={classes.tags}>
                {
                  this.state.tags.map((tag, idx) => {
                    if (idx % 2) return (
                      <Chip label={tag.name} style={{ marginLeft: 5, marginRight: 5 }} color="secondary" component="a" href={"/tags/" + tag._id} clickable />)
                    else return (
                      <Chip label={tag.name} style={{ marginLeft: 5, marginRight: 5 }} color="primary" component="a" href={"/tags/" + tag._id} clickable />)
                  })
                }
              </Grid>
              <Grid item xs={12} className={classes.content}>
                {this.state.isAuthenticated ?
                  this.state.isAuthorUser ? (null) :
                    this.state.isUpvoteClicked ? (
                      <CircularProgress />
                    ) : (
                        this.state.upvoted ?
                          (

                            <Button onClick={toggleUpvoted} color="primary" variant="contained">
                              {"Upvoted"}
                            </Button>
                          ) :
                          (

                            <Button onClick={toggleUpvoted} color="primary" variant="outlined">
                              {"Upvote"}
                            </Button>
                          )
                      )
                  :
                  (null)}
              </Grid>

              <Grid item xs={12} className={classes.description}>
                <Typography color="textSecondary">{this.state.upvotes + " Upvotes"}</Typography>
                <Typography color="textSecondary">{this.state.story.views + " Views"}</Typography>
              </Grid>
              <Grid item xs={12} className={classes.commentBase}>
                <Typography variant="h5">Comments</Typography>
                <Grid container xs={12} className={classes.commentScroll}>
                  {this.state.comments.map((comment) => {

                    return (
                      <Container>
                        <Grid item xs={12} className={classes.comment}>
                          <a href={'/user/' + comment.author._id} className={classes.link}>
                            <Grid item xs={12} className={classes.author}>

                              <Avatar alt={comment.author.name} src={comment.author.photo} style={{ display: 'inline-block' }} />
                              <div style={{ marginLeft: 10 }}>
                                <Typography >{comment.author.name}</Typography>
                                <Typography >{formatDate(comment.comment.timestamp)}</Typography>
                              </div>
                            </Grid>
                          </a>

                          {
                            this.state.user._id == comment.author._id ?
                              (

                                <Button id={comment.comment._id} onClick={async e => {
                                  const commentID = comment.comment._id
                                  let comments = this.state.comments
                                  await axios.post('/api/delete_comment', { 'commentID': commentID, 'storyID': this.state.storyID })
                                  comments.splice(comments.findIndex(e => e.comment._id == commentID), 1)
                                  showMessage('Deleted your comment.')
                                }} color="primary" variant="contained">
                                  Delete
                                </Button>
                              ) :
                              (null)
                          }
                          <Grid item xs={12} style={{ marginTop: 20 }}>
                            <Typography >
                              {comment.comment.content}
                            </Typography>
                          </Grid>

                        </Grid>
                      </Container>
                    )
                  })}

                </Grid>
                {this.state.isAuthenticated ?
                  (

                    <Grid item xs={12} className={classes.commentButton}>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="commentTextField"
                        label="Comment"
                        value={this.state.commentData}
                        onChange={_handleTextFieldChange}
                        type="text"
                        fullWidth
                        multiline
                        rows="3"
                      />
                      {this.state.isAddCommentClicked ? (<CircularProgress />) :
                        (
                          <Button color="primary" variant="outlined" onClick={addComment}>
                            Add Comment
                          </Button>
                        )}
                    </Grid>
                  )
                  : (null)}
              </Grid>

            </Container>
          )}
        <Portal>
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
        </Portal>
        {this.state.user._id==this.state.authorDetails._id?
        (
          <div>
        <Fab aria-label="Help" aria-controls="simple-menu" aria-haspopup="true" className={classes.fab} onClick={handleMenu} >
          <KeyboardArrowUp/>
        </Fab>
        <Menu
          id="fade-menu"
          anchorEl={this.state.anchorMenu}
          keepMounted
          open={this.state.openMenu}
          onClose={handleMenu}
          TransitionComponent={Fade}

          PaperProps={{
            style: {
              left: '50%',
              transform: 'translateX(-30%) translateY(-100%)',
            }
          }}
        >
          <MenuItem onClick={editStory}>Edit Story</MenuItem>
          <MenuItem onClick={deleteStory}>Delete Your Story</MenuItem>
        </Menu>
        </div>
        ):(null)}
      </div>

    );
  }
}


const mapStateToProps = state => ({
  auth: state.auth
});

Story.propTypes = {
  classes: Proptypes.object.isRequired,
}
export default connect(mapStateToProps,
  { setCurrentUser })(withStyles(styles)(Story));