import React from "react";
import axios from 'axios';
import { connect } from "react-redux";
import { setCurrentUser } from "../../actions/authActions";
import { withStyles } from '@material-ui/core/styles';
import Proptypes from 'prop-types';
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
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
  Logo: {
    height: "250px",
    width: "250px",
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
class Landing extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isAuthenticated: this.props.auth.isAuthenticated,
      user: this.props.auth.user,
      leftDrawer: false,
      tags: []
    }
  }
  async componentDidMount() {
    await this.props.setCurrentUser();  
    this.setState({
      ...this.state,
      isAuthenticated: this.props.auth.isAuthenticated,
      user: this.props.auth.user,
    });


    await axios
      .get("/api/get_all_tags")
      .then(res => {
        this.setState(prevState => {
          return {
            ...prevState,
            tags: res.data
          }
        })
      })
      .catch(err => console.log(err));
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.base}>
        <Grid container >
          <Grid item xs={12}>
            <div className={classes.firstgrid}>
              <img alt="XPert Logo" className={classes.Logo} src={Logo} />
              <div>XPert</div>
              <div style={{fontSize: 30}}>Ocean of Thoughts</div>
            </div>
          </Grid>
          <Grid container className={classes.desktop} xs={12} justify="center">

            <Grid item>
              <Button component="a" href='/' color="primary" >
                Home
                </Button>
            </Grid>
            <Grid item>
              <Button color="primary" href='/ourstory' >
                Our Story
                </Button>
            </Grid>
            <Grid item>
              {this.state.isAuthenticated?
              (
                null
              ):
              (

                <Button component="a" href='/auth/google' variant="contained" color="primary" disableElevation>
                Get Started
                </Button>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Parallax className={classes.parallax}
              bgImage={ReadBG}
              strength={600}
              renderLayer={percentage => (
                <div>
                  <div
                    style={{
                      position: "absolute",
                      background: '#242582a0',
                      left: "50%",
                      top: "50%",
                      borderRadius: "50%",
                      transform: "translate(-50%,-50%)",
                      width: percentage * 350,
                      height: percentage * 350,
                    }}
                  />
                </div>
              )}
            >
              <div style={{ height: '300px' }}>
                <div style={insideStyles}>Read.</div>
              </div>
            </Parallax>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.parallaxgap}><div>"Reading is to the mind what Exercise is to the body."</div></div>
          </Grid>
          <Grid item xs={12}>
            <Parallax className={classes.parallax}
              bgImage={WriteBG}
              strength={600}
              renderLayer={percentage => (
                <div>
                  <div
                    style={{
                      position: "absolute",
                      background: '#242582a0',
                      left: "50%",
                      top: "50%",
                      borderRadius: "50%",
                      transform: "translate(-50%,-50%)",
                      width: percentage * 350,
                      height: percentage * 350,
                    }}
                  />
                </div>
              )}
            >
              <div style={{ height: '300px' }}>
                <div style={insideStyles}>Write.</div>
              </div>
            </Parallax>
          </Grid>

          <Grid item xs={12}>
            <div className={classes.parallaxgap}><div>"There's no wrong or right. Just WRITE."</div></div>
          </Grid>


          <Grid item xs={12}>
            <Parallax className={classes.parallax}
              bgImage={ExploreBG}
              strength={600}
              renderLayer={percentage => (
                <div>
                  <div
                    style={{
                      position: "absolute",
                      background: '#242582a0',
                      left: "50%",
                      top: "50%",
                      borderRadius: "50%",
                      transform: "translate(-50%,-50%)",
                      width: percentage * 350,
                      height: percentage * 350,
                    }}
                  />
                </div>
              )}
            >
              <div style={{ height: '300px' }}>
                <div style={insideStyles}>Explore.</div>
              </div>
            </Parallax>
          </Grid>

          <Grid container justify="center">
            <Grid item xs={6}>
              <div className={classes.parallaxgap} style={{fontSize: 18}}><div> •&nbsp;
                {this.state.tags.map((tag, idx) => (
                  <here><Link className={classes.link} href={"/tags/"+tag._id}>{tag.name.toUpperCase()}</Link> • </here>
                  
                ))}
              </div></div>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

Landing.propTypes = {
  classes: Proptypes.object.isRequired,
}
export default connect(mapStateToProps,
  { setCurrentUser })(withStyles(styles)(Landing));
