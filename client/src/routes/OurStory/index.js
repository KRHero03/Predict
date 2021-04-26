import React from "react";
import Grid from "@material-ui/core/Grid";
import { Typography, Card } from "@material-ui/core";
import MetaTags from 'react-meta-tags'
import Logo from "../../logo.png";

import { withRouter } from 'react-router-dom'

class AboutUs extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      leftDrawer: false,
    }
  }
  render() {
    return (
      <Grid className='home'>
        <MetaTags>
          <title>Our Story | Predict</title>
          <meta id="meta-description" name="description" content="About us. Our Story here @ Predict" />
          <meta id="og-title" property="og:title" content="Predict" />
          <meta id="og-image" property="og:image" content={Logo} />
        </MetaTags>
        <Card variant='outlined' style={{ padding: 10 }}>
          <Grid container >
            <Grid item xs={12} className='homeCenter'>
              <div className=''>
                <img alt="Predict Logo" className='homeLogo' src={Logo} />
                <div style={{ fontSize: 30, textAlign: 'center' }}>Predict</div>
              </div>
            </Grid>
            <Grid container xs={12} justify="start">
              <Grid item>
                <Typography variant="h6" align="left">What we have in Store for you</Typography>
                <p>
                  Predict is a Fantasy League Platform. Place friendly bets with your friends on upcoming Football matches. Wait for the results and win along with your favourite Football teams!
                </p>
                <p align="left">
                  Predict does not involve mass betting to prevent conspiracies. The Predict Intiative is taken to bring a light smile amidst the Coronavirus Pandemic.
                </p>
                <p align="left">
                  Predict doesn't involve any Monetory transactions apart from it's own Platform currency - the P Coins! P Coins can be used to claim Rewards from the Rewards Store.
                </p>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" align="left">The Team</Typography>
                <p align="left">
                  U18CO019 Dhruv Rana
                </p>
                <p align='left'>
                  U18CO024 Smit Patel
                </p>
                <p align='left'>
                  U18CO026 Darshil Savaliya
                </p>
                <p align='left'>
                  U18CO081 Krunal Rank
                </p>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" align="left">Contact</Typography>
                <p align="left">
                  Email: hola(at)predict(dot)herokuapp(dot)com
                </p>
                <p align="left">
                  Phone: +91 6322 412 322
                </p>
                <p align="left">
                  Fax: +22 675 124 5
                </p>
                <Typography  align="left"  color="textSecondary">
                  Predict<br />
                  NIT Surat, Surat<br />
                  India<br />
                  395007
                </Typography>
              </Grid>
            </Grid>

          </Grid>
        </Card>
      </Grid>
    );
  }
}

export default withRouter(AboutUs);