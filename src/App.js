import React from 'react';

import Popup from "reactjs-popup";

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      {//<header className="App-header"></header>
      }
      <Match format={MATCHFORMAT.BO3}/>
      
      
    </div>
  );
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
      winner: undefined
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
  render() {
    return (
      <Popup trigger={
        <button> 
          <div>
            <h1>Team A vs Team B</h1>
            <h1>{this.state.format.name}</h1>
            {this.getWinner()}
          </div>
        </button>
      } position="right center">
        <div>{this.showGames()}</div>
      </Popup>
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
    if (this.state.winner != winner){
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

export default App;
