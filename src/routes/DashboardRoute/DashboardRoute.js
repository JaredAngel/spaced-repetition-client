import React, { Component } from 'react';
import token from '../../services/token-service';
import config from '../../config';
import './DashboardRoute.css'

class DashboardRoute extends Component {
  state = {
    language: {},
    words: [],
  };

  async getData() {
    try {
      const response = await fetch(`${config.API_ENDPOINT}/language`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `bearer ${token.getAuthToken()}`,
        },
      });
      const data = await response.json();
      this.setState({
        language: data.language,
        words: data.words,
      });
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <section>
        <h2>Practice some {this.state.language.name}!</h2>

        <p>Total correct answers: {this.state.language.total_score}</p>

        <a href='/learn'>Start practicing</a>

        <h3>Words to practice</h3>

        <div className='words_container'>
        {this.state.words.map((word) => {
          return (
            <li key={word.original}>
              <h4>{word.original}</h4>
              <p>correct answer count: {word.correct_count}</p>
              <p>incorrect answer count: {word.incorrect_count}</p>
            </li>
          );
        })}
        </div>
      </section>
    );
  }
}

export default DashboardRoute;