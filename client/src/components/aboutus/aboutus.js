import React from "react";
import axios from 'axios';
import { connect } from "react-redux";
import { setCurrentUser } from "../../actions/authActions";
import { withStyles } from '@material-ui/core/styles';
import Proptypes from 'prop-types';
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import Logo from "../../logo.svg";
import { Parallax } from 'react-parallax';
import ReadBG from "../../assets/images/read.jpg";
import WriteBG from "../../assets/images/write.jpg";
import ExploreBG from "../../assets/images/explore.jpg";

const styles = (theme) => ({
  paper: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.primary,
  },
  base: {
    marginTop: 100,
    minHeight: '90vh',
    fontWeight: 7,
    fontSize: 40,
  },
  divider: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: 'black'
  },
  Logo: {
    height: "250px",
    width: "250px"
  },
  link: {
    color: 'black',
    textDecoration: 'none',
    transition: 'all 0.2s',
    '&:hover' : {
      textDecoration: 'none',
      fontWeight: 'bold',
      color: theme.palette.primary.main
    }
  },
  textWhite: {
    color: 'white',
  },
  desktop: {
    margin: 10,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
      
    },
  },
  parallaxgap: {
    display: 'flex',
    minHeight: '300px',
    alignItems: 'center',
    fontSize: 28,
    fontWeight: 7,
    marginTop: 25,
    marginBottom: 25,
    justifyContent: 'center',
  },
  parallax: {

    maxHeight: '300px',
    height: '300px',
    alignItems: 'center',
    fontSize: 48,
    fontWeight: 7,
    color: 'white',
    marginTop: 25,
    justifyContent: 'center',
    [theme.breakpoints.up('sm')]: {

      maxHeight: '300px',
      height: '300px',
      display: 'flex',
      alignItems: 'center',
      fontSize: 42,
      fontWeight: 4,
      color: 'white',
      marginTop: 25,
      justifyContent: 'center',
    },
  }

});
const insideStyles = {
  background: "transparent",
  padding: 20,
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
};
class AboutUs extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isAuthenticated: this.props.auth.isAuthenticated,
      user: this.props.auth.user,
      leftDrawer: false,
    }
  }
  async componentDidMount() {
    await this.props.setCurrentUser();  
    this.setState({
      ...this.state,
      isAuthenticated: this.props.auth.isAuthenticated,
      user: this.props.auth.user,
    });


  }
  render() {
    const { classes } = this.props;
    return (
      <Container className={classes.base}>
        <Grid container >
          <Grid item xs={12}>
            <div className={classes.firstgrid}>
              <img alt="XPert Logo" className={classes.Logo} src={Logo} />
              <div>XPert</div>
              <div style={{fontSize: 30}}>Ocean of Thoughts</div>
              <Divider style={{ marginLeft: 100, marginRight: 100 }} className={classes.divider} />
            </div>
          </Grid>
          <Grid container className={classes.desktop} xs={12} justify="center">
            <Grid item>

              <Button color="primary" >
                Our Story
                </Button>
            </Grid>
            <Grid item>

              <Button color="primary" >
                Write
                </Button>
            </Grid>
            <Grid item>
              <Button component="a" href='/auth/google' variant="contained" color="primary" disableElevation>
                Get Started
                </Button>
            </Grid>
          </Grid>
          <Grid container xs={12} justify="start">
              <Grid item>
                <Typography variant="h6" align="left">The Company</Typography>
                <Typography align="left">
                    XPert : Ocean of Thoughts is an initiative to provide people throughout the world an 
                    opportunity to express their thoughts in the most independent way possible.
                    The articles available on the website are completely copyrighted by their respective owners, as
                    per the agreement in our Privacy Policy. For more details, please refer the Privacy Policy | XPert.

                </Typography>
                <Typography align="left">
                    XPert started as a Blogging Service in November, 2020 and is running since, with the love
                    and wishes of the users.
                </Typography>
                <Typography align="left">
                    It started as a Project and minimal idea to allow users to reach each other via their Thoughts
                    but it has continuously grown since then.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" align="left">The Team</Typography>
                <Typography align="left">
                    Krunal Rank, Founder and CEO, XPert
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" align="left">Contact</Typography>
                <Typography align="left">
                    Email: admin(at)xpert(dot)com
                </Typography>
                <Typography align="left">
                    Phone: +91 701 650 7648
                </Typography>
                <Typography align="left">
                    Fax: +22 675 124 5
                </Typography>
                <Typography align="left" color="textSecondary">
                    XPert : Ocean of Thoughts<br/>
                    NIT Surat, Surat<br/>
                    India<br/>
                    395007
                </Typography>
              </Grid>
          </Grid>

        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

AboutUs.propTypes = {
  classes: Proptypes.object.isRequired,
}
export default connect(mapStateToProps,
  { setCurrentUser })(withStyles(styles)(AboutUs));