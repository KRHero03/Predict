import React from 'react';
import Proptypes from 'prop-types';
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { fade, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import Home from '@material-ui/icons/Home';
import Drawer from '@material-ui/core/Drawer';
import AccountCircle from '@material-ui/icons/AccountCircle';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InputBase from '@material-ui/core/InputBase';
import Logo from '../../logo.svg';
import Button from '@material-ui/core/Button';
import Create from '@material-ui/icons/Create';
import SearchIcon from '@material-ui/icons/Search';
import Note from '@material-ui/icons/Note';
import Bookmarks from '@material-ui/icons/Bookmarks';
import People from '@material-ui/icons/People';
import GroupWork from '@material-ui/icons/GroupWork';
import Help from '@material-ui/icons/Help';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';


var __html = require('./../policy/policy.js');
var template = { __html: __html };
function ElevationScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

ElevationScroll.propTypes = {
  children: Proptypes.element.isRequired,
  window: Proptypes.func,
};

const styles = (theme) => ({
  grow: {
    flexGrow: 1,
  },
  block: {
    display: 'block',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },

  title: {
    flexGrow: 1,
    color: 'white',
    textDecoration: 'none',
    display: 'none',
    '&:hover': {
      color: 'white',
      textDecoration: 'none',
    },
    [theme.breakpoints.up('sm')]: {
      display: 'block',
      flexGrow: 0,
    },
  },
  sectionDesktop: {
    '& > *': {
      margin: theme.spacing(1),
    },
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
  },
  iconDesktop: {
    width: 25,
    marginRight: 20,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
  },
  list: {
    width: 250,
  },
  link: {
    textDecoration: 'none',
  },
  fullList: {
    width: 'auto',
  },
  about: {
    bottom: 10
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 4, 3),
  },

  modal: {
    position: 'absolute',
    overflow: 'scroll',
    height: '90%',
    margin: theme.spacing(3),
  },
  dialog: {
    position: 'absolute',
    height: '90%',
    width: '90%',
    margin: theme.spacing(3),
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '50ch',
      },
    },
  },
});

class XPertNavbar extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      leftDrawer: false,
      openPolicy: false,
      openHelp: false,
      search: "",
    }

  }



  render() {

    const { isAuthenticated, user } = this.props.auth;
    const { classes } = this.props;
    const preventDefault = (event) => event.preventDefault();


    const toggleDrawer = () => {
      this.setState({
        ...this.state,
        leftDrawer: !this.state.leftDrawer
      })
    };

    const handlePolicyModal = (event, reason) => {
      if (reason === 'clickaway') {
        return
      }
      this.setState({
        ...this.state,
        openPolicy: !this.state.openPolicy,
      })
    }
    const handleHelpModal = (event, reason) => {
      if (reason === 'clickaway') {
        return
      }
      this.setState({
        ...this.state,
        openHelp: !this.state.openHelp,
      })
    }

    const handleSearchVal = (e) => {
      this.setState({
        search: e.target.value
      })
    }
    const handleSearch = (e) => {

      if (e.key === 'Enter') {
        this.props.history.push('/search/' + this.state.search)
        return
      }
    }
    const guestIcons = (
      <div className={classes.sectionDesktop}>
        <Button component="a" href='/' color="secondary" >
          Home
				</Button>
        <Button component="a" href='/ourstory' color="secondary" >
          Our Story
        		</Button>
        <Button component="a" href='/auth/google' variant="contained" color="secondary" disableElevation>
          Get Started
        		</Button>
      </div>
    )

    const authenticatedList = (
      <div class={classes.list}>
        <List>
          <ListItem className={classes.block}>
            <Avatar alt={user.name} src={user.photo} className={classes.large} />

            <Typography variant="h6" >Hey There, {user.name}</Typography>
          </ListItem>
          <Divider />
          <ListItem button key="Home" component="a" href="/">
            <ListItemIcon> <Home /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <Divider />
          <ListItem button key="Write your Story" component="a" href="/writestory/">
            <ListItemIcon> <Create /></ListItemIcon>
            <ListItemText primary="Write your Story" />
          </ListItem>
          <ListItem button key="Your Stories" component="a" href="/yourstories/">
            <ListItemIcon> <Note /></ListItemIcon>
            <ListItemText primary="Your Stories" />
          </ListItem>
          <ListItem button key="Upvoted Stories" component="a" href="/upvoted/">
            <ListItemIcon> <Bookmarks /></ListItemIcon>
            <ListItemText primary="Upvoted Stories" />
          </ListItem>
          <Divider />
          <ListItem button key="Your Profile" component="a" href="/profile/">
            <ListItemIcon> <AccountCircle /></ListItemIcon>
            <ListItemText primary="Your Profile" />
          </ListItem>
          <ListItem button key="Connections" component="a" href="/connections/">
            <ListItemIcon> <People /></ListItemIcon>
            <ListItemText primary="Connections" />
          </ListItem>
          <Divider />
          <ListItem button key="Our Story" component="a" href="/ourstory/">
            <ListItemIcon> <GroupWork /></ListItemIcon>
            <ListItemText primary="Our Story" />
          </ListItem>
          <ListItem button key="Help" onClick={handleHelpModal}>
            <ListItemIcon> <Help /></ListItemIcon>
            <ListItemText primary="Help" />

            <Dialog class={classes.dialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description" onClick={preventDefault} onBackdropClick={preventDefault} disableBackdropClick onClose={preventDefault} open={this.state.openHelp}>

              <DialogTitle id="alert-dialog-title">XPert | Help & FAQ</DialogTitle>
              <DialogContent>
                <Typography variant="h6">What is XPert all about?</Typography>
                <Typography >
                  XPert is all about reading, writing and exploring new stuff. You can find
                  stuff that you like to read and are interested in. Feel free to check out the articles
                  using the topics mentioned in the Landing Page.
            </Typography>
                <Typography variant="h6">What Information do you store about me?</Typography>
                <Typography >
                  At XPert, we believe in Independence and Privacy. Hence, we don't store any Information
                  about you except your Email Address, Google Profile Picture and your Name for identification.
            </Typography>
                <Typography variant="h6">What more can I do after logging in?</Typography>
                <Typography >
                  If you log in at XPert, you can now write Stories and articles, no limits on words and no limits
                  on the number of articles! Fun, isn't it? Apart from that, you can follow different people and
                  read what they wrote and even interact with their articles using the Comments and Upvotes section.
            </Typography>
                <Typography variant="h6">How do I write an Article?</Typography>
                <Typography >
                  You can write an Article after logging in at XPert using your Google Account.
                  Head over to Write a Story section under the sidebar and you'll be guided step by step
                  for writing your own story.
                 </Typography>
                <Typography variant="h6">Are there any Microtransactions on XPert?</Typography>
                <Typography >
                  XPert is free, and will always be. We don't have advertisements and Microtransactions.
                 </Typography>
                <Typography variant="h6">How to connect with people?</Typography>
                <Typography >
                  You can connect to different people by clicking the Follow button besides their names appearing in their story/article.
                 </Typography>
                <Typography variant="h6">My question is not listed above. What do I do?</Typography>
                <Typography >
                  Don't worry. Write us at help(at)xpert(dot)com. We'll definitely ping you within a day regarding
                  your query.
                 </Typography>
              </DialogContent>
            </Dialog>
          </ListItem>
          <ListItem button key="Sign Out" component="a" href="/api/logout">
            <ListItemIcon> <ExitToApp /></ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItem>
          <Divider />
          <ListItem key="Copyright">
            <ListItemText secondary="© Copyright 2020 - Present" />
          </ListItem>
          <div>
            <ListItem onClick={handlePolicyModal} component="a" href="#" key="Privacy Policy">
              <ListItemText secondary="Privacy Policy | X-Pert" />
            </ListItem>


            <Dialog class={classes.dialog}
              aria-describedby="alert-dialog-description" onClose={handlePolicyModal} open={this.state.openPolicy}>

              <DialogContent>
                <div className={classes.paper}>
                  <h2 id="transition-modal-title">XPert</h2>

                  <span dangerouslySetInnerHTML={template} />
                </div>
              </DialogContent>
            </Dialog>

          </div>
        </List>
      </div>

    )


    return (

      <div className={classes.grow}>
        <ElevationScroll props={this.props}>
          <AppBar position="fixed">
            <Toolbar>
              {isAuthenticated ?
                <div>
                  <IconButton
                    edge="start"
                    className={classes.menuButton}
                    onClick={toggleDrawer}
                    color="inherit"
                    aria-label="open drawer"
                  >
                    <MenuIcon />
                  </IconButton>
                  <React.Fragment key="left">
                    <Drawer anchor="left" open={this.state.leftDrawer} onClose={toggleDrawer}>
                      {authenticatedList}
                    </Drawer>
                  </React.Fragment>
                </div>
                : null}
              <img src={Logo} alt="Logo" class={classes.iconDesktop} />
              <Typography href="/" component="a" className={classes.title} variant="h6" noWrap>
                XPert : Ocean of Thoughts
                        </Typography>

              <div className={classes.grow} />
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search XPert…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }} onKeyUp={handleSearch}
                  onChange={handleSearchVal}
                  inputProps={{ 'aria-label': 'search' }}
                />
              </div>
              {isAuthenticated ? null :
                guestIcons
              }
            </Toolbar>
          </AppBar>
        </ElevationScroll>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});


XPertNavbar.propTypes = {
  classes: Proptypes.object.isRequired,
}
export default withRouter(connect(mapStateToProps, {})(withStyles(styles)(XPertNavbar)));