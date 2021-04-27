import React,{ Component } from "react";
import { withRouter } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import MetaTags from "react-meta-tags";
import { Typography, Card, Box, CardContent, Collapse, CardActions, Avatar, CardHeader, Dialog, Tooltip, IconButton, CircularProgress, TextField, Checkbox, FormControlLabel, Select, MenuItem, FormControl, Snackbar } from "@material-ui/core";
import { ExpandMore, Send,Close } from '@material-ui/icons';
import Logo from "../../logo.png";
import axios from 'axios'

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthenticated: false,
      isUserDataLoading: true,
      match: null,
      matchID: this.props.match.params.id,
      selectedFriends: [],
      friends: [],
      isLeagueModalOpen: false,
      isTeamHomeModalOpen: false,
      isTeamAwayModalOpen: false,
      isCreateButtonClicked: false,
      expanded: false,
      investedCoins: "",
      selectedTeam: 'home',
      openSnackbar: false,
      snackbarText: '',
    };

  }
  async componentDidMount() {
    const response = await axios.get('/api/current_user')
    if (!response.data) {
      this.props.history.push('/')
      return
    }
    this.setState({
      isAuthenticated: true,
      user: response.data
    })

    if (!this.state.matchID) {
      this.props.history.push('/')
      return
    }
    const dataResponse = await axios.post('/api/get_match_for_prediction', { matchID: this.state.matchID })
    if (!dataResponse.data.success) {
      this.props.history.push('/')
      return
    }
    if (dataResponse.data.match.status !== 'Not Started') {
      this.props.history.push('/')
      return
    }
    let friends = dataResponse.data.friends
    friends.sort((a,b)=>{return a.name<b.name?-1:1})
    this.setState({
      match: dataResponse.data.match,
      friends: friends,
      isUserDataLoading: false,
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

  toggleLeagueModal = () => {
    this.setState({
      isLeagueModalOpen: !this.state.isLeagueModalOpen
    })
  }
  toggleTeamHomeModal = () => {
    this.setState({
      isTeamHomeModalOpen: !this.state.isTeamHomeModalOpen
    })
  }
  toggleTeamAwayModal = () => {
    this.setState({
      isTeamAwayModalOpen: !this.state.isTeamAwayModalOpen
    })
  }

  getTime = (timestamp) => {
    const d = new Date(timestamp)
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
  }

  handleExpandClick = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  handleTextFieldChange = (e) => {
    this.setState({
      ...this.state,
      investedCoins: e.target.value,
    })
  }

  toggleFriend = (id) => {
    if (this.state.selectedFriends.includes(id)) {

      this.setState({
        selectedFriends: this.state.selectedFriends.filter((e) => e !== id)
      })
      return
    } else {
      this.setState({
        selectedFriends: [...this.state.selectedFriends, id]
      })
      return
    }
  }

  handleSelectChange = (e) => {
    this.setState({
      selectedTeam: e.target.value
    })
  }

  createBattle = async () => {

    this.setState({
      isCreateButtonClicked: true
    })
    try {
      if (this.state.selectedFriends.length === 0) {
        this.showMessage('Please select some Friends!')
        this.setState({
          isCreateButtonClicked: false
        })
        return

      }
      let investedAmount = parseInt(this.state.investedCoins)
      if (!investedAmount) {
        this.showMessage('Please enter valid Bet Amount! Remember, the Gross Bet Amount is the Value you entered times the number of Friends you select!')
        this.setState({
          isCreateButtonClicked: false
        })
        return

      }
      let betAmount = investedAmount * this.state.selectedFriends.length
      if (betAmount > this.state.user.rewardCoins) {
        this.showMessage('Please enter valid Bet Amount! Remember, the Gross Bet Amount is the Value you entered times the number of Friends you select!')
        this.setState({
          isCreateButtonClicked: false
        })
        return
      }

      const response = await axios.post('/api/create_challenge',{matchID:this.state.matchID,selectedFriends:this.state.selectedFriends,betAmount:investedAmount,selectedTeam:this.state.selectedTeam})

      if(!response.data.success){
        this.showMessage('Failed to send Prediction Battle Request!')
        this.setState({
          isCreateButtonClicked: false
        })
        return
      }
      
      this.showMessage('Prediction Battle Request Sent to your Friends!')
      this.setState({
        isCreateButtonClicked: false
      })
      return
    } catch (e) {
      this.showMessage('Failed to send Prediction Battle Request!')

      this.setState({
        isCreateButtonClicked: false
      })
    }

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
          <title>Create Prediction Battle | Predict</title>
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
              <Box display='flex' alignItems='center' justifyContent='space-between'>

                <Typography variant='h5'>Create Prediction Battle</Typography>
                <Typography variant='h5' color='textSecondary'>{this.state.user.rewardCoins + ' P Coins'}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item className='gridItem' xs={12}>
          <Card variant='outlined'>

            <CardHeader
              avatar={
                <Avatar aria-label="profile-photo" src={this.state.match.league.logo} onClick={this.toggleLeagueModal} />
              }
              title={this.state.match.league.name}
              subheader={this.state.match.league.season + ',' + this.state.match.league.round}
            />
            <CardContent>
              <Grid item xs={12} className='gridItem'>
                <Box display='flex' alignItems='center' justifyContent='center' style={{ textAlign: 'center' }}>
                  <Grid style={{ margin: 10, maxWidth: 150 }}>
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                      <Avatar src={this.state.match.teamHome.logo} onClick={this.toggleTeamHomeModal} />
                    </Grid>
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', minHeight: 60 }}>
                      <Typography variant='h5'>{this.state.match.teamHome.name}</Typography>
                    </Grid>
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                      <Typography variant='h5'>{this.state.match.teamHome.score ? this.state.match.teamHome.score : 0}</Typography>
                    </Grid>
                  </Grid>
                  <Typography variant='h3' style={{ margin: 10 }}>VS</Typography>
                  <Grid style={{ margin: 10, maxWidth: 150 }}>
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                      <Avatar src={this.state.match.teamAway.logo} onClick={this.toggleTeamAwayModal} />
                    </Grid>
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', minHeight: 60 }}>
                      <Typography variant='h5'>{this.state.match.teamAway.name}</Typography>
                    </Grid>
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                      <Typography variant='h5'>{this.state.match.teamAway.score ? this.state.match.teamAway.score : 0}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </CardContent>
            <CardActions style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
              <Tooltip title='Show More'>
                <IconButton
                  onClick={this.handleExpandClick}
                  aria-expanded={this.state.expanded}
                  aria-label="Show More"
                >
                  <ExpandMore />
                </IconButton>
              </Tooltip>
            </CardActions>
            <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
              <Grid>
                <Grid item xs={12} className='gridItem'>
                  <Box display='flex' alignItems='center' justifyContent='center'>
                    <Typography variant='body1'>
                      {this.state.match.status.toUpperCase()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} className='gridItem'>
                  <Box display='flex' alignItems='center' justifyContent='center'>
                    <Typography variant='body1' color='textSecondary'>
                      {'Start Time: ' + this.getTime(this.state.match.timestamp)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} className='gridItem'>
                  <Box display='flex' alignItems='center' justifyContent='center'>
                    <Typography variant='body1' color='textSecondary'>
                      {'Venue: ' + this.state.match.venue}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} className='gridItem'>
                  <Box display='flex' alignItems='center' justifyContent='center'>
                    <Typography variant='body1' color='textSecondary'>
                      {this.state.match.challenges.length + ' Prediction Battles'}
                    </Typography>
                  </Box>
                </Grid>
                {
                  this.state.match.referee
                    ?
                    <Grid item xs={12} className='gridItem'>
                      <Box display='flex' alignItems='center' justifyContent='center'>

                        <Typography variant='body1' color='textSecondary'>
                          {'Referee: ' + this.state.match.referee}
                        </Typography>
                      </Box>
                    </Grid>
                    :
                    null

                }

              </Grid>
            </Collapse>
            <Dialog className='dialog' onClose={this.toggleLeagueModal} open={this.state.isLeagueModalOpen}>
              <img src={this.state.match.league.logo} alt='League' />
            </Dialog>
            <Dialog className='dialog' onClose={this.toggleTeamHomeModal} open={this.state.isTeamHomeModalOpen}>
              <img src={this.state.match.teamHome.logo} alt='Team Home' />
            </Dialog>
            <Dialog className='dialog' onClose={this.toggleTeamAwayModal} open={this.state.isTeamAwayModalOpen}>
              <img src={this.state.match.teamAway.logo} alt='Team Away' />
            </Dialog>
          </Card>
        </Grid>


        <Grid item className='gridItem' xs={12} >
          <Card variant='outlined'>
            <CardContent>
              <Grid item xs={12}>
                <Typography >Select Friends</Typography>
              </Grid>
              <Grid item xs={12} style={{ maxHeight: 400, overflowY: 'scroll' }}>
                {this.state.friends.map((friend) => {
                  return (
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Checkbox checked={this.state.selectedFriends.includes(friend._id)} onChange={() => { this.toggleFriend(friend._id) }} name="checkedA" />}
                        label={
                          <Box display='flex' alignItems='center' style={{ paddingTop: 5, paddingBottom: 5 }}>
                            <Avatar src={friend.photo} />
                            <Typography style={{ marginLeft: 5 }}>{friend.name}</Typography>
                          </Box>
                        }
                      />
                    </Grid>
                  )
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item className='gridItem' xs={12}>
          <Card variant='outlined'>
            <CardContent>
              <Grid item xs={12}>
                <Typography>Select Team</Typography>
              </Grid>
              <Grid item xs={12}>
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                  <FormControl variant="outlined"
                    color='secondary' className='createPostTextField'>
                    <Select
                      native
                      value={this.state.selectedTeam}
                      onChange={this.handleSelectChange}
                      inputProps={{
                        id: 'filled-field-native-simple',
                      }}
                    >
                      <option value={'home'}>{'Home Team: ' + this.state.match.teamHome.name}</option>
                      <option value={'away'}>{'Away Team: ' + this.state.match.teamAway.name}</option>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} className='gridItem'>
          <Card variant='outlined'>
            <CardContent>
              <Box display='flex' justifyContent='space-between' alignItems='center'>
                <TextField
                  className='createPostTextField'
                  label="Bet Amount (P Coins)"
                  id="outlined-size-normal"
                  variant="outlined"

                  color='secondary'
                  onChange={this.handleTextFieldChange}
                  value={this.state.investedCoins}
                />
                {
                  this.state.isCreateButtonClicked
                    ?
                    <CircularProgress color='secondary' />
                    :
                    <Tooltip title="Create Prediction Battle" placement='bottom' onClick={this.createBattle}>
                      <IconButton>
                        <Send />
                      </IconButton>
                    </Tooltip>
                }

              </Box>
            </CardContent>
          </Card>
        </Grid>
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

export default withRouter(Create);
