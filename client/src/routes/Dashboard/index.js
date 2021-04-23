import { Component } from "react";
import { withRouter } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import MetaTags from "react-meta-tags";
import {
  Typography,
  Card,
  Fab,
  CircularProgress,
  Box,
  Link,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Logo from "../../logo.png";
import Container from "@material-ui/core/Container";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthenticated: false,
      isUserDataLoading: true,
      classes: [],
      exams: [],
    };
  }
  async componentDidMount() {
  }


  render() {
    const { exams, classes } = this.state;

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

      </Grid>
    );
  }
}

export default withRouter(Dashboard);
