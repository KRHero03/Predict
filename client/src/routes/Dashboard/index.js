import { Component } from "react";
import { withRouter } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import MetaTags from "react-meta-tags";
import MatchView from '../../components/MatchView'
import { Typography, Card, Box, CardContent, InputBase } from "@material-ui/core";
import { Search } from '@material-ui/icons';
import Logo from "../../logo.png";
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthenticated: false,
      isUserDataLoading: true,
      timestamp: new Date().getTime(),
      skip: 0,
      matches: [],
      hasMore: true,
      search: '',
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

    const matchResponse = await axios.post('/api/get_recent_matches', { skip: this.state.skip })
    if (!matchResponse.data.success) {
      this.props.history.push('/')
      return
    }
    const matchData = matchResponse.data.result
    console.log(matchData)
    this.setState({
      isUserDataLoading: false,
      skip: matchResponse.length < 10 ? this.state.skip : this.state.skip + 10,
      hasMore: matchResponse.length < 10 ? false : true,
      matches: matchData
    })
  }

  loadMoreMatches = async () => {
    const matchResponse = await axios.post('/api/get_recent_matches', { skip: this.state.skip })
    if (!matchResponse.data.success) {
      this.props.history.push('/')
      return
    }
    const matchData = matchResponse.data.result
    console.log(matchData)
    this.setState({
      isUserDataLoading: false,
      skip: matchResponse.length < 10 ? this.state.skip : this.state.skip + 10,
      hasMore: matchResponse.length < 10 ? false : true,
      matches: [...this.state.matches, ...matchData]
    })
  }

  handleSearchVal = (e) => {
    this.setState({
      search: e.target.value
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
          <title>Dashboard | Predict</title>
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
        </MetaTags><Grid item className='gridItem' xs={12}>
          <Card variant='outlined'>
            <CardContent>
              <Box display='flex' justifyContent='space-between' alignItems='center'>

                <Typography variant='h5'>
                  Recent Matches
                </Typography>
                <div className='search'>
                  <div className='searchIcon'>
                    <Search />
                  </div>
                  <InputBase
                    placeholder="Search Matches..."
                    className='inputBase'
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={this.handleSearchVal}
                  />
                </div>

              </Box>

            </CardContent>
          </Card>
        </Grid>
        <InfiniteScroll
          dataLength={this.state.matches.length}
          next={this.loadMoreMatches}
          hasMore={this.state.hasMore}
          endMessage={
            <Grid item xs={12} className='gridItem'>
              <Card variant='outlined'>
                <CardContent>
                  <Typography variant='caption' color='textSecondary'>
                    This is it. You're done.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>}
        >
          {this.state.matches.map((match) => {
            if (match.teamHome.name.toLowerCase().includes(this.state.search.toLowerCase()) || match.teamAway.name.toLowerCase().includes(this.state.search.toLowerCase()) || match.league.name.toLowerCase().includes(this.state.search.toLowerCase()) || match.venue.toLowerCase().includes(this.state.search.toLowerCase()))
              return (
                <Grid item className='gridItem' xs={12}>
                  <MatchView matchObj={match} />
                </Grid>
              )
            return null
          })}
        </InfiniteScroll>

      </Grid >
    );
  }
}

export default withRouter(Dashboard);
