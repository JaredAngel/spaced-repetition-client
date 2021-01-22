import React, { Component } from 'react'
import config from '../../config'
import token from '../../services/token-service'
import Result from '../../components/Result/Result'
import './LearningRoute.css'

class LearningRoute extends Component {
  state = {
    word: {},
    guess: '',
    responseData: null,
  }

  async getData() {
    try {
      const response = await fetch(`${config.API_ENDPOINT}/language/head`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `bearer ${token.getAuthToken()}`,
        },
      });
      const data = await response.json();
      this.setState({
        word: data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  guessEntered(e){
    e.preventDefault();
    this.setState({guess: e.target.value})
  }

  async guessData(){
    try {
      const response = await fetch(`${config.API_ENDPOINT}/language/guess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `bearer ${token.getAuthToken()}`,
        },
        body: JSON.stringify({guess: this.state.guess}),
      });
      const data = await response.json();
      this.setState({
        responseData: data,
      })
    } catch (error) {
      console.log(error);
    }
  }

  guessSubmitted(e){
    e.preventDefault();
    this.guessData();
  }
  
  componentDidMount(){
    this.getData();
  }

  goNextWord(){
    
    this.setState({
      word: this.state.responseData,
      responseData: null
    });
  }

  render() {
    return (
      <section>
        {!this.state.responseData &&
        <>
        <h2>Translate the word:</h2>
        <span className='word'>{this.state.word.nextWord}</span>
        <p>Your total score is: {this.state.word.totalScore}</p>
        <form className='Learning_Form' onSubmit={(e) => this.guessSubmitted(e)}>
          <label htmlFor='learn-guess-input'>What's the translation for this word?</label>
          <input id='learn-guess-input' type='text' onChange={e => this.guessEntered(e)} required></input>
          <button type='submit'>Submit your answer</button>
        </form>
        
        <p>You have answered this word correctly {this.state.word.wordCorrectCount} times.</p>
        <p>You have answered this word incorrectly {this.state.word.wordIncorrectCount} times.</p>

        </>
        }
        
        {this.state.responseData
          && 
          <Result 
            data={this.state.responseData} 
            word={this.state.word.nextWord} 
            guess={this.state.guess}
          />
        }
        {this.state.responseData
          &&
          <button onClick={()=>this.goNextWord()}>Try another word!</button>
        }
      </section>
    );
  }
}

export default LearningRoute;