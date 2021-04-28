import React, { Component } from 'react'
import { AppBar, Card, CardHeader, Grid, Link, Avatar, Menu, Toolbar, IconButton, Typography, Drawer, InputBase, Box, Tooltip, Badge } from '@material-ui/core'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Logo from '../../logo.png'
import { Search, Notifications } from '@material-ui/icons'
import MenuIcon from '@material-ui/icons/Menu'
import { withRouter } from "react-router"
import GuestLinks from '../GuestLinks'
import SignInLinks from '../SignInLinks'
import axios from 'axios'

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


class Navbar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isAuthenticated: false,
      user: null,
      isLoading: true,
      search: '',
      notifications: [],
      unseen: [],
      anchorEl: null,
    }
  }

  async componentDidMount() {
    const response = await axios.get('/api/current_user')
    if (!response.data) {
      this.setState({
        isLoading: false
      })
      return
    }
    this.setState({
      isAuthenticated: true,
      user: response.data
    })

    const notificationResponse = await axios.post('/api/get_notifications')

    if (!notificationResponse.data.success) {
      return
    }

    const nData = notificationResponse.data.result
    this.setState({
      notifications: nData
    })
    let unseen = []
    nData.forEach((n) => {
      if (!n.seen) {
        unseen.push(n._id)
      }
    })
    this.setState({
      unseen: unseen
    })

  }

  toggleDrawer = () => {
    this.setState({
      ...this.state,
      leftDrawer: !this.state.leftDrawer
    })
  };

  handlePolicyModal = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({
      ...this.state,
      openPolicy: !this.state.openPolicy,
    })
  }
  handleHelpModal = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({
      ...this.state,
      openHelp: !this.state.openHelp,
    })
  }
  handleSearchVal = (e) => {
    this.setState({
      search: e.target.value
    })
  }
  handleSearch = (e) => {

    if (e.key === 'Enter') {
      this.props.history.push('/search/' + this.state.search)
      return
    }
  }

  handleNotificationOpen = (e) => {

    this.setState({
      anchorEl: e.currentTarget
    })
  }

  handleNotificationClose = async () => {
    this.setState({
      anchorEl: null
    })
    await Promise.all(this.state.unseen.map(async (id) => {
      await axios.post('/api/check_seen_notification', { id: id })
    }))
    this.setState({
      unseen: []
    })
  }



  getTime = (timestamp) => {
    const d = new Date(timestamp)
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
  }

  render() {
    return (
      <div className='grow'>
        <ElevationScroll props={this.props}>
          <AppBar position="fixed">
            <Toolbar>
              {this.state.isAuthenticated ?
                <div>
                  <IconButton
                    edge="start"
                    className='menuButton'
                    onClick={this.toggleDrawer}
                    color="inherit"
                    aria-label="open drawer"
                  >
                    <MenuIcon />
                  </IconButton>
                  <React.Fragment key="left">
                    <Drawer anchor="left" open={this.state.leftDrawer} onClose={this.toggleDrawer}>
                      <SignInLinks toggleDarkMode={this.props.toggleDarkMode} user={this.state.user} />
                    </Drawer>
                  </React.Fragment>
                </div>
                : null}
              <img src={Logo} alt="Logo" className='iconDesktop' />
              <Typography href="/" component="a" className='iconDesktop title ' variant="h6" noWrap>
                Predict
              </Typography>

              <div className='grow iconDesktop' />
              {
                this.state.isAuthenticated
                  ?
                  <Box display='flex' alignItems='center'>
                    <div className='search'>
                      <div className='searchIcon'>
                        <Search />
                      </div>
                      <InputBase
                        placeholder="Search Users..."
                        className='inputBase'
                        inputProps={{ 'aria-label': 'search' }}
                        onKeyUp={this.handleSearch}
                        onChange={this.handleSearchVal}
                      />
                    </div>
                    <Tooltip title='Show Notifications'>
                      <IconButton onClick={this.handleNotificationOpen}>
                        <Badge badgeContent={this.state.unseen.length === 0 ? null : this.state.unseen.length} color="secondary">
                          <Notifications style={{ color: 'white' }} />
                        </Badge>
                      </IconButton>
                    </Tooltip>
                  </Box>
                  :

                  null
              }
              {
                this.state.isLoading ? null :
                  !this.state.isAuthenticated ?
                    <GuestLinks /> : null
              }
            </Toolbar>
          </AppBar>
        </ElevationScroll>

        <Menu
          anchorEl={this.state.anchorEl}
          keepMounted
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleNotificationClose}
        >
          <Grid item xs={12} style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }}>
            <Typography variant='h5'>
              {this.state.unseen.length !== 0 ? ('Notifications (' + this.state.unseen.length + ')') : 'Notifications'}
            </Typography>
          </Grid>
          <Grid item xs={12} style={{ maxHeight: 700, overflowY: 'scroll' }}>
            {
              this.state.notifications.map((n) => {
                return (
                  <Grid item xs={12}
                    className='notificationMenuCard' style={{ marginLeft: 10, marginRight: 10 }}>
                    <Link className='link' href={n.link} >
                      <Card variant='outlined' className={this.state.unseen.includes(n._id) ? 'unseen' : ''}>
                        <CardHeader
                          avatar={
                            <Avatar aria-label="profile-photo" src={n.photo} />
                          }
                          title={n.message}
                          subheader={this.getTime(n.timestamp)}
                        />
                      </Card>
                    </Link>
                  </Grid>
                )
              })
            }
          </Grid>
        </Menu>
      </div >

    )
  }

}

export default withRouter(Navbar);