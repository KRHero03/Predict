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
import Link from "@material-ui/core/Link";

import { setCurrentUser } from "../../actions/authActions";



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
    maxHeight: '300px',
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
  }

});

class Profile extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      user: this.props.auth.user,
      isAuthenticated: this.props.auth.isAuthenticated,
      isLoading: true,
      userStories: [],
      followerCount: 0,
      followingCount: 0,
      upvoteCount: 0
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
    
    const stories = await axios.post('/api/get_story_by_userid',{'userID':this.state.user._id})
    const followerCountResponse = await axios.post('/api/follower_count',{'userID':this.state.user._id})
    const followingCountResponse = await axios.post('/api/following_count',{'userID':this.state.user._id})
    const upvoteCountResponse = await axios.post('/api/upvote_count',{'userID':this.state.user._id})

    this.setState({
      userStories: stories.data,
      followerCount: followerCountResponse.data,
      followingCount: followingCountResponse.data,
      upvoteCount: upvoteCountResponse.data,
      isLoading: false,
    })
  }

  render() {
    const { classes } = this.props;


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
              Profile
            </Grid>
            <Divider className={classes.divider}/>
              <Grid item xs={12}>
                <Avatar alt={this.state.user.name} src={this.state.user.photo} style={{ display: 'inline-block', width: '150px', height: '150px' }} />

              </Grid>
              <Grid item xs={12}>
                <Typography display="inline" variant="h2" style={{ display: 'inline-block', margin: 2 }}>{this.state.user.name}</Typography>
              </Grid>
              <Divider className={classes.divider} />
              <Grid container xs={12} className={classes.content} justify="space-between">
                <Grid item xs={12} sm={4} >
                  <Card elevation={3} Container className={classes.paperStyled} style={{ display: 'block' }}>
                    <Typography className={classes.textThin}>{"Email : " + this.state.user.email}</Typography>
                    <Typography className={classes.textThin}>{"Followers : " + this.state.followerCount}</Typography>
                    <Typography className={classes.textThin}>{"Following : " + this.state.followingCount}</Typography>
                    <Typography className={classes.textThin}>{"Stories Written : " + this.state.userStories.length}</Typography>
                    <Typography className={classes.textThin}>{"Upvoted Stories : " + this.state.upvoteCount}</Typography>
                  </Card>
                </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h4">Your Stories</Typography>
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
                        );
                      })
                    
                    
                  ):
                  (
                    
                  <Typography>You haven't written stories yet. Go write some.</Typography>
                  )
                }
                </Grid>
              </Grid>

              </Grid>
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