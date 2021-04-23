import { Component } from "react"
import { Link, withRouter } from 'react-router-dom'
import { Grid, Dialog, DialogContent,DialogTitle,Typography } from '@material-ui/core'
import policy from '../policy'
var template = { __html: policy };

class Footer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      openPolicy: false,
      openHelp: false,
    }
  }
  preventDefault = (event) => event.preventDefault();
  handlePolicyModal = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({
      ...this.state,
      openPolicy: !this.state.openPolicy,
    })
  }
  handleHelpModal = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({
      ...this.state,
      openHelp: !this.state.openHelp,
    })
  }

  render() {
    return (
      <Grid container className='footer'>
        <Grid container className='footerCenter'>
          <Grid item xs={3} sm={1}>
            <Link to='/ourstory'>About</Link>
          </Grid>
          <Grid item xs={3} sm={1}>
            <Link to='/'>Security</Link>
          </Grid>
          <Grid item xs={3} sm={1}>
            <Link onClick={this.handleHelpModal}>Help</Link>
          </Grid>
          <Grid item xs={3} sm={1}>
            <Link to='/'>Jobs</Link>
          </Grid>
          <Grid item xs={3} sm={1}>
            <Link to='/'>API</Link>
          </Grid>
          <Grid item xs={3} sm={1}>
            <Link to='/'>Jobs</Link>
          </Grid>
          <Grid item xs={3} sm={1}>
            <Link to='/'>Internships</Link>
          </Grid>
          <Grid item xs={3} sm={1}>
            <Link to='/'>Sponsors</Link>
          </Grid>
          <Grid item xs={12}>
            <Link onClick={this.handlePolicyModal}>©Copyright 2021 - Present</Link>
          </Grid>
          <Grid item xs={12}>
            <Link onClick={this.handlePolicyModal}>All Rights Reserved.</Link>
          </Grid>
          <Grid item xs={12}>
            <Link to='/'>Predict</Link>
          </Grid>
        </Grid>

        <Dialog className='dialog'
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description" onClick={this.handleHelpModal}  open={this.state.openHelp}>

              <DialogTitle id="alert-dialog-title">Predict | Help & FAQ</DialogTitle>
              <DialogContent>
                <Typography variant="h6">What is Predict all about?</Typography>
                <Typography >
                  Predict is a Platform where you can place a friendly bet with your friends on Football matches! To avoid conspiracies, we have limited betting to only with friends! Have fun, and experience the thrill of winning along with your favourite Football teams!
                </Typography>
                <Typography variant="h6">What Information do you store about me?</Typography>
                <Typography >
                  Apart from your Email ID, Display Image and your Name, nothing else.
                </Typography>
                <Typography variant="h6">What more can I do after logging in?</Typography>
                <Typography >
                  After you login, make sure you connect with your Friends! After you have some friends, look for your favourite Football teams and place your bets. This sends an invitation to your Friend so that your Friend can bet on the opposing team. Wait for the Results! If you win, we've got some nice rewards for you! If you lose, there's always next time! Head over to the Rewards section to claim Gift Cards and Stuff!
                </Typography>
                <Typography variant="h6">Are there any Microtransactions on Predict?</Typography>
                <Typography >
                  Predict doesn't involve any Monetory transactions apart from the only currency used on the Platform - the P Coins! You can use P Coins to claim Gift Cards and Goodies!
                </Typography>
                <Typography variant="h6">My question is not listed above. What do I do?</Typography>
                <Typography >
                  Don't worry. Write us at help(at)predict(dot)herokuapp(dot)com. We'll definitely ping you within a day regarding your query.
                </Typography>
              </DialogContent>
            </Dialog>
        <Dialog className='dialog'
          aria-describedby="alert-dialog-description" onClose={this.handlePolicyModal} open={this.state.openPolicy}>
          <DialogContent>
            <div className='paper'>
              <h2 id="transition-modal-title">Predict Privacy Policy</h2>

              <span dangerouslySetInnerHTML={template} />
            </div>
          </DialogContent>
        </Dialog>
      </Grid>
    )
  }

}

export default withRouter(Footer);