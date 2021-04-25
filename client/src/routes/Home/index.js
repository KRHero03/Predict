import { Component } from "react"
import { Container, Button, Typography, Grid, Box,Link } from '@material-ui/core'
import Logo from '../../logo.png'
import GoogleLogo from '../../assets/google_logo.png'
import Skeleton from '@material-ui/lab/Skeleton'
import { withRouter } from 'react-router-dom'
import Dashboard from '../Dashboard'
import MetaTags from 'react-meta-tags'
import axios from 'axios'
class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isAuthenticated: false,
      user: null,
      isLoading: true,
    }
  }

  async componentDidMount() {
    const response = await axios.get('/api/current_user')
    if (!response.data){
      this.setState({
        isLoading:false
      })
      return
    }
    this.setState({
      isAuthenticated: true,
      isLoading: false,
      user: response.data
    })
  }


  render() {

    if (this.state.isAuthenticated) return (<Dashboard />)
    if (this.state.isLoading)
      return (
        <Grid className='home'>
          <Skeleton type='rect' className='rectangleSkeleton' />
        </Grid>
      )
    return (
      <Grid className='home'>
        <MetaTags>
          <title>Home | Predict</title>
          <meta id="meta-description" name="description" content="Predict - Bet. Wait. Win." />
          <meta id="og-title" property="og:title" content="Predict" />
          <meta id="og-image" property="og:image" content={Logo} />
        </MetaTags>
        <Grid item xs={12}>
          <Box display='flex' alignItems='center' justifyContent='center' style={{ marginTop: 10, marginBottom: 10 }}>
            <img src={Logo} alt="Logo" className='homeLogo' />
          </Box>
        </Grid>
        <Grid item xs={12} className='gridItem'>
          <Box display='flex' alignItems='center' justifyContent='center' >
            <Typography variant='h3'>
              Predict
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} className='gridItem'>
          <Box display='flex' alignItems='center' justifyContent='center' >
            <Typography variant='h5' color='textSecondary'>
              Bet. Wait. Win.
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} className='gridItem'>
          <Box display='flex' alignItems='center' justifyContent='center'>
            <Link href='/auth/google' component='a' className='link'>
            <Button className='signInButton' variant="contained" color="primary">
              <img src={GoogleLogo} alt="GoogleLogo" className='homeGoogleLogo' />
              SIGN IN WITH GOOGLE
            </Button>
          </Link>
          </Box>
      </Grid>
      </Grid >
    )
  }

}

export default withRouter(Home);