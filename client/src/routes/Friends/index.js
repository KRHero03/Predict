import React,{ Component } from "react";
import { withRouter } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import MetaTags from "react-meta-tags";
import { Snackbar,IconButton, Typography, Card,  Box,  Tabs, Tab, CardContent, InputBase } from "@material-ui/core";
import { Search,Close } from '@material-ui/icons';
import Logo from "../../logo.png";
import axios from 'axios'
import UserView from '../../components/UserView'

class Friends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthenticated: false,
      isUserDataLoading: true,
      tabValue: 0,
      friends: [],
      sentFriendRequests: [],
      friendRequests: [],
      search: '',
      openSnackbar: false,
      snackbarText: '',
    };
  }

  async componentDidMount() {
    try {
      const idx = parseInt(this.props.match.params.id)
      if (idx >= 0 || idx <= 2) {
        console.log(idx)
        this.setState({
          tabValue: idx
        })
      }
    } catch (e) {

    }
    const response = await axios.get('/api/current_user')
    
    if (!response.data) {
      this.props.history.push('/')
      return
    }
    let friends = [], friendRequests = [], sentFriendRequests = []
    const user = response.data
    await Promise.all(user.friends.map(async (id) => {
      const response = await axios.post('/api/user_details', { userID: id })
      if (!response.data.success) return
      friends.push(response.data.result)
    }))
    await Promise.all(user.friendRequests.map(async (id) => {
      const response = await axios.post('/api/user_details', { userID: id })
      if (!response.data.success) return
      friendRequests.push(response.data.result)
    }))
    await Promise.all(user.sentFriendRequests.map(async (id) => {
      const response = await axios.post('/api/user_details', { userID: id })
      if (!response.data.success) return
      sentFriendRequests.push(response.data.result)
    }))
    this.setState({
      isAuthenticated: true,
      isLoading: false,
      user: response.data,
      friends: friends,
      friendRequests: friendRequests,
      sentFriendRequests: sentFriendRequests,
      isUserDataLoading: false,
    })
  }
  handleTabChange = async (event, value) => {
    this.setState({
      friends: [],
      friendRequests: [],
      sentFriendRequests: [],
      tabValue: value
    })
    const response = await axios.get('/api/current_user')
    let friends = [], friendRequests = [], sentFriendRequests = []
    const user = response.data
    await Promise.all(user.friends.map(async (id) => {
      const response = await axios.post('/api/user_details', { userID: id })
      if (!response.data.success) return
      friends.push(response.data.result)
    }))
    await Promise.all(user.friendRequests.map(async (id) => {
      const response = await axios.post('/api/user_details', { userID: id })
      if (!response.data.success) return
      friendRequests.push(response.data.result)
    }))
    await Promise.all(user.sentFriendRequests.map(async (id) => {
      const response = await axios.post('/api/user_details', { userID: id })
      if (!response.data.success) return
      sentFriendRequests.push(response.data.result)
    }))
    this.setState({
      friends: friends,
      friendRequests: friendRequests,
      sentFriendRequests: sentFriendRequests,
    })
  }


  handleSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      openSnackbar: !this.state.openSnackbar
    })
  }


  showMessage = (msg) => {
    this.setState({
      snackbarText: msg,
      openSnackbar: true
    })
  }


  handleSearchVal = (e) => {
    this.setState({
      search: e.target.value
    })
  }
  friendRequestCallback = (id,accept) => {
    if(accept)
      this.showMessage('Added to Friends!')
    else
      this.showMessage('Rejected Friend Request')

    this.setState({
      friendRequests: this.state.friendRequests.filter((e)=> e._id!==id)
    })
  }

  withdrawFriendRequestCallback = (id) => {
    this.showMessage('Friend Request Withdrawn!')
    this.setState({
      sentFriendRequests: this.state.sentFriendRequests.filter((e)=> e._id!==id)
    })
  }

  removeFriendCallback = (id) => {
    this.showMessage('Removed Friend!')
    this.setState({
      friends: this.state.friends.filter((e)=> e._id!==id)
    })
  }

  render() {
    if (this.state.isUserDataLoading)
      return (
        <Grid className='home'>
          <Skeleton className='rectangleSkeleton' type='rect' />
        </Grid>
      )
    return (
      <Grid className="home">
        <MetaTags>
          <title>Friends | Predict</title>
          <meta
            id="meta-description"
            name="description"
            content="Predict - Bet. Wait. Win."
          />
          <meta
            id="og-title"
            property="og:title"
            content="Predict"
          />
          <meta id="og-image" property="og:image" content={Logo} />
        </MetaTags>
        <Grid item className='gridItem' xs={12}>
          <Card variant='outlined'>
            <CardContent>
              <Box display='flex' justifyContent='space-between'>

                <Typography variant='h5'>
                  Your Friends
                </Typography>
                <div className='search'>
                  <div className='searchIcon'>
                    <Search />
                  </div>
                  <InputBase
                    placeholder="Search Friends..."
                    className='inputBase'
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={this.handleSearchVal}
                  />
                </div>

              </Box>

            </CardContent>
          </Card>
        </Grid>
        <Grid item className='gridItem' xs={12}>
          <Grid item xs={12}>
            <Card variant='outlined'>
              <Tabs
                value={this.state.tabValue}
                onChange={this.handleTabChange}
                indicatorColor="secondary"
                textColor="secondary"
                centered
              >
                <Tab label="Friends" />
                <Tab label="Friend Requests" />
                <Tab label="Sent Friend Requests" />
              </Tabs>
            </Card>
          </Grid>
        </Grid>
        {
          this.state.tabValue === 0
            ?
            this.state.friends.filter((e) => e.name.includes(this.state.search)).map((user) => {
              return <Grid item xs={12} className='gridItem'>
                <UserView currentUser={this.state.user} user={user} friendRequestCallback={this.friendRequestCallback} removeFriendCallback={this.removeFriendCallback} withdrawFriendRequestCallback={this.withdrawFriendRequestCallback} />
              </Grid>
            })
            :
            this.state.tabValue === 1
              ?
              this.state.friendRequests.filter((e) => e.name.includes(this.state.search)).map((user) => {
                return <Grid item xs={12} className='gridItem'>
                  <UserView currentUser={this.state.user} user={user} friendRequestCallback={this.friendRequestCallback} removeFriendCallback={this.removeFriendCallback} withdrawFriendRequestCallback={this.withdrawFriendRequestCallback} />
                </Grid>
              })

              :
              this.state.sentFriendRequests.filter((e) => e.name.includes(this.state.search)).map((user) => {
                return <Grid item xs={12} className='gridItem'>
                  <UserView currentUser={this.state.user} user={user} friendRequestCallback={this.friendRequestCallback} removeFriendCallback={this.removeFriendCallback} withdrawFriendRequestCallback={this.withdrawFriendRequestCallback} />
                </Grid>
              })

        }
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.state.openSnackbar}
          autoHideDuration={6000}
          onClose={this.handleSnackbar}
          message={this.state.snackbarText}
          action={
            <React.Fragment>
              <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleSnackbar}>
                <Close fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      </Grid >
    );
  }
}

export default withRouter(Friends);
