const Match = require('../models/match')
const ServerVars = require('../models/server_variables')
const User = require('../models/user')
const Challenge = require('../models/challenge')
const { env, dev, production } = require('../config/keys')
var request = require("request");
const { addNotification } = require('./create_notification')

const footballApiKey = env === 'dev' ? dev.apiFootballKey : production.apiFootballKey

module.exports.fetchMatchFixtures = () => {
  fetchData()
  setInterval(() => {
    fetchData()
  }, 7 * 60 * 60 * 24 * 1000)
}

fetchData = async () => {
  console.log('FetchData Invoked!')

  var team_ids = [33, 40, 42, 45, 46, 47, 49, 50,
                  529, 530, 532, 536, 541,
                  157, 163, 165, 173,
                  489, 492, 496, 497, 499, 505,
                  79, 80, 85, 91,
                  1, 2, 3, 4, 5, 9, 10, 15, 21, 24, 25, 27, 767, 768, 772, 1110, 14456,
                  6, 7, 8, 16, 26, 30, 2380, 2383, 2384];
  
  for(var i = 0; i < team_ids.length; i++) {
    var options = {
      method: 'GET',
      url: 'https://v3.football.api-sports.io/fixtures',
      qs: { 
        team: team_ids[i],
        next: 4,
       },
      headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': footballApiKey
      }
    };
    try { 
      request(options, async (error, response, body) => {
        if (error) {
          console.log(error)
          return
        }
        const result = JSON.parse(body)
        const fixtureDetails = result.response
        if (result.errors.length > 0) {
          console.log(result.errors)
          return
        }
        
        await Promise.all(fixtureDetails.map(async (res) => {
          const response = await Match.findOne({ matchID: res.fixture.id })
          if (response) return true
          if (res.fixture.status.long !== 'Not Started') return true
          await new Match({
            matchID: res.fixture.id,
            referee: res.fixture.referee,
            timestamp: res.fixture.timestamp * 1000,
            venue: res.fixture.venue.name + ', ' + res.fixture.venue.city,
            league: {
              name: res.league.name,
              country: res.league.country,
              logo: res.league.logo,
              season: res.league.season,
              round: res.league.round
            },
            teamHome: {
              name: res.teams.home.name,
              logo: res.teams.home.logo,
              score: res.goals.home,
            },
            teamAway: {
              name: res.teams.away.name,
              logo: res.teams.away.logo,
              score: res.goals.away,
            },
            winner: res.teams.home.winner ? "home" : res.teams.away.winner ? "away" : "nil",
            status: res.fixture.status.long,
            challenges: []
          }).save()
        }))
      });
      setTimers()
    } catch (e) {
      console.log(e)
    }
  }
}



setTimers = async () => {
  console.log('Setting Timers for Ongoing Matches')
  const response = await Match.find({ status: { $ne: "Match Finished" } }, { matchID: 1, timestamp: 1 })
  var cnt = 0
  var interval = 60000
  response.forEach((res) => {
    const id = res.matchID
    const matchTime = res.timestamp
    const d = new Date(matchTime)
    d.setTime(d.getTime() + 1000 * 60 * 60 * 3)
    const fetchTimestamp = d.getTime()
    const curDate = new Date().getTime()
    const diff = Math.max(1000, fetchTimestamp - curDate)

    setTimeout(()=>{
      setTimerForMatch(id, diff)
    },cnt)
    cnt = cnt + interval
  })
  console.log('Completed Setting timers')
}

setTimerForMatch = (id, diff) => {
  setTimeout(async () => {
    const match = await Match.findOne({ matchID: id })
    if (match.status === 'Match Finished' || match.status === 'Not Decided (Declared as Draw)') {
      return
    }
    console.log('Getting Match Details for Match',id)
    var options = {
      method: 'GET',
      url: 'https://v3.football.api-sports.io/fixtures',
      qs: { id: id },
      headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': footballApiKey
      }
    };
    request(options, async (error, response, body) => {
      if (error) {
        console.log(error)
        return
      }
      try {
        const result = JSON.parse(body)
        const fixtureDetails = result.response[0]
        if (result.errors.length > 0) {
          setTimerForMatch(id, 1000 * 60 * 60 * 24)
          return
        }
        const winner = fixtureDetails.teams.home.winner ? 'home' : fixtureDetails.teams.away.winner ? 'away' : 'nil'
        const matchResponse = await Match.findOne({ matchID: id })
        matchResponse.set({ winner: winner, teamHome: { score: fixtureDetails.goals.home }, teamAway: { score: fixtureDetails.goals.away }, status: fixtureDetails.fixture.status.long === 'Match Finished' ? 'Match Finished' : 'Not Decided (Declared as Draw)' })

        await matchResponse.save()
        if (!matchResponse.challenges) return

        const challenges = matchResponse.challenges
        if (winner == 'nil') {
          await Promise.all(challenges.map(async (id) => {

            const challenge = await Challenge.findOne({ _id: id })
            console.log(challenge)
            if(!challenge.accepted){
              await challenge.delete()
              await Match.updateOne({matchID:id,$pull:{challenges:challenge._id}})
              return
            }
            const userID1 = challenge.userID1
            const userID2 = challenge.userID2
            const amount = challenge.betAmount
            challenge.set({ status: fixtureDetails.fixture.status.long === 'Match Finished' ? 'Match Finished' : 'Not Decided (Declared as Draw)', winner: 'nil' })
            await challenge.save()
            const user1 = await User.findOne({ _id: userID1 })
            user1.set({ rewardCoins: user1.rewardCoins + amount })
            user1.save()
            const user2 = await User.findOne({ _id: userID2 })
            user2.set({ rewardCoins: user2.rewardCoins + amount })
            user2.save()
            const message = 'Match ' + matchResponse.teamHome.name + ' vs ' + matchResponse.teamAway.name + ' has been declared as draw! Your P Coins have been refunded!'
            await addNotification(user1._id, message, matchResponse.league.logo, '/bets/2')
            await addNotification(user2._id, message, matchResponse.league.logo, '/bets/2')
          }))
        } else if (winner == 'home') {
          await Promise.all(challenges.map(async (id) => {

            const challenge = await Challenge.findOne({ _id: id })
            const userID1 = challenge.userID1
            const userID2 = challenge.userID2
            const amount = challenge.betAmount
            challenge.set({ status: 'Match Finished', winner: 'home' })
            await challenge.save()
            const user1 = await User.findOne({ _id: userID1 })
            user1.set({ rewardCoins: user1.rewardCoins + 2 * amount })
            await user1.save()
            
            const query = await Score.findOne({ userID1: userID1, userID2: userID2}).select('user1Score user2Score');
            query.set({user1Score: query.user1Score + 1});
            await query.save();
            
            if (user1.usedReferralCode) {
              const referredUser = await User.findOne({ referralCode: user1.usedReferralCode })
              referredUser.set({ rewardCoins: referredUser.rewardCoins + Math.trunc(2 * 0.1 * amount) })
              await referredUser.save()
              const referredMessage = 'Your Referred User ' + user1.name + ' has won a Prediction Battle! You have earned ' + Math.trunc(2 * 0.1 * amount) + ' as a bonus!'
              await addNotification(referredUser._id, referredMessage, matchResponse.league.logo, '/profile/' + referredUser._id)
            }
            const winMessage = 'Match ' + matchResponse.teamHome.name + ' vs ' + matchResponse.teamAway.name + ' has been won by ' + matchResponse.teamHome.name + '! Congratulations, You have won the Prediction battle!'
            const lostMessage = 'Match ' + matchResponse.teamHome.name + ' vs ' + matchResponse.teamAway.name + ' has been won by ' + matchResponse.teamHome.name + '! Sorry, You have lost the Prediction battle!'
            await addNotification(user1._id, winMessage, matchResponse.league.logo, '/bets/2')
            await addNotification(user2._id, lostMessage, matchResponse.league.logo, '/bets/2')
          }))
        } else if (winner == 'away') {
          await Promise.all(challenges.map(async (id) => {
            const challenge = await Challenge.findOne({ _id: id })
            const userID1 = challenge.userID1
            const userID2 = challenge.userID2
            const amount = challenge.betAmount
            challenge.set({ status: 'Match Finished', winner: 'away' })
            await challenge.save()
            const user2 = await User.findOne({ _id: userID2 })
            user2.set({ rewardCoins: user2.rewardCoins + 2 * amount })
            user2.save()
            await referredUser.save()

            
            const query = await Score.findOne({ userID1: userID1, userID2: userID2}).select('user1Score user2Score');
            query.set({user2Score: query.user2Score + 1});
            await query.save();

            if (user2.usedReferralCode) {
              const referredUser = await User.findOne({ referralCode: user2.usedReferralCode })
              referredUser.set({ rewardCoins: referredUser.rewardCoins + Math.trunc(2 * 0.1 * amount) })
              const referredMessage = 'Your Referred User ' + user2.name + ' has won a Prediction Battle! You have earned ' + Math.trunc(2 * 0.1 * amount) + ' as a bonus!'
              await addNotification(referredUser._id, referredMessage, matchResponse.league.logo, '/profile/' + referredUser._id)
            }
            const winMessage = 'Match ' + matchResponse.teamHome.name + ' vs ' + matchResponse.teamAway.name + ' has been won by ' + matchResponse.teamAway.name + '! Congratulations, You have won the Prediction battle!'
            const lostMessage = 'Match ' + matchResponse.teamHome.name + ' vs ' + matchResponse.teamAway.name + ' has been won by ' + matchResponse.teamAway.name + '! Sorry, You have lost the Prediction battle!'
            await addNotification(user1._id, lostMessage, matchResponse.league.logo, '/bets/2')
            await addNotification(user2._id, winMessage, matchResponse.league.logo, '/bets/2')
          }))

        }

      } catch (e) {
        console.log(e)
        console.log('Error Occured in Fetching the Details')
        const d = new Date().getTime()
        setTimerForMatch(id, 1000 * 60 * 60 * 24)
      }

    })
  }, diff)
}
