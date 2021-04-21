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
import TextField from "@material-ui/core/TextField";

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
    fontSize: 34,
    textAlign: 'left',
    marginTop: '25vh',
  },
  title: {
    fontWeight: 'bold',
    marginTop: 50,
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
    minHeight: '20vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  extraHeight1: {
    minHeight: '20vh',
    maxHeight: '50vh',
    overflow: 'auto'
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

class Search extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      user: this.props.auth.user,
      isAuthenticated: this.props.auth.isAuthenticated,
      stories: [],
      users: [],
      tagStories: [],
      id: this.props.match.params.id,
      isLoading: true,
    }
  }
  async componentDidMount() {
    await this.props.setCurrentUser();
    this.setState({
      user: this.props.auth.user,
      isAuthenticated: this.props.auth.isAuthenticated
    })

    const response = await axios.post('/api/search/', { 'id': this.state.id })

    this.setState({
      stories: response.data.stories,
      users: response.data.users,
      tagStories: response.data.tagStories,
      isLoading: false
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

              <Grid container xs={12} className={classes.title} justify='space-between'>
                <Grid item xs={12} >
                  {"Story Results for \"" + this.state.id + "\" : "}
                </Grid>
              </Grid>
              <Divider className={classes.divider} />
              <Grid container xs={12}>
                {
                  this.state.stories.length == 0 ?
                    (
                      <Grid className={classes.extraHeight} item xs={12}>
                        No stories found!
                      </Grid>
                    ) :
                    (
                      <Container className={classes.extraHeight1}>
                        {this.state.stories.map((s) => {
                          const story = s.story
                          const author = s.author

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
                                    <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                      <Avatar alt={author.name} src={author.photo} style={{ display: 'inline-block' }} />
                                      <Typography display="inline" variant="h5" style={{ display: 'inline-block', margin: 2 }}>{author.name}</Typography>

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
                        })}

                      </Container>
                    )
                }
              </Grid>

              <Grid container xs={12} className={classes.title} justify='space-between'>
                <Grid item xs={12} >
                  {"Story Results with Tag \"" + this.state.id + "\" : "}
                </Grid>
              </Grid>
              <Divider className={classes.divider} />
              <Grid container xs={12}>
                {
                  this.state.tagStories.length == 0 ?
                    (
                      <Grid className={classes.extraHeight} item xs={12}>
                        No Stories matching the given Tag!
                      </Grid>
                    ) :
                    (
                      <Container className={classes.extraHeight1}>
                        {this.state.tagStories.map((s) => {
                          const story = s.story
                          const author = s.author

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
                                    <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                      <Avatar alt={author.name} src={author.photo} style={{ display: 'inline-block' }} />
                                      <Typography display="inline" variant="h5" style={{ display: 'inline-block', margin: 2 }}>{author.name}</Typography>

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
                        })}

                      </Container>
                    )
                }
              </Grid>

              <Grid container xs={12} className={classes.title} justify='space-between'>
                <Grid item xs={12} >
                  {"User Results for \"" + this.state.id + "\" : "}
                </Grid>
              </Grid>
              <Divider className={classes.divider} />
              <Grid container xs={12}>
                {
                  this.state.isAuthenticated ? (
                    this.state.users.length == 0 ?
                      (
                        <Grid className={classes.extraHeight} item xs={12}>
                          No Users found!
                        </Grid>
                      ) :
                      (
                        <Container className={classes.extraHeight1}>
                          {this.state.users.map((follower) => {

                            return (
                              <Grid item xs={12}>
                                <Link href={"/user/" + follower._id} className={classes.link}>
                                  <Container>
                                    <Card elevation={3} Container className={classes.paper}>
                                      <Grid container>
                                        <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                          <Avatar alt={follower.name} src={follower.photo} style={{ display: 'inline-block' }} />
                                          <Typography display="inline" variant="h6" style={{ display: 'inline-block', margin: 2 }}>{follower.name}</Typography>

                                        </Grid>

                                      </Grid>
                                    </Card>
                                  </Container>
                                </Link>
                              </Grid>
                            )
                          })}

                        </Container>
                      )
                  ) : (

                      <Grid className={classes.extraHeight} item xs={12}>
                        Users cannot be searched as a Guest Login.
                      </Grid>
                    )
                }
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

Search.propTypes = {
  classes: Proptypes.object.isRequired,
}
export default connect(mapStateToProps,
  { setCurrentUser })(withStyles(styles)(Search));