import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Divider from "@material-ui/core/Divider";
import { withStyles } from '@material-ui/core/styles';
import Proptypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import FooterSVG from '../../assets/svg/background.svg';
import Twitter from '@material-ui/icons/Twitter';
import Facebook from '@material-ui/icons/Facebook';
import Instagram from '@material-ui/icons/Instagram';
import LinkedIn from '@material-ui/icons/LinkedIn';




var __html = require('./../policy/policy.js');
var template = { __html: __html };

const styles = (theme) => ({
  base: {
    // backgroundColor: theme.palette.primary.main,
    backgroundImage: `url(${FooterSVG})`,
    marginTop: 10,
    boxShadow: "-1px -1px 5px #242582"
  },
  textWhite: {
    color: theme.palette.white.main,
  },
  textSecondary: {
    color: theme.palette.white.main,
    fontSize: 12,
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 4, 3),
  },

  modal: {
    position: 'absolute',
    overflow: 'scroll',
    height: '90%',
    margin: theme.spacing(3),
  },
  icon: {
    color: 'white',
    fontSize: 34,
    margin: 10,
    transition: 'transform .2s',
    '&:hover': {
      transform: 'scale(1.2)'
    }
  }
});



class Footer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      openPolicy: false,
    }
  }

  render() {


    const handlePolicyModal = () => {
      this.setState({
        ...this.state,
        openPolicy: !this.state.openPolicy,
      })
    }
    const { classes } = this.props;
    return (
      <footer className={classes.base}>

    <div class="row grey-blue">
    </div>
        <Grid container>
          <Grid container justify="center">
            <Grid item>
              <div style={{margin: 5,fontSize: 14}} >
                <Link target="_blank" href="https://twitter.com" ><Twitter className={classes.icon} /></Link>
                <Link  target="_blank" href="https://facebook.com" ><Facebook className={classes.icon} /></Link>
                <Link target="_blank" href="https://instagram.com" ><Instagram className={classes.icon} /></Link>
                <Link  target="_blank" href="https://linkedin.com" ><LinkedIn className={classes.icon} /></Link>
              </div>
            </Grid>
          </Grid>
          <Divider />
          <Grid container justify="center">
            <Grid item >
              <Typography className={classes.textSecondary}>© Copyright 2020 - Present </Typography>

              <ListItem onClick={handlePolicyModal} component="a" href="#" key="Privacy Policy">
                <ListItemText><div className={classes.textSecondary}>Privacy Policy | X-Pert</div></ListItemText>
              </ListItem>
              <Dialog class={classes.dialog} 
        aria-describedby="alert-dialog-description" onClose={handlePolicyModal}  open={this.state.openPolicy}>

        <DialogContent>
        <div className={classes.paper}>
                                    <h2 id="transition-modal-title">XPert</h2>

                                    <span dangerouslySetInnerHTML={template} />
                                </div>
        </DialogContent>
                        </Dialog>
            </Grid>
          </Grid>
        </Grid>
      </footer>
    );
  }
}


Footer.propTypes = {
  classes: Proptypes.object.isRequired,
}
export default withStyles(styles)(Footer);