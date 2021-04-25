import { Avatar, Dialog, DialogContent, DialogTitle, Divider, List, ListItem, ListItemIcon, ListItemText, Typography,Box,IconButton,Link } from "@material-ui/core"
import { AccountCircle,Group, ExitToApp, GroupWork, Help,MonetizationOn, Home,Brightness4,Store } from "@material-ui/icons"
import { Component } from "react"
import { withRouter } from 'react-router-dom'
import policy from '../policy'
import axios from 'axios'
var template = { __html: policy };


class SignInLinks extends Component {

  
  constructor(props) {
    super(props)
    this.state = {
      openPolicy: false,
      openHelp: false,
      user: this.props.user,
      isModalOpen: false,
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


  toggleModalOpen = () => {
    this.setState({
      ...this.state,
      isModalOpen: !this.state.isModalOpen
    })
  }
  render() {
    if(this.state.isLoading) return (null);
    return (
      <div className='list'>
        <List>
          <ListItem style={{display:'block'}}>
            <Box display='flex' alignItems='center' justifyContent='space-between'>

            <Avatar alt={this.state.user.name} src={this.state.user.photo} className='drawerPhoto' onClick={this.toggleModalOpen} />      
            <IconButton onClick={()=>{this.props.toggleDarkMode()}}>
              <Brightness4/>
            </IconButton>
            </Box>      
            <Typography variant="h6" >Hey There,<br/> {this.state.user.name}</Typography>
          </ListItem>
          <Divider />
          <ListItem button key="Home" component="a" href="/">
            <ListItemIcon> <Home /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button key="Profile" component="a" href="/">
            <ListItemIcon> <AccountCircle /></ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <Divider />
          <ListItem button key="Friends" component="a" href="/friends/0">
            <ListItemIcon> <Group /></ListItemIcon>
            <ListItemText primary="Friends" />
          </ListItem>
          <ListItem button key="Placed Bets" component="a" href="/bets">
            <ListItemIcon> <MonetizationOn /></ListItemIcon>
            <ListItemText primary="Placed Bets" />
          </ListItem>
          <ListItem button key="Rewards Store" component="a" href="/">
            <ListItemIcon> <Store /></ListItemIcon>
            <ListItemText primary="Rewards Store" />
          </ListItem>
          <Divider/>
          <ListItem button key="Our Story" component="a" href="/ourstory/">
            <ListItemIcon> <GroupWork /></ListItemIcon>
            <ListItemText primary="Our Story" />
          </ListItem>
          <ListItem button key="Help" onClick={this.handleHelpModal}>
            <ListItemIcon> <Help /></ListItemIcon>
            <ListItemText primary="Help" />
          </ListItem>
          <Link href='/api/logout' component='a' className='link'>
          <ListItem button key="Sign Out">
            <ListItemIcon> <ExitToApp /></ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItem>
          </Link>
          <Divider />
          <ListItem key="Copyright">
            <ListItemText secondary="© Copyright 2021 - Present" />
          </ListItem>
          <div>
            <ListItem onClick={this.handlePolicyModal} component="a" href="#" key="Privacy Policy">
              <ListItemText secondary="Privacy Policy | Predict" />
            </ListItem>
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
              aria-labelledby='Profile Photo Dialog'
              aria-describedby='Profile Photo' onClose={this.toggleModalOpen} open={this.state.isModalOpen}>
                <img src={this.state.user.photo} alt='Profile'/>
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

          </div>
        </List>

      </div>
    )
  }

}

export default withRouter(SignInLinks);