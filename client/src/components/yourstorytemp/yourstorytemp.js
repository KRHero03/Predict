import React from "react";
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import Proptypes from 'prop-types';
import axios from 'axios';
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import MoreVert from "@material-ui/icons/MoreVert";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Link from "@material-ui/core/Link";
import Fade from '@material-ui/core/Fade';
import { withRouter } from "react-router";

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
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,

    }
  },

});


class StoryTemplate extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      story: this.props.story,
      user: this.props.auth.user,
      isAuthenticated: this.props.auth.isAuthenticated,
      openMenu: false,
      anchorMenu: null,
    }
  }

  render() {


    const { classes } = this.props;
    let d = new Date(this.state.story.timestamp)
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    const displayDate = `${mo} ${da}, ${ye}`

    const handleMenu = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      this.setState({
        openMenu: !this.state.openMenu,
        anchorMenu: event.currentTarget,
      })
    }


    const editStory = () => {

      this.props.history.push('/editstory/' + this.state.story._id)
      return
    }

    const deleteStory = async () => {

      await axios.post('/api/delete_story', { 'storyID': this.state.story._id })
      this.props.history.push('/yourstories/')
      return
    }

    return (
      <Container>
        <Card elevation={3} Container className={classes.paper}>
          <Grid container>
            <Grid item xs={12}>

              <Link href={"/story/" + this.state.story._id} className={classes.link}>
                <Typography style={{ display: 'inline' }} variant="h4">{this.state.story.title}</Typography>
              </Link>
              <IconButton style={{ float: 'right' }} onClick={handleMenu} >
                <MoreVert />
              </IconButton>
              <Menu
                id="fade-menu"
                anchorEl={this.state.anchorMenu}
                keepMounted
                open={this.state.openMenu}
                onClose={handleMenu}
                TransitionComponent={Fade}

                PaperProps={{
                  style: {
                    transform: 'translateX(-100%) translateY(+40%)',
                  }
                }}
              >
                <MenuItem onClick={editStory}>Edit Story</MenuItem>
                <MenuItem onClick={deleteStory}>Delete Your Story</MenuItem>
              </Menu>
            </Grid>
            <Grid item xs={12}>
              <Typography display="block" color="textSecondary">{displayDate}</Typography>
            </Grid>
            <Grid item xs={12} md={6} sm={12} >
              <Typography color="textSecondary">{this.state.story.description}</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={3}>
              <Typography color="textSecondary">{this.state.story.views + " Views"}</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={3}>
              <Typography color="textSecondary">{this.state.story.upvotes + " Upvotes"}</Typography>
            </Grid>
          </Grid>
        </Card>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

StoryTemplate.propTypes = {
  classes: Proptypes.object.isRequired,
}

export default withRouter(connect(mapStateToProps, {})(withStyles(styles)(StoryTemplate)));