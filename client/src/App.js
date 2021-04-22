import logo from './logo.svg';
import './App.css';
import XPertNavbar from './components/navbar/navbar.js';
import Profile from './components/profile/profile.js';
import Upvoted from './components/upvoted/upvoted.js';
import YourStories from './components/yourstories/yourstories.js';
import SearchView from './components/search/search.js';
import WriteStory from './components/writestory/writestory.js';
import Landing from './components/landing/landing.js';
import AboutUs from './components/aboutus/aboutus.js';
import EditStory from './components/editstory/editstory.js';
import User from './components/user/user.js';
import Connections from './components/connections/connections.js';
import Story from './components/story/story.js';
import TagSearch from './components/tagSearch/tagsearch.js';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import store from './store.js';
import { BrowserRouter as Router, Route,Switch } from "react-router-dom";
import { Provider } from "react-redux";
import Footer from './components/footer/footer';
function App() {
  const mainTheme = createMuiTheme({
    palette: {
      primary: {
        main: "#242582",
      },
      secondary: {
        main: '#f64c72',
      },
      white: {
        main: "#fff",
      }
    },
  });
  return (
    
      <ThemeProvider theme={mainTheme}>
        <Provider store={store}>
          <Router forceRefresh>
            <div className="App">
              <XPertNavbar />
              <Switch>

                <Route exact path="/" component={Landing}  />
                <Route exact path="/profile/" component={Profile} />
                <Route exact path="/tags/:id" component={TagSearch} />
                <Route exact path="/upvoted/" component={Upvoted} />
                <Route exact path="/story/:id" component={Story} />
                <Route exact path="/yourstories/" component={YourStories} />
                <Route exact path="/ourstory/" component={AboutUs} />
                <Route exact path="/connections/" component={Connections} />
                <Route exact path="/writestory/" component={WriteStory} />
                <Route exact path="/search/:id" component={SearchView} />
                <Route exact path="/user/:id" component={User} />
                <Route exact path="/editstory/:id" component={EditStory} />
                <Route exact component={Landing} />
              </Switch>
              <Footer />
            </div>
          </Router>
        </Provider>
      </ThemeProvider>
  );
}

export default App;
