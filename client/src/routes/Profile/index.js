import { Component } from "react";
import { withRouter } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import MetaTags from "react-meta-tags";
import { Typography, Card, Fab, Tabs, Tab, CircularProgress, Box, Link, TextField, CardActions, CardContent, Avatar, Button, IconButton, Tooltip, Dialog } from "@material-ui/core";
import { AddCircle, RemoveCircleOutline, AddCircleOutline, Delete, DeleteOutline, Send } from '@material-ui/icons';
import Logo from "../../logo.png";
import axios from 'axios'

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isUserDataLoading: true,
      friendshipStatus: 0,
      isButtonClicked: false,
      id: this.props.match.params.id,
      isModalOpen: false,
      tabValue: 0,
      usedReferralCode: '',
      isReferralButtonClicked: false,
      usedReferralCodeSuccess: false,
      rewards: [],
    };
  }
  async componentDidMount() {
    if (!this.state.id || this.state.id.length === 0) {
      this.props.history.push('/')
      return
    }
    const response = await axios.get('/api/current_user')
    if (!response.data) {
      this.props.history.push('/')
      return
    }
    this.setState({
      isAuthenticated: true,
      currentUser: response.data
    })

    const userResponse = await axios.post('/api/user_details', { userID: this.state.id })

    if (!userResponse.data.success) {
      this.props.history.push('/')
      return
    }

    const rewardDetails = await axios.post('/api/get_claimed_rewards')

    if (rewardDetails.data.success) {
      let data = rewardDetails.data.result
      data.sort((a, b) => { return a.timestamp < b.timestamp ? 1 : -1 })
      this.setState({
        rewards: data
      })
    }
    const userData = userResponse.data.result
    const cID = this.state.currentUser._id
    const status = userData.friends.includes(cID) ? 3 : userData.friendRequests.includes(cID) ? 1 : userData.sentFriendRequests.includes(cID) ? 2 : userData._id === this.state.currentUser._id ? -1 : 0
    this.setState({
      isUserDataLoading: false,
      user: userResponse.data.result,
      friendshipStatus: status,
      usedReferralCodeSuccess: userData.usedReferralCode !== '' ? true : false,
    })
  }

  toggleModalOpen = () => {
    this.setState({
      ...this.state,
      isModalOpen: !this.state.isModalOpen
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
    } catch (e) {
      this.setState({
        isButtonClicked: false,
      })

    }
  }

  useReferralCode = async () => {
    this.setState({
      isReferralButtonClicked: true
    })
    try {
      if (!this.state.usedReferralCode || this.state.usedReferralCode === 0) {
        this.setState({
          isReferralButtonClicked: false,
        })
        return
      }

      const response = await axios.post('/api/use_referral_code', { code: this.state.usedReferralCode })

      if (!response.data.success) {
        this.setState({
          isReferralButtonClicked: false
        })
        return
      }
      this.setState({
        isReferralButtonClicked: false,
        usedReferralCodeSuccess: true,
      })
    } catch (e) {
      this.setState({
        isReferralButtonClicked: false
      })
    }
  }

  handleTabChange = (event, value) => {
    this.setState({
      tabValue: value
    })
  }
  handleTextFieldChange = (e) => {
    if (e.target.value.length > 8) return;
    this.setState({
      ...this.state,
      usedReferralCode: e.target.value.toUpperCase(),
    })
  }

  copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  getTime = (timestamp) => {
    let d = new Date(timestamp)
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
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
          <title>{this.state.user.name} | Predict</title>
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
        <Card variant='outlined'>
          <CardContent>
            <Grid item className='gridItem' xs={12}>
              <Box display='flex' justifyContent='center' alignItems='center'>
                <Avatar className='largeProfilePhoto' src={this.state.user.photo} onClick={this.toggleModalOpen} />
              </Box>
            </Grid>
            <Grid item className='gridItem' xs={12}>
              <Box display='flex' justifyContent='center' alignItems='center'>
                <Typography variant='h5'>{this.state.user.name}</Typography>
              </Box>
            </Grid>
            <Grid item className='gridItem' xs={12}>
              <Box display='flex' justifyContent='center' alignItems='center'>
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
              </Box>
            </Grid>
            <Grid item xs={12} className='gridItem'>

              <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Typography variant='caption' color='textSecondary'>
                  Friends: {this.state.user.friends.length}
                </Typography>
                <Typography variant='caption' color='textSecondary'>
                  P Coins: {this.state.user.rewardCoins}
                </Typography>

              </Box>
            </Grid>
            <Grid item xs={12} className='gridItem'>

              <Box display='flex' justifyContent='space-between' alignItems='center'>
                {
                  this.state.friendshipStatus === 3
                    ?

                    <Typography variant='caption' color='textSecondary'>
                      Email: <Link href={'emailto:' + this.state.user.email} component='a' className='link'>
                        {this.state.user.email}
                      </Link>
                    </Typography>
                    :
                    null
                }
              </Box>
            </Grid>
            {
              this.state.user._id === this.state.currentUser._id
                ?
                <Grid>
                  <Grid item xs={12} className='gridItem'>

                    <Tabs
                      value={this.state.tabValue}
                      onChange={this.handleTabChange}
                      indicatorColor="secondary"
                      textColor="secondary"
                      centered
                    >
                      <Tab label="Rewards Claimed" />
                      <Tab label="Referral System" />
                    </Tabs>
                  </Grid>
                  {
                    this.state.tabValue === 0
                      ?
                      <Grid>
                        {this.state.rewards.map((reward) => {
                          return (
                            <Grid item xs={12} className='gridItem'>
                              <Box display='flex' justifyContent='space-between' alignItems='center'>
                                <Box>
                                  <Box display='flex' alignItems='center'>
                                    <img src={reward.photo} alt={reward.name} width='50' style={{ marginRight: 10 }} />
                                    <Typography variant='h6'>{reward.name}</Typography>
                                  </Box>

                                  <Typography variant='caption' color='textSecondary' style={{ marginRight: 10 }}>{this.getTime(reward.timestamp)}</Typography>
                                  <Typography variant='caption' color='textSecondary'>{reward.cost + ' P Coins'}</Typography>
                                </Box>
                                <Box >
                                  <Typography variant='h6' className='giftCode' onClick={() => { this.copyToClipboard(reward.giftCode) }}>{reward.giftCode}</Typography>

                                </Box>
                              </Box>


                            </Grid>
                          )
                        })}
                      </Grid>
                      :
                      <Grid>
                        <Grid item xs={12} className='gridItem'>
                          <Box display='flex' justifyContent='center'>
                            <Typography variant='h5'>Your Referral Code: {this.state.user.referralCode}</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} className='gridItem'>
                          <Box display='flex' justifyContent='center'>
                            <Typography variant='caption' color='textSecondary'>
                              Use your Referral Code to invite new Users to Predict! You earn 10% of your Referred User's earnings whenever they win their Prediction battle!
                            </Typography>
                          </Box>
                        </Grid>
                        {
                          this.state.usedReferralCodeSuccess
                            ?
                            <Grid>

                              <Grid item xs={12} className='gridItem'>
                                <Box display='flex' justifyContent='center'>
                                  <Typography variant='h5'>Your Used Referral Code: {this.state.user.usedReferralCode === '' ? this.state.usedReferralCode : this.state.user.usedReferralCode}</Typography>
                                </Box>
                              </Grid>
                            </Grid>
                            :
                            <Grid>
                              <Grid item xs={12} className='gridItem'>
                                <Box display='flex' justifyContent='space-between' alignItems='center'>
                                  <TextField
                                    className='createPostTextField'
                                    label="Referral Code"
                                    id="outlined-size-normal"
                                    variant="outlined"
                                    color='secondary'
                                    onChange={this.handleTextFieldChange}
                                    value={this.state.usedReferralCode}
                                  />
                                  {
                                    this.state.isReferralButtonClicked
                                      ?
                                      <CircularProgress color='secondary' />
                                      :
                                      <Tooltip title="Use Referral Code" placement='bottom' onClick={this.useReferralCode}>
                                        <IconButton>
                                          <Send />
                                        </IconButton>
                                      </Tooltip>
                                  }

                                </Box>
                              </Grid>
                              <Grid item xs={12} className='gridItem'>
                                <Box display='flex' justifyContent='center'>
                                  <Typography variant='caption' color='textSecondary'>
                                    Use your Friend's Referral Code in the above Text Field to help your Friend earn 10% more everytime you win a Prediction battle!
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                        }


                      </Grid>
                  }
                </Grid>
                :
                null
            }
          </CardContent>

        </Card>
        <Dialog className='dialog'
          aria-labelledby='Profile Photo Dialog'
          aria-describedby='Profile Photo' onClose={this.toggleModalOpen} open={this.state.isModalOpen}>
          <img src={this.state.user.photo} alt='Profile' />
        </Dialog>
      </Grid >
    );
  }
}

export default withRouter(Profile);
