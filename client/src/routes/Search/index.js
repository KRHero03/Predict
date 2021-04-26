import { Component } from "react";
import { withRouter } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import MetaTags from "react-meta-tags";
import { Typography, Card, CardContent,} from "@material-ui/core";
import Logo from "../../logo.png";
import UserView from '../../components/UserView'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component'

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthenticated: false,
      isUserDataLoading: false,
      query: this.props.match.params.id,
      resultIDs: [],
      pagination: 0,
      hasMore: true,
    };
  }
  async componentDidMount() {
    const response = await axios.get('/api/current_user')
    if (!response.data || !this.state.query || this.state.query.length === 0) {
      this.props.history.push('/')
      return
    }
    this.setState({
      isAuthenticated: true,
      isLoading: false,
      user: response.data
    })

    const userResponse = await axios.post('/api/search', { query: this.state.query })
    console.log(userResponse.data.success)
    if (!userResponse.data.success) {
      this.props.history.push('/')
      return
    }
    const dataCount = userResponse.data.result.length
    this.setState({
      resultIDs: userResponse.data.result,
      pagination: dataCount > 10 ? 10 : dataCount,
      hasMore: dataCount > 10 ? true : false,
      isUserDataLoading: false
    })
  }

  loadMoreUsers = () => {
    if (this.state.pagination + 10 > this.state.resultIDs.length) {
      this.setState({
        hasMore: false,
        pagination: this.state.resultIDs.length
      })
    }
    this.setState({
      pagination: this.state.pagination + 10
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
          <title>Search Results | Predict</title>
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
              <Typography>Search Results</Typography>
            </CardContent>
          </Card>
        </Grid>
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
          {this.state.resultIDs.slice(0, this.state.pagination).map((id) => {
            return (
              <Grid item xs={12} className='gridItem'>
                <UserView id={id} currentUser={this.state.user} />
              </Grid>
            )
          })}
        </InfiniteScroll>
      </Grid >
    );
  }
}

export default withRouter(Search);
