import React from "react";
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import Proptypes from 'prop-types';
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import Link from "@material-ui/core/Link";
import LinearProgress from "@material-ui/core/LinearProgress";
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

import { setCurrentUser } from "../../actions/authActions";
import { TextField } from "@material-ui/core";



const styles = (theme) => ({
    paper: {
        display: 'flex',
        padding: theme.spacing(1),
        color: theme.palette.text.primary,
        margin: 10,
        transition: 'all 0.2s',
        width: '100%',
        textAlign: 'left',
        '&:hover': {
            transform: 'scale(1.01)'
        },

    },
    base: {
        minHeight: '90vh',
        fontWeight: 7,
        fontSize: 40,
        textAlign: 'left',
        marginTop: '25vh',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 34,
        marginTop: 50,
        marginBottom: 20
    },
    description: {
        marginTop: 10,
    },
    content: {
        marginTop: 10,
    },
    box: {
        marginTop: 10,
        marginBottom: 10,
        maxHeight: '300px',
        overflow: 'auto',
    },
    tags: {
        marginTop: 30,
        fontWeight: 'normal'
    },
    commentButton: {
        marginTop: 30,
        marginBottom: 30
    },
    author: {
        marginTop: 10,
        display: 'flex',
        alignItems: 'center',
    },
    commentBase: {
        marginTop: 30
    },
    comment: {
        marginTop: 10,
        marginBottom: 10,
        boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.5)',
        borderRadius: '4px',
        padding: 10

    },
    Logo: {
        [theme.breakpoints.up('sm')]: {
            height: "250px",
            width: "250px"
        },
    },
    link: {
        color: 'black',
        textDecoration: 'none',
        transition: 'all 0.2s',
        width: '100%',
        '&:hover': {
            textDecoration: 'none',
        }
    },
    extraHeight: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    extraHeight1: {
        minHeight: '90vh',
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
    },

});



class Connections extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            user: this.props.auth.user,
            isAuthenticated: this.props.auth.isAuthenticated,
            followers: [],
            following: [],
            isLoading: true,
            searchFollower: "",
            searchFollowing: "",
            displayFollowers: [],
            displayFollowing: [],
        }
    }
    async componentDidMount() {
        await this.props.setCurrentUser();
        this.setState({
            user: this.props.auth.user,
            isAuthenticated: this.props.auth.isAuthenticated
        })
        if (!(this.state.isAuthenticated)) {

            this.props.history.push('/')
        }
        const followerResponse = await axios.post('/api/follower', { "userID": this.state.user._id })
        const followerData = followerResponse.data

        followerData.sort((a, b) => {
            return a.name < b.name
        })
        this.setState({
            followers: followerData
        })

        const followingResponse = await axios.post('/api/following', { "userID": this.state.user._id })
        const followingData = followingResponse.data

        followingData.sort((a, b) => {
            return a.name < b.name
        })
        this.setState({
            following: followingData,
            displayFollowers: followerData,
            displayFollowing: followingData,
            isLoading: false
        })

    }
    render() {


        const { classes } = this.props;

        const handleSearchFollower = (e) => {
            const searchString = e.target.value.toLowerCase()
            this.setState({
                searchFollower: e.target.value
            })
            this.setState({
                displayFollowers:searchString.length==0?this.state.followers: this.state.followers.filter((e)=> {return e.name.toLowerCase().includes(searchString)})
            })
        }


        const handleSearchFollowing = (e) => {
            const searchString = e.target.value.toLowerCase()
            this.setState({
                searchFollowing: e.target.value
            })
            this.setState({
                displayFollowing:searchString.length==0?this.state.following: this.state.following.filter((e)=> {return e.name.toLowerCase().includes(searchString)})
            })
        }
        return (<div>
            {this.state.isLoading ?
                (
                    <Container className={classes.base}>
                        <LinearProgress />
                    </Container>
                ) :
                (
                    <Container className={classes.base}>

                        <Grid container xs={12} className={classes.title} justify='space-between'>
                            <Grid item xs={12} sm={4}>
                                {"Followers (" + this.state.followers.length + ")"}
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="searchFollowerTF"
                                    label="Search Followers"
                                    value={this.state.searchFollower}
                                    onChange={handleSearchFollower}
                                    type="text"
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                        <Divider />
                        {this.state.followers.length === 0 ? (
                            <Grid item xs={12} className={classes.content}>
                                <Typography>
                                    You have no followers. Go check out more content, write stories, connect with people.
                        </Typography>
                            </Grid>
                        ) : (

                                <Grid container xs={12} className={classes.box}>
                                    {this.state.displayFollowers.map((follower) => {

                                        return (
                                            <Grid item xs={12} sm={4}>
                                                <Link href={"/user/" + follower._id} className={classes.link}>
                                                    <Container>
                                                        <Card elevation={3} Container className={classes.paper}>
                                                            <Grid container>
                                                                <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <Avatar alt={follower.name} src={follower.photo} style={{ display: 'inline-block' }} />
                                                                    <Typography display="inline" variant="h6" style={{ display: 'inline-block', margin: 2 }}>{follower.name}</Typography>

                                                                </Grid>

                                                            </Grid>
                                                        </Card>
                                                    </Container>
                                                </Link>
                                            </Grid>
                                        )
                                    })}
                                </Grid>
                            )}
                        <Grid container xs={12} className={classes.title} justify='space-between'>
                            <Grid item xs={12} sm={4}>
                                {"Following (" + this.state.following.length + ")"}
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="searchFollowingTF"
                                    label="Search Following"
                                    value={this.state.searchFollowing}
                                    onChange={handleSearchFollowing}
                                    type="text"
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                        <Divider />
                        {this.state.following.length === 0 ? (
                            <Grid item xs={12} className={classes.content}>
                                <Typography>
                                    You didn't follow anyone. Read people's stories, follow them and connect.
                        </Typography>
                            </Grid>
                        ) : (

                                <Grid container xs={12} className={classes.box}>
                                    {this.state.displayFollowing.map((follower) => {

                                        return (
                                            <Grid item xs={12} sm={4}>
                                                <Link href={"/user/" + follower._id} className={classes.link}>
                                                    <Container>
                                                        <Card elevation={3} Container className={classes.paper}>
                                                            <Grid container>
                                                                <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <Avatar alt={follower.name} src={follower.photo} style={{ display: 'inline-block' }} />
                                                                    <Typography display="inline" variant="h6" style={{ display: 'inline-block', margin: 2 }}>{follower.name}</Typography>

                                                                </Grid>

                                                            </Grid>
                                                        </Card>
                                                    </Container>
                                                </Link>
                                            </Grid>
                                        )
                                    })}
                                </Grid>
                            )}
                    </Container>
                )
            }
        </div>
        );
    }
}
const mapStateToProps = state => ({
    auth: state.auth
});

Connections.propTypes = {
    classes: Proptypes.object.isRequired,
}
export default connect(mapStateToProps,
    { setCurrentUser })(withStyles(styles)(Connections));