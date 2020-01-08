import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Match format={MATCHFORMAT.BO3}/>
      </header>
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
      games: [<Game onWin={(winner) => this.handleWin(0, winner)}/>]
    };
  }
  handleWin(game, winner) {
    console.log(winner);
    if (winner === TEAM.A){
      this.setState({
        scorea: this.state.scorea + 1,
      })
    }else{
      this.setState({
        scoreb: this.state.scoreb + 1,
      })
    }
    if (this.state.scorea >= this.state.format.victory || this.state.scoreb >= this.state.format.victory){
      console.log("over");
      return (
        <p>Match Over</p>
      );
    }
    else {
      var newgames;
      foreach(item in this.state.games){
        newgames.push(item);
      }
      newgames.push(<Game onWin={(winner) => this.handleWin(this.state.games.length, winner)}/>);
      this.setState({
        games: newgames//this.state.games.push(<Game onWin={(winner) => this.handleWin(this.state.games.length, winner)}/>),
      })
    }
  }
  showGames() {
    if (this.state.showgames){
      return (
        this.state.games.map((item, key) => 
          <div key={key}>
            <h2>Game {key + 1}</h2>
            {item}
          </div>
        )
      );
    }
  }
  render() {
    return (
      <div>
        <h1>Match ({this.state.format.name})</h1>
        <button onClick={() => this.setState({showgames: !this.state.showgames})}>Show/Hide</button>
        {this.showGames()}
      </div>
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
    this.setState({
      winner: winner
    })
    this.props.onWin(winner);
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
