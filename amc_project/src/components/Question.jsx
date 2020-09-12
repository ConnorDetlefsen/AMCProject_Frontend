import React, { Component } from "react";
import AnswerChoice from "./AnswerChoice";
import http from "../APIServices/httpService";
import config from "../APIServices/config.json";

class Question extends Component {
  state = {
    questionList: [],
    correctAnswerList: [],
    answerList: [],

    altQuestionList: [],
    altCorrectAnswerList: [],
    altAnswerList: [],

    currentQuestion: "",
    currentCorrectAnswer: "",
    currentAnswerList: [],

    currentAltQuestion: "",
    currentAltCorrectAnswer: "",
    currentAltAnswerList: [],

    questionCount: 1,
    questionAPI: [], //this has all the data from the api, need to run through this and split it up into question, answers, and correct answer
    altOrNot: false,
  };

  async componentDidMount() {
    //this runs on page start, get request for quiz info
    http.get(config.apiEndpoint + "/question/").then((res) => {
      console.log(res.data);
      this.setState({ questionAPI: res.data });
      for (let x in res.data) {
        this.setState({
          questionList: [
            //this gets array of questions with ids starting at 0
            ...this.state.questionList,
            { id: x, question: res.data[x].question },
          ],
          altQuestionList: [
            //this gets array of questions with ids starting at 0
            ...this.state.altQuestionList,
            { id: x, question: res.data[x].question2 },
          ],
          correctAnswerList: [
            ...this.state.correctAnswerList,
            {
              id: x,
              correctAnswer: res.data[x].answerList.correctAnswer.correctAnswer,
            },
          ],
          altCorrectAnswerList: [
            ...this.state.altCorrectAnswerList,
            {
              id: x,
              correctAnswer:
                res.data[x].answerList2.correctAnswer2.correctAnswer2,
            },
          ],
          answerList: [...this.state.answerList, res.data[x].answerList], //this gets list of answers for each question
          altAnswerList: [...this.state.altAnswerList, res.data[x].answerList2], //this gets list of answers for each question
        });
      } //end of for loop
      //these setStates set the current values for each question
      this.setState({
        currentQuestion: this.state.questionList[0].question,
        currentAltQuestion: this.state.altQuestionList[0].question,
      });
      this.setState({
        currentCorrectAnswer: this.state.correctAnswerList[0].correctAnswer,
        currentAltCorrectAnswer: this.state.altCorrectAnswerList[0]
          .correctAnswer,
        //need two .correctAnswer because big list has correctAnswer: {id: x, correctAnswer : "answer"}
        //so you have to access only the text of 2nd correct answer
      });
      this.setState({
        currentAnswerList: this.state.answerList[0],
        currentAltAnswerList: this.state.altAnswerList[0],
      });
    }); //end of get request
    if (Math.random() >= 0.5) {
      this.setState({ altOrNot: true });
    } else {
      this.setState({ altOrNot: false });
    }
  } // end of on component did mount

  //this handle update updates the current question and the current answer
  handleUpdate = () => {
    this.setState({
      currentQuestion: this.state.questionList[this.state.questionCount]
        .question,
      currentAltQuestion: this.state.altQuestionList[this.state.questionCount]
        .question,
    });
    this.setState({
      currentCorrectAnswer: this.state.correctAnswerList[
        this.state.questionCount
      ].correctAnswer, //need two correct answers again idk why
      currentAltCorrectAnswer: this.state.altCorrectAnswerList[
        this.state.questionCount
      ].correctAnswer, //need two correct answers again idk why
    });
    this.setState({
      currentAnswerList: this.state.answerList[this.state.questionCount],
      currentAltAnswerList: this.state.altAnswerList[this.state.questionCount],
    });
    this.setState({ questionCount: this.state.questionCount + 1 });
    // this.state.questionCount++;
    if (Math.random() >= 0.5) {
      this.setState({ altOrNot: true });
    } else {
      this.setState({ altOrNot: false });
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.state.altOrNot === true && (
          <div>
            <h1>{this.state.currentQuestion}</h1>
            <AnswerChoice label={this.state.currentAnswerList.answer1} />
            <AnswerChoice label={this.state.currentAnswerList.answer2} />
            <AnswerChoice label={this.state.currentAnswerList.answer3} />
            <AnswerChoice label={this.state.currentAnswerList.answer4} />
            <h1>Correct Answer: {this.state.currentCorrectAnswer}</h1>
          </div>
        )}
        {this.state.altOrNot === false && (
          <div>
            <h1>{this.state.currentAltQuestion}</h1>
            <AnswerChoice label={this.state.currentAltAnswerList.answer1} />
            <AnswerChoice label={this.state.currentAltAnswerList.answer2} />
            <AnswerChoice label={this.state.currentAltAnswerList.answer3} />
            <AnswerChoice label={this.state.currentAltAnswerList.answer4} />
            <h1>Correct Answer: {this.state.currentAltCorrectAnswer}</h1>
          </div>
        )}

        <button
          type="button"
          className="btn btn-success"
          onClick={this.handleUpdate}
        >
          Submit
        </button>
      </React.Fragment>
    );
  }
}

export default Question;
