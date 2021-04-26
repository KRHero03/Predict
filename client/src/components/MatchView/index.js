import React, { Component } from 'react'
import { IconButton, Tooltip, Collapse, CardActions, Box, Typography, Grid, Dialog, Card, CardHeader, Avatar, CardContent } from '@material-ui/core'
import { PlayArrow, ExpandMore } from '@material-ui/icons'
import { withRouter } from "react-router"

class MatchView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      match: this.props.matchObj,
      isLeagueModalOpen: false,
      isTeamHomeModalOpen: false,
      isTeamAwayModalOpen: false,
      expanded: false,
    }
    console.log(this.state.match)
  }

  async componentDidMount() {

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

  createPredictionBattle = () => {
    this.props.history.push('/create/' + this.state.match._id)
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
          {
            this.state.match.status === 'Not Started'
              ?
              <Tooltip title='Create Prediction Battle'>
                <IconButton
                  onClick={this.createPredictionBattle}
                >
                  <PlayArrow />
                </IconButton>
              </Tooltip>
              :
              null
          }
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <Grid>
            <Grid item xs={12} className='gridItem'>
              <Box display='flex' alignItems='center' justifyContent='center'>
                <Typography variant='body'>
                  {this.state.match.status.toUpperCase()}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} className='gridItem'>
              <Box display='flex' alignItems='center' justifyContent='center'>
                <Typography variant='body' color='textSecondary'>
                  {'Start Time: ' + this.getTime(this.state.match.timestamp)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} className='gridItem'>
              <Box display='flex' alignItems='center' justifyContent='center'>
                <Typography variant='body' color='textSecondary'>
                  {'Venue: ' + this.state.match.venue}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} className='gridItem'>
              <Box display='flex' alignItems='center' justifyContent='center'>
                <Typography variant='body' color='textSecondary'>
                  {this.state.match.challenges.length + ' Prediction Battles'}
                </Typography>
              </Box>
            </Grid>
            {
              this.state.match.referee
                ?
                <Grid item xs={12} className='gridItem'>
                  <Box display='flex' alignItems='center' justifyContent='center'>

                    <Typography variant='body' color='textSecondary'>
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
      </Card >

    )
  }

}

export default withRouter(MatchView);