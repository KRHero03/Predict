import React, { Component } from 'react'
import { IconButton, Tooltip, Collapse, CardActions, Box, Typography, Grid, Dialog, Card, CardHeader, Avatar, CardContent, CircularProgress, Snackbar } from '@material-ui/core'
import { Delete, ExpandMore, RemoveCircleOutline, AddCircleOutline, Close } from '@material-ui/icons'
import { withRouter } from "react-router"
import axios from 'axios'

class ChallengeView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      match: this.props.matchObj,
      otherUser: this.props.otherUser,
      user: this.props.user,
      challenge: this.props.challenge,
      isLeagueModalOpen: false,
      isTeamHomeModalOpen: false,
      isTeamAwayModalOpen: false,
      isButtonClicked: false,
      expanded: false,
      openSnackbar: false,
      snackbarText: '',
    }
  }

  async componentDidMount() {

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

  hasMatchStarted = () => {
    const d = new Date().getTime()
    return d > this.state.match.timestamp
  }

  withdrawChallenge = async () => {

    this.setState({
      isButtonClicked: true
    })
    try {
      const response = await axios.post('/api/withdraw_challenge', { id: this.state.challenge._id })
      if(!response.data.success){
        this.showMessage('Failed to Withdraw Prediction Battle!')
        this.setState({
          isButtonClicked: false
        })
      }
      this.props.withdrawChallengeCallback(this.state.challenge._id)
    } catch (e) {
      this.showMessage('Failed to Withdraw Prediction Battle!')
      this.setState({
        isButtonClicked: false
      })
    }
  }

  acceptChallenge = async () => {

    this.setState({
      isButtonClicked: true
    })
    try {
      const response = await axios.post('/api/accept_challenge', { id: this.state.challenge._id })
      if(!response.data.success){
        this.showMessage('Failed to Accept Prediction Battle!')
        this.setState({
          isButtonClicked: false
        })
      }
      this.props.acceptChallengeCallback(this.state.challenge._id)
    } catch (e) {
      this.showMessage('Failed to Accept Prediction Battle!')
      this.setState({
        isButtonClicked: false
      })
    }
  }


  render() {
    return (

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
              <Grid style={{ margin: 10, width: 150 }}>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                  <Avatar src={this.state.match.teamHome.logo} onClick={this.toggleTeamHomeModal} />
                </Grid>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', minHeight: 60 }}>
                  <Typography variant='h5'>{this.state.match.teamHome.name}</Typography>
                </Grid>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                  <Typography variant='h5'>{this.state.match.teamHome.score ? this.state.match.teamHome.score : 0}</Typography>
                </Grid>
                <Grid item xs={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Avatar src={this.state.challenge.userID1 === this.state.user._id ? this.state.user.photo : this.state.otherUser.photo} />
                  <Typography style={{ marginLeft: 5 }}>{this.state.challenge.userID1 === this.state.user._id ? 'You' : this.state.otherUser.name} </Typography>
                </Grid>
              </Grid>
              <Grid style={{ margin: 10, width: 150 }}>
                <Typography variant='h3' style={{ margin: 10 }}>VS</Typography>
              </Grid>
              <Grid style={{ margin: 10, width: 150 }}>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                  <Avatar src={this.state.match.teamAway.logo} onClick={this.toggleTeamAwayModal} />
                </Grid>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', minHeight: 60 }}>
                  <Typography variant='h5'>{this.state.match.teamAway.name}</Typography>
                </Grid>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                  <Typography variant='h5'>{this.state.match.teamAway.score ? this.state.match.teamAway.score : 0}</Typography>
                </Grid>
                <Grid item xs={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Avatar src={this.state.challenge.userID2 === this.state.user._id ? this.state.user.photo : this.state.otherUser.photo} />
                  <Typography style={{ marginLeft: 5 }}>{(this.state.challenge.userID2 === this.state.user._id) ? 'You' : this.state.otherUser.name} </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display='flex' alignItems='center' justifyContent='center'>
              <Typography>{(this.state.challenge.sentBy === 'home' && this.state.challenge.userID1 === this.state.user._id) || (this.state.challenge.sentBy === 'away' && this.state.challenge.userID2 === this.state.user._id) ? 'Sent by You' : 'Sent by ' + this.state.otherUser.name}</Typography>
            </Box>
            <Box display='flex' alignItems='center' justifyContent='center'>
              <Typography>{'Battle Bet Amount: ' + this.state.challenge.betAmount + ' P Coins'}</Typography>
            </Box>
            {
              this.state.challenge.status === 'Match Finished'
                ?
                <Box display='flex' alignItems='center' justifyContent='center'>
                  {
                    (this.state.match.winner === 'home' && this.state.challenge.userID1 === this.state.user._id) || (this.state.match.winner === 'away' && this.state.challenge.userID2 === this.state.user._id)
                      ?
                      <Typography>{'Congratulations! You won the Prediction Battle!'}</Typography>
                      :
                      (this.state.match.winner === 'away' && this.state.challenge.userID1 === this.state.user._id) || (this.state.match.winner === 'home' && this.state.challenge.userID2 === this.state.user._id)
                        ?
                        <Typography>{'Sorry! You lost the Prediction Battle!'}</Typography>
                        :
                        <Typography>{'The match was either a draw or abandoned due to unfavourable conditions!'}</Typography>
                  }
                </Box>
                :
                null
            }
            <Box display='flex' >
              <Typography variant='caption' color='textSecondary'>{'Please note that updates regarding Prediction Battle may take time to load. In cases where a Winner is not decided, P Coins of both the Users will be restored! Have fun @ Predict!'}</Typography>
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
          {
            this.hasMatchStarted()
              ?
              null
              :
              this.state.isButtonClicked
                ?
                <CircularProgress color='secondary' />
                :
                this.state.challenge.accepted ||
                  (this.state.challenge.sentBy === 'home' && this.state.challenge.userID1 === this.state.user._id) || (this.state.challenge.sentBy === 'away' && this.state.challenge.userID2 === this.state.user._id)
                  ?
                  <Tooltip title='Withdraw Challenge'>
                    <IconButton
                      onClick={this.withdrawChallenge}
                      aria-expanded={this.state.expanded}
                      aria-label="Withdraw Challenge"
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                  :

                  <Box display='flex' alignItems='center'>

                    <Tooltip title='Accept Challenge'>
                      <IconButton
                        onClick={this.acceptChallenge}
                        aria-expanded={this.state.expanded}
                        aria-label="Accept Challenge"
                      >
                        <AddCircleOutline />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title='Delete Challenge'>
                      <IconButton
                        onClick={this.withdrawChallenge}
                        aria-expanded={this.state.expanded}
                        aria-label="Delete Challenge"
                      >
                        <RemoveCircleOutline />
                      </IconButton>
                    </Tooltip>
                  </Box>


          }
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
      </Card >

    )
  }

}

export default withRouter(ChallengeView);