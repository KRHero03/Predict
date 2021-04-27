import { Component } from "react";
import { withRouter } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import MetaTags from "react-meta-tags";
import { Typography, Card, Box, Tabs, Tab, CardContent, InputBase, Dialog, CardHeader, CardActions, Avatar, IconButton, Tooltip, Collapse } from "@material-ui/core";
import { Search, PlayArrow, ExpandMore } from '@material-ui/icons';
import Logo from "../../logo.png";
import axios from 'axios'
import ChallengeView from '../../components/ChallengeView'

class PlacedBets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthenticated: false,
      isUserDataLoading: true,
      tabValue: 0,
      onGoingChallenges: [],
      pendingChallenges: [],
      pastChallenges: [],
      search: ''
    };
  }

  async componentDidMount() {
    try {
      const idx = parseInt(this.props.match.params.id)
      if (idx >= 0 || idx <= 2) {
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
    this.setState({
      user: response.data
    })
    const challengeResponse = await axios.post('/api/get_challenges')
    if (!challengeResponse.data.success) {
      this.props.history.push('/')
      return
    }
    let onGoingChallenges = [], pendingChallenges = [], pastChallenges = []

    challengeResponse.data.result.forEach((obj) => {
      const challenge = obj.challenge
      const match = obj.match
      if (challenge.accepted === false) {
        pendingChallenges.push(obj)
        return
      }
      if (match.status === 'Not Started') {
        onGoingChallenges.push(obj)
        return
      }
      pastChallenges.push(obj)
    })

    this.setState({
      onGoingChallenges: onGoingChallenges,
      pendingChallenges: pendingChallenges,
      pastChallenges: pastChallenges,
      isUserDataLoading: false
    })
    console.log(this.state)

  }
  handleTabChange = (event, value) => {
    this.setState({
      tabValue: value
    })
  }

  handleSearchVal = (e) => {
    this.setState({
      search: e.target.value
    })
  }

  checkDisplayConditions = (challenge) => {
    return challenge.otherUser.name.includes(this.state.search) || challenge.match.teamHome.name.includes(this.state.search) || challenge.match.teamAway.name.includes(this.state.search) || challenge.match.league.name.includes(this.state.search)
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
          <title>Prediction Battles | Predict</title>
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
                  Your Prediction Battles
                </Typography>
                <div className='search'>
                  <div className='searchIcon'>
                    <Search />
                  </div>
                  <InputBase
                    placeholder="Search Prediction Battles..."
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
                <Tab label="Ongoing Battles" />
                <Tab label="Pending Battle Requests" />
                <Tab label="Past Battles" />
              </Tabs>
            </Card>
          </Grid>
        </Grid>
        {
          this.state.tabValue === 0
            ?
            <Grid>
              {this.state.onGoingChallenges.map((challenge) => {
                if (this.checkDisplayConditions(challenge))
                  return (
                    <Grid item xs={12}>
                      <Card variant='outlined'>
                      </Card>
                    </Grid>
                  )
                return null
              })}
            </Grid>
            :
            this.state.tabValue === 1
              ?
              <Grid>
                {this.state.pendingChallenges.map((challenge) => {
                  if (this.checkDisplayConditions(challenge))
                    return (
                      <Grid item xs={12} className='gridItem'>
                        <ChallengeView matchObj={challenge.match} challenge={challenge.challenge} otherUser={challenge.otherUser} user={this.state.user} withdrawChallengeCallback={this.withdrawChallenge} acceptChallengeCallback={this.acceptChallenge} deleteChallenge={this.deleteChallenge}/>
                      </Grid>
                    )
                  return null
                })}
              </Grid>

              :
              <Grid>
                {this.state.pastChallenges.map((challenge) => {
                  if (this.checkDisplayConditions(challenge))
                    return (
                      <Grid item xs={12}>
                        <Card variant='outlined'>
                        </Card>
                      </Grid>
                    )
                  return null
                })}
              </Grid>

        }
      </Grid >
    );
  }
}

export default withRouter(PlacedBets);
