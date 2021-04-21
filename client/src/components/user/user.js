import React from "react";
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import Proptypes from 'prop-types';
import axios from 'axios';
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import LinearProgress from "@material-ui/core/LinearProgress";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Portal from "@material-ui/core/Portal";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Link from "@material-ui/core/Link";

import { setCurrentUser } from "../../actions/authActions";
import { CircularProgress } from "@material-ui/core";



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
  divider: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: 'black'
  },
  stories: {
    maxHeight: '300px',
    overflow: 'auto',
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
  }

});

class Profile extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      user: this.props.auth.user,
      userDetails: {},
      id: this.props.match.params.id,
      isAuthenticated: this.props.auth.isAuthenticated,
      isLoading: true,
      followed: false,
      followerCount: 0,
      followingCount: 0,
      upvoteCount: 0,
      userStories: [],
      isFollowedClicked: false,
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
    if ((this.state.user._id === this.state.id)) {
      this.props.history.push('/profile/')
    }
    const userDetailsResponse = await axios.post('/api/user_details',{'userID':this.state.id})

    if(Object.keys(userDetailsResponse.data).length===0){
      this.props.history.push('/')
      return  
    }
    this.setState({
      userDetails: userDetailsResponse.data
    })
    const followedResponse = await axios.post('/api/check_followed',{'userID1':this.state.user._id,'userID2':this.state.id})
    const stories = await axios.post('/api/get_story_by_userid',{'userID':this.state.userDetails._id})
    const followerCountResponse = await axios.post('/api/follower_count',{'userID':this.state.userDetails._id})
    const followingCountResponse = await axios.post('/api/following_count',{'userID':this.state.userDetails._id})
    const upvoteCountResponse = await axios.post('/api/upvote_count',{'userID':this.state.userDetails._id})

    this.setState({
      followed: followedResponse.data,
      userStories: stories.data,
      followerCount: followerCountResponse.data,
      followingCount: followingCountResponse.data,
      upvoteCount: upvoteCountResponse.data,
      isLoading: false,
      openSnackbar: false,
      snackbarText: "",
    })
  }

  render() {
    const { classes } = this.props;


    const toggleFollowed = async () => {
      this.setState({
        isFollowedClicked: true
      })
      if (this.state.followed) {
        await axios.post('/api/remove_followed',{'userID1':this.state.user._id,'userID2':this.state.userDetails._id})
        this.setState({
          followed: false,
        })
        showMessage("Unfollowed " + this.state.userDetails.name + ".")
      } else {
        
        await axios.post('/api/add_followed',{'userID1':this.state.user._id,'userID2':this.state.userDetails._id})
        this.setState({
          followed: true,
        })
        showMessage("Followed " + this.state.userDetails.name + ".")

      }
      this.setState({
        isFollowedClicked: false
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
        openSnackbar: true,
      })
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
              <Grid item xs={12}>
                <Avatar alt={this.state.userDetails.name} src={this.state.userDetails.photo} style={{ display: 'inline-block', width: '150px', height: '150px' }} />

              </Grid>
              <Grid item xs={12}>
                <Typography display="inline" variant="h2" style={{ display: 'inline-block', margin: 2 }}>{this.state.userDetails.name}</Typography>
              </Grid>
              <Grid item xs={12}>
                {
                  this.state.isFollowedClicked?(
                    <CircularProgress/>
                  ):(
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

                }
              </Grid>
              <Divider className={classes.divider} />
              <Grid container xs={12} className={classes.content} justify="space-between">
                <Grid item xs={12} sm={4} >
                  <Card elevation={3} Container className={classes.paperStyled} style={{ display: 'block' }}>
                    <Typography className={classes.textThin}>{"Email : " + this.state.userDetails.email}</Typography>
                    <Typography className={classes.textThin}>{"Followers : " + this.state.followerCount}</Typography>
                    <Typography className={classes.textThin}>{"Following : " + this.state.followingCount}</Typography>
                    <Typography className={classes.textThin}>{"Stories Written : " + this.state.userStories.length}</Typography>
                    <Typography className={classes.textThin}>{"Upvoted Stories : " + this.state.upvoteCount}</Typography>
                  </Card>
                </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h4">User's Stories</Typography>
                <Grid item xs={12} className={classes.stories}>
                {
                  this.state.userStories.length>0?
                  (
                    this.state.userStories.map((story)=>{
                      let d = new Date(story.timestamp)
                      const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
                      const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
                      const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
                      const displayDate = `${mo} ${da}, ${ye}`
                        return (
                          <Link href={"/story/" + story._id} className={classes.link}>
                          <Container>
                            <Card elevation={3} Container className={classes.paper}>
                              <Grid container>
                                <Grid item xs={12}>
                                  <Typography variant="h4">{story.title}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography display="block" color="textSecondary">{displayDate}</Typography>
                                </Grid>
                                <Grid item xs={12} md={6} sm={12} >
                                  <Typography color="textSecondary">{story.description}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={12} md={3}>
                                  <Typography color="textSecondary">{story.views + " Views"}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={12} md={3}>
                                  <Typography color="textSecondary">{story.upvotes + " Upvotes"}</Typography>
                                </Grid>
                              </Grid>
                            </Card>
                          </Container>
                        </Link>
                        )
                    })
                    
                  ):
                  (
                    
                  <Typography>This user hasn't written any stories yet.</Typography>
                  )
                }
                </Grid>
              </Grid>

              </Grid>

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
            </Container>
          )}
      </div>
    )
  }
}



const mapStateToProps = state => ({
  auth: state.auth
});

Profile.propTypes = {
  classes: Proptypes.object.isRequired,
}
export default connect(mapStateToProps,
  { setCurrentUser })(withStyles(styles)(Profile));