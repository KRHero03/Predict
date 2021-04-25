import { Component } from "react";
import { withRouter } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import MetaTags from "react-meta-tags";
import { Typography, Card, Fab, CircularProgress, Box, Link, CardHeader, CardActions, CardContent, Avatar, Button, IconButton, Tooltip } from "@material-ui/core";
import { PlayArrow } from '@material-ui/icons';
import Logo from "../../logo.png";
import axios from 'axios'

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthenticated: false,
      isUserDataLoading: false,
    };
  }
  async componentDidMount() {
    const response = await axios.get('/api/current_user')
    if (!response.data){
      this.props.history.push('/')
      return
    }
    this.setState({
      isAuthenticated: true,
      isLoading: false,
      user: response.data
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
        </MetaTags>
        <Grid item className='gridItem' xs={12}>
          <Card variant='outlined'>
            <CardContent>
              <Typography variant='body' color='textSecondary'>
                Match ID
              </Typography>
              <Box display='flex' alignItems='center' justifyContent='center' style={{textAlign:'center'}}>
                <Grid style={{ margin: 10 }}>
                  <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Avatar src={"TeamURL 1"} />
                  </Grid>
                  <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography variant='h5'>Team Name 1</Typography>
                  </Grid>
                </Grid>
                <Typography variant='h3' style={{ margin: 10 }}>VS</Typography>
                <Grid style={{ margin: 10 }}>
                  <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Avatar src={"TeamURL 2"} />
                  </Grid>
                  <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Typography variant='h5'>Team Name 2</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box display='flex' alignItems='center' justifyContent='center'>
                <Typography variant='body' color='textSecondary'>
                  Match Time
                </Typography>
              </Box>
              <Box display='flex' alignItems='center' justifyContent='center'>
                <Typography variant='body' color='textSecondary'>
                  Odds
                </Typography>
              </Box>
            </CardContent>
            <CardActions>
              <Tooltip title="Place Bet" placement='bottom'>
                <IconButton aria-label='Place Bet'>
                  <PlayArrow />
                </IconButton>
              </Tooltip>
            </CardActions>
          </Card>
        </Grid>
      </Grid >
    );
  }
}

export default withRouter(Dashboard);
