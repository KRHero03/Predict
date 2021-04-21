import React from "react";
import axios from 'axios';
import { connect } from "react-redux";
import { setCurrentUser } from "../../actions/authActions";
import { withStyles } from '@material-ui/core/styles';
import Proptypes from 'prop-types';
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import LinearProgress from "@material-ui/core/LinearProgress";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { Typography } from "@material-ui/core";

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
    fontWeight: 7,
    fontSize: 40,
    textAlign: 'left',
    marginTop: '25vh',

  },
  Logo: {
    [theme.breakpoints.up('sm')]: {
      height: "250px",
      width: "250px"
    },
  },
  title: {
      fontWeight: 'bold',
      fontSize: 34,
      marginTop: 50,
      marginBottom: 20
  },
  box: {
    maxHeight: '70vh',
    overflow: 'auto',
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
class TagSearch extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isAuthenticated: this.props.auth.isAuthenticated,
      user: this.props.auth.user,
      leftDrawer: false,
      tags: [],
      stories: [],
      tagId: this.props.match.params.id,
      tagName: '',
      isLoading: true,
    }
  }


  async componentDidMount() {
    await this.props.setCurrentUser();
    this.setState({
      ...this.state,
      isAuthenticated: this.props.auth.isAuthenticated,
      user: this.props.auth.user,
      isLoading: true,
    });

    const responseTag = await axios.post('/api/get_tag_name', {
      id: this.state.tagId,
    })
    if(responseTag.data===""){
      this.props.history.push('/')
    }
    const tagVal = responseTag.data
    this.setState({ tagName: tagVal })

    const responseStories = await axios.post('/api/get_stories_by_tag', {
      id: this.state.tagId,
    })
    const storiesData = responseStories.data
    this.setState({ stories: storiesData, isLoading: false })

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
              <Grid container>
                <Grid container justify="start">
                  <Typography className={classes.title} > Search Results for "{this.state.tagName}" :</Typography>
            </Grid>
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
              </Grid>
            </Container>
          )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

TagSearch.propTypes = {
  classes: Proptypes.object.isRequired,
}
export default connect(mapStateToProps,
  { setCurrentUser })(withStyles(styles)(TagSearch));