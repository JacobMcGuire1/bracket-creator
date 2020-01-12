import React from 'react';

import Popup from "reactjs-popup";
import uuid from "react-uuid";

//import logo from './logo.svg';
import './App.css';


function App() {
  return (
    <div className="App">
      {//<header className="App-header"></header>
      }
      <TeamPanel/>
      <Rounds/>
      
      
    </div>
  );
}

class TeamPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: [<Team name="hi" value={0}/>],
      value: ""
    }
  }
  createTeam(name) {
    var newteam = <Team name={document.getElementById("newteamname").value} value={this.state.teams.length}/> //Shoudl do this the react way
    var newteams = [...this.state.teams]; //clones
    newteams.push(newteam);
    this.setState({
      teams: newteams
    })
    document.getElementById("newteamname").value = "";
  }
  deleteTeam(index) {
    console.log(index);
    var newteams = [...this.state.teams];
    newteams.splice(index, 1);
    this.setState({teams: newteams});
  }
  render() {
    return (
      <div id="menu">
        {this.state.teams.map((item, index) => 
          <div key={uuid()}>
            {item}
            <button onClick={() => this.deleteTeam(index)}>X</button>
          </div>
        )}
        <input
            id="newteamname"
            type="text"
         />
         <button onClick={() => this.createTeam(this.state.value)}>Make Team</button>
      </div>
    )
  }
}



class Team extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name
    }
  }
  changeName(name) {
    this.setState({
      name: name
    })
  }
  render() {
    return (
      <h3>{this.state.name}</h3>
    )
  }
}

var MATCHFORMAT = {
  BO1 : {value: 0, victory: 1, name: "BO1"}, 
  BO3 : {value: 1, victory: 2, name: "BO3"}, 
};

var TEAM = {
  A : {value: 0}, 
  B : {value: 1}, 
};



//A match consisting of games
class Match extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      format: props.format,
      showgames: false,
      scorea: 0,
      scoreb: 0,
      games: [<Game value="0" onWin={(winner) => this.handleGameWin(0, winner)}/>],
      winner: undefined,
      teamasource: undefined,
      teambsource: undefined
    };
  }
  handleGameWin(game, winner) {
    console.log(winner);
    if (winner === TEAM.A){
      this.setState({
        scorea: this.state.scorea + 1,
      },
      function () {
        if (this.state.scorea >= this.state.format.victory){
          this.setState({
            winner: TEAM.A
          })
        }else{
          this.addGame();
        }
      }
      )
    }else{
      this.setState({
        scoreb: this.state.scoreb + 1,
      },
      function () {
        if (this.state.scoreb >= this.state.format.victory){
          this.setState({
            winner: TEAM.B
          })
        }else{
          this.addGame();
        }
      }
      )
    }
  }
  addGame(){
    if (this.state.winner === undefined){
      var newgames = [];
      this.state.games.forEach(
        (item, index) =>
        newgames.push(item)
      );
      newgames.push(<Game value={this.state.games.length} onWin={(winner) => this.handleGameWin(this.state.games.length, winner)}/>);
      this.setState({
        games: newgames//this.state.games.push(<Game onWin={(winner) => this.handleWin(this.state.games.length, winner)}/>),
      })
    }
  }
  endMatch(winner){
    this.setState({
      winner: winner
    })
  }
  getWinner(){
    if (this.state.winner === TEAM.A){
      return (<p>Team A wins</p>);
    }
    if (this.state.winner === TEAM.B){
      return (<p>Team B wins</p>);
    }
    return (<p>Match Incomplete</p>);
  }
  showGames() {
    return (
      <span>
        <button onClick={() => this.reset()}>Reset Match</button>
        {this.state.games.map((item, key) => 
          <div key={item.value}>
            <h2>Game {key + 1}</h2>
            {item}
          </div>
        )}
      </span>
        /*<span className={this.state.showgames ? "" : "hidden"}>
          {this.state.games.map((item, key) => 
            <div key={item.value}>
              <h2>Game {key + 1}</h2>
              {item}
            </div>
          )}
          </span>*/
    );
  }
  reset() {
    this.setState({
      scorea: 0,
      scoreb: 0,
      winner: undefined,
      games: []
    },
    function () {
      this.setState({
        games: [<Game value="0" onWin={(winner) => this.handleGameWin(0, winner)}/>]
      })
    })
  }
  makeNextMatch() { //just for testing
    this.setState({
      teamasource: <Match format={MATCHFORMAT.BO3}/>,
      teambsource: <Match format={MATCHFORMAT.BO3}/>
    })
  }
  render() {
    return (
      <div className="match">
        <div>
          <Popup trigger={
            <button> 
              <div>
                <h3>Team A vs Team B</h3>
                <h3>{this.state.format.name}</h3>
                {this.getWinner()}
              </div>
            </button>
          } position="right center">
            <div>
              
              <label>Winner match: {this.props.winnermatch}</label>
              <select>
                {
                  this.props.matchlist().map(
                    (match, key) =>
                    <option value={match}>{match}</option>
                  )
                  }
              </select>
              <br></br>
              <label>Loser match: </label>
              <select>
                {
                  this.props.matchlist().map(
                    (match, key) =>
                    <option value={match}>{match}</option>
                  )
                  }
              </select>
              <br></br>
              {this.showGames()}
            </div>
          </Popup>
        </div>
        <div>
          {this.state.teamasource}
          {this.state.teambsource}
        </div>
      </div>
      //<div onClick={() => this.setState({showgames: !this.state.showgames})}>
         //   <h1>Team A vs Team B</h1>
       //     <h1>{this.state.format.name}</h1>
        //    {this.getWinner()}
       // {this.showGames()}
      //</div>
    );
  }
}

//An individual game.
//Should add support for the score later.
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      winner: undefined
    };
  }
  setWinner(winner) {
    //may need to change namne?
    if (this.state.winner !== winner){
      this.setState({
        winner: winner
      })
      this.props.onWin(winner);
    }
  }
  getWinner() {
    if (this.state.winner === TEAM.A) {
      return (<p>Team A wins</p>);
    }
    else{
      if (this.state.winner === TEAM.B) {
        return (<p>Team B wins</p>);
      }
    }
    return (<p>Game not yet played</p>);
  }

  render() {
    return (
      <div>
        <button onClick={() => this.setWinner(TEAM.A)}>Team A</button>
        <button onClick={() => this.setWinner(TEAM.B)}>Team B</button>
        {this.getWinner()}
      </div>
    );
  }
}

class Rounds extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rounds: [[]]
    };
    this.newMatch(0);
    //Create matches and rounds here
  }
  newMatch(round){
    var newrounds = [...this.state.rounds];
    newrounds[round].push(<Match format={MATCHFORMAT.BO3} matchlist={() => this.getStringMatchList()}/>);
    this.setState({
      rounds: newrounds
    })
  }
  delMatch(round, match){
  }
  newRound(){
    var newrounds = [...this.state.rounds];
    newrounds.push([]);
    this.setState({
      rounds: newrounds
    })
  }
  getStringMatchList() {
    var matchlist = [];
    this.state.rounds.forEach(
      (round, key) =>
      round.forEach(
        (match, matchkey) =>
        matchlist.push((key + 1).toString().concat(getLetter(matchkey)))
      )
    )
    return (
      matchlist
    );
  }
  render() {
    return (
      <div className="rounds">
        <div>
          <button onClick={() => this.newRound()}>New Round</button>
        </div>
        <br></br>
        {this.state.rounds.map(
          (round, key) =>
            <div className="round">
              <label>Round {key + 1}</label>
              <br/>
              <div>
                <button onClick={() => this.newMatch(key)}>New Match</button>
              </div>
              {round.map(
                (match, matchkey) =>
                <div>
                  <label>Match {key + 1}{getLetter(matchkey)}</label>
                  {match}
                </div>
                
              )}
            </div>
        )}
        
      </div>
    )
  }
}

//Gets letter from a number
function getLetter(i) {
  return (i >= 26 ? getLetter((i / 26 >> 0) - 1) : '') +  ('abcdefghijklmnopqrstuvwxyz'[i % 26 >> 0]).toLocaleUpperCase();
}


//Make Round class

//var Matches = [<Match format={MATCHFORMAT.BO3}/>];

export default App;
