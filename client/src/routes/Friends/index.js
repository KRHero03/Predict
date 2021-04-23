import { Component } from "react";
import { withRouter } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import MetaTags from "react-meta-tags";
import { Typography, Card, Fab, CircularProgress, Box, Link, CardHeader, CardActions, CardContent, Avatar, Button, IconButton, Tooltip, InputBase } from "@material-ui/core";
import { PlayArrow, Search, MoreVert } from '@material-ui/icons';
import Logo from "../../logo.png";

class Friends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthenticated: false,
      isUserDataLoading: false,
    };
  }
  async componentDidMount() {
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
                    onKeyUp={this.handleSearch}
                    onChange={this.handleSearchVal}
                  />
                </div>

              </Box>

            </CardContent>
          </Card>
        </Grid>
        <Grid item className='gridItem' xs={12}>
          <Card variant='outlined'>
            <CardHeader
              avatar={
                <Avatar aria-label="profile-photo" >
                  {"R"}
                </Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVert />
                </IconButton>
              }
              title={"Username"}
            />
            <CardContent>
              <Typography variant='caption' color='textSecondary'>Friends: {0} &nbsp;&nbsp;</Typography>
              <Typography variant='caption' color='textSecondary'>P Coins: {0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid >
    );
  }
}

export default withRouter(Friends);
