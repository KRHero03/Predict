import React, { Component } from 'react'
import { AppBar, Toolbar, IconButton, Typography, Drawer, InputBase } from '@material-ui/core'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Logo from '../../logo.png'
import { Menu, Search } from '@material-ui/icons'
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
    }
  }

  async componentDidMount() {
    const response = await axios.get('/api/current_user')
    console.log(response)
    if (!response.data) {
      this.setState({
        isLoading: false
      })
      return
    }
    this.setState({
      isAuthenticated: true,
      isLoading: false,
      user: response.data
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
                    <Menu />
                  </IconButton>
                  <React.Fragment key="left">
                    <Drawer anchor="left" open={this.state.leftDrawer} onClose={this.toggleDrawer}>
                      <SignInLinks toggleDarkMode={this.props.toggleDarkMode} user={this.state.user} />
                    </Drawer>
                  </React.Fragment>
                </div>
                : null}
              <img src={Logo} alt="Logo" className='iconDesktop' />
              <Typography href="/" component="a" className='title' variant="h6" noWrap>
                Predict
              </Typography>

              <div className='grow' />
              {
              this.state.isAuthenticated
              ?              
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
      </div>

    )
  }

}

export default withRouter(Navbar);