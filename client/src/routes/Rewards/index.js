import { Component } from "react";
import { withRouter } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import MetaTags from "react-meta-tags";
import { Typography, Card, Fab, CircularProgress, Box, CardHeader, CardActions, CardContent, Avatar, Button, IconButton, Tooltip } from "@material-ui/core"
import RewardView from '../../components/RewardView'
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
      rewards: [],
      rewardCoins: 0,
      pagination: 0,
      hasMore: true,
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

    this.setState({
      rewardCoins: this.state.user.rewardCoins
    })

    const rewardsResponse = await axios.post('/api/get_all_rewards')

    if (!rewardsResponse.data.success) {
      this.props.history.push('/')
      return
    }
    const rewardsData = rewardsResponse.data.result
    this.setState({
      rewards: rewardsData,
      pagination: rewardsData.length > 10 ? 10 : rewardsData.length,
      hasMore: rewardsData.length > 10 ? true : false,
      isUserDataLoading: false,
    })
  }


  loadMoreUsers = () => {
    if (this.state.pagination + 10 > this.state.rewards.length) {
      this.setState({
        hasMore: false,
        pagination: this.state.rewards.length
      })
    }
    this.setState({
      pagination: this.state.pagination + 10
    })
  }

  buyItemCallback = (cost) => {
    let user = this.state.user
    user.rewardCoins -= cost
    this.setState({
      rewardCoins: this.state.rewardCoins - cost,
      user: user
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
          <title>Rewards | Predict</title>
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
          <CardHeader
            title={'Rewards at Predict'}
            subheader={
              <Box display='flex' justifyContent='space-between'>
                <Typography>Use your P Coins to Claim these Rewards!</Typography>
                <Typography>{this.state.user.rewardCoins + ' P Coins'}</Typography>
              </Box>
            }
          />
          <CardContent>
            <InfiniteScroll
              dataLength={this.state.pagination}
              next={this.loadMoreUsers}
              hasMore={this.state.hasMore}
              endMessage={
                <Grid item xs={12} className='gridItem'>
                  <Card variant='outlined'>
                    <CardContent>
                      <Typography variant='caption' color='textSecondary'>
                        No more search results.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>}
            >
              <Grid container>
                {this.state.rewards.slice(0, this.state.pagination).map((reward) => {

                  return (

                    <Grid item className='gridItem' xs={12} sm={6}>
                      <RewardView user={this.state.user} reward={reward} buyItemCallback={this.buyItemCallback} />
                    </Grid>
                  )
                })}
              </Grid>
            </InfiniteScroll>

          </CardContent>
        </Card>
      </Grid >
    );
  }
}

export default withRouter(Dashboard);
