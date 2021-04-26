import React, { Component } from 'react'
import { Link, IconButton, Tooltip, Box, Typography, Grid, Dialog, Card, CardHeader, Avatar, CardContent, CircularProgress } from '@material-ui/core'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Logo from '../../logo.png'
import { Menu, Search, AddCircle, Delete, AddCircleOutline, DeleteOutline, RemoveCircleOutline } from '@material-ui/icons'
import { Skeleton } from '@material-ui/lab'
import { withRouter } from "react-router"
import GuestLinks from '../GuestLinks'
import SignInLinks from '../SignInLinks'
import axios from 'axios'



class UserView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      id: this.props.id,
      currentUser: this.props.currentUser,
      isLoading: true,
      user: this.props.user,
      isButtonClicked: false,
      notFound: false,
      friendshipStatus: 0,
      isModalOpen: false,
    }
  }

  async componentDidMount() {
    let userData;
    if (!this.state.user) {
      const response = await axios.post('/api/user_details', { userID: this.state.id })
      if (!response.data.success) {
        this.setState({
          isLoading: false,
          notFound: true,
        })
        return
      }
      this.setState({
        user: response.data.result
      })
    }
    this.setState({
      id: this.state.user._id
    })
    userData = this.state.user
    const cID = this.state.currentUser._id
    const status = userData.friends.includes(cID) ? 3 : userData.friendRequests.includes(cID) ? 1 : userData.sentFriendRequests.includes(cID) ? 2 : userData._id === this.state.currentUser._id ? -1 : 0
    this.setState({
      isAuthenticated: true,
      isLoading: false,
      user: userData,
      friendshipStatus: status,
    })
  }

  sendFriendRequest = async () => {
    try {
      this.setState({
        isButtonClicked: true
      })
      const response = await axios.post('/api/send_friend_request', { id: this.state.id })
      if (!response.data.success) {
        this.setState({
          isButtonClicked: false
        })
        return
      }
      this.setState({
        isButtonClicked: false,
        friendshipStatus: 1
      })
    } catch (e) {
      this.setState({
        isButtonClicked: false,
      })

    }
  }

  withdrawFriendRequest = async () => {
    try {
      this.setState({
        isButtonClicked: true
      })
      const response = await axios.post('/api/withdraw_friend_request', { id: this.state.id })
      if (!response.data.success) {
        this.setState({
          isButtonClicked: false
        })
        return
      }
      this.setState({
        isButtonClicked: false,
        friendshipStatus: 0
      })
      if(this.props.withdrawFriendRequestCallback){
        this.props.withdrawFriendRequestCallback(this.state.user._id)
      }
    } catch (e) {
      this.setState({
        isButtonClicked: false,
      })

    }
  }


  addFriend = async () => {
    try {
      this.setState({
        isButtonClicked: true
      })
      const response = await axios.post('/api/accept_friend_request', { id: this.state.id })
      if (!response.data.success) {
        this.setState({
          isButtonClicked: false
        })
        return
      }
      this.setState({
        isButtonClicked: false,
        friendshipStatus: 3
      })
      if(this.props.friendRequestCallback){
        this.props.friendRequestCallback(this.state.user._id,1)
      }
    } catch (e) {
      this.setState({
        isButtonClicked: false,
      })

    }
  }

  rejectFriend = async () => {
    try {
      this.setState({
        isButtonClicked: true
      })
      const response = await axios.post('/api/reject_friend_request', { id: this.state.id })
      if (!response.data.success) {
        this.setState({
          isButtonClicked: false
        })
        return
      }
      this.setState({
        isButtonClicked: false,
        friendshipStatus: 0
      })
      if(this.props.friendRequestCallback){
        this.props.friendRequestCallback(this.state.user._id,0)
      }
    } catch (e) {
      this.setState({
        isButtonClicked: false,
      })

    }
  }
  removeFriend = async () => {
    try {
      this.setState({
        isButtonClicked: true
      })
      const response = await axios.post('/api/remove_friend', { id: this.state.id })
      if (!response.data.success) {
        this.setState({
          isButtonClicked: false
        })
        return
      }
      this.setState({
        isButtonClicked: false,
        friendshipStatus: 0
      })
      if(this.props.removeFriendCallback){
        this.props.removeFriendCallback(this.state.user._id)
      }
    } catch (e) {
      this.setState({
        isButtonClicked: false,
      })

    }
  }

  toggleModalOpen = () => {
    this.setState({
      ...this.state,
      isModalOpen: !this.state.isModalOpen
    })
  }


  render() {
    if (this.state.isLoading)
      return (
        <Skeleton className='rectangleSkeleton' type='rect' />
      )
    if (this.state.notFound)
      return (
        <Card variant='outlined'>
          <CardContent>
            <Typography variant='caption' color='textSecondary'>This user has been removed from Predict due to violations of one or more regulations.</Typography>
          </CardContent>
        </Card>
      )
    return (

      <Card variant='outlined'>
        <CardHeader
          avatar={
            <Avatar aria-label="profile-photo" src={this.state.user.photo} onClick={this.toggleModalOpen} />
          }
          title={<Link href={'/profile/'+this.state.user._id} className='link' component='a'>{this.state.user.name}</Link>}
        />
        <CardContent>
          <Box display='flex' alignItems='center' justifyContent='space-between'>
            <Grid>
              <Typography variant='caption' color='textSecondary'>Friends: {this.state.user.friends.length} &nbsp;&nbsp;</Typography>
              <Typography variant='caption' color='textSecondary'>P Coins: {this.state.user.rewardCoins}</Typography>
            </Grid>
            <Grid>
              {
                this.state.isButtonClicked
                  ?
                  <CircularProgress color='secondary' />
                  :
                  this.state.friendshipStatus === 3
                    ?

                    <Tooltip title="Remove as Friend" placement='bottom' onClick={this.removeFriend}>
                      <IconButton>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                    :
                    this.state.friendshipStatus === 2
                      ?
                      <Box display='flex'>

                        <Tooltip title="Reject Friend Request" placement='bottom' onClick={this.rejectFriend}>
                          <IconButton>
                            <DeleteOutline />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Accept Friend Request" placement='bottom' onClick={this.addFriend}>
                          <IconButton>
                            <AddCircleOutline />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      :
                      this.state.friendshipStatus === 1
                        ?

                        <Tooltip title="Withdraw Friend Request" placement='bottom' onClick={this.withdrawFriendRequest}>
                          <IconButton>
                            <RemoveCircleOutline />
                          </IconButton>
                        </Tooltip>
                        :
                        this.state.friendshipStatus === 0
                          ?

                          <Tooltip title="Add as Friend" placement='bottom' onClick={this.sendFriendRequest}>
                            <IconButton>
                              <AddCircle />
                            </IconButton>
                          </Tooltip>
                          :
                          null
              }
            </Grid>
          </Box>
        </CardContent>
        <Dialog className='dialog'
          aria-labelledby='Profile Photo Dialog'
          aria-describedby='Profile Photo' onClose={this.toggleModalOpen} open={this.state.isModalOpen}>
          <img src={this.state.user.photo} alt='Profile' />
        </Dialog>
      </Card>

    )
  }

}

export default withRouter(UserView);