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
  box: {
    maxHeight: '70vh',
    overflow: 'auto',
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

class Upvoted extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      user: this.props.auth.user,
      isAuthenticated: this.props.auth.isAuthenticated,
      isLoading: true,
      stories: [],
      displayStories: [],
      search: ""
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

    const responseStories = await axios.post('/api/upvoted_stories', { 'userID': this.state.user._id })

    this.setState({
      stories: responseStories.data,
      displayStories: responseStories.data,
      isLoading: false
    })

  }

  render() {
    const { classes } = this.props;

    const handleSearch = (e) => {
      this.setState({
        search: e.target.value
      })
      const searchString = e.target.value.toLowerCase()

      this.setState({
        displayStories: searchString.length == 0 ? this.state.stories : this.state.stories.filter((s) => { return (s.story.title.toLowerCase().includes(searchString) || s.author.name.toLowerCase().includes(searchString)) })
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
              <Grid container xs={12} className={classes.title} justify='space-between'>
                <Grid item xs={12} sm={4}>
                  {"Upvoted Stories"}
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="searchStoryTF"
                    label="Search Story"
                    value={this.state.search}
                    onChange={handleSearch}
                    type="text"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Divider className={classes.divider} />
              <Grid container xs={12} className={classes.box}>
                {
                  this.state.stories.length == 0 ?
                    (
                      <Grid className={classes.extraHeight} item xs={12}>
                        No stories found!
                      </Grid>
                    ) :
                    (
                      <Container className={classes.extraHeight1}>
                        {this.state.displayStories.map((s) => {
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
            </Container>
          )}
      </div>
    )
  }
}



const mapStateToProps = state => ({
  auth: state.auth
});

Upvoted.propTypes = {
  classes: Proptypes.object.isRequired,
}
export default connect(mapStateToProps,
  { setCurrentUser })(withStyles(styles)(Upvoted));