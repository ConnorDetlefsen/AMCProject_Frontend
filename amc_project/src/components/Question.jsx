import React, { Component } from "react";
import http from "../APIServices/httpService";
import config from "../APIServices/config.json";

class Question extends Component {
  constructor() {
    super();
    this.state = {
      questionList: [],
      correctAnswerList: [],
      answerList: [],

      altQuestionList: [],
      altCorrectAnswerList: [],
      altAnswerList: [],

      currentQuestionType: "",
      questionTypeList: [],

      currentQuestion: "",
      currentCorrectAnswer: "",
      currentAnswerList: [],

      currentAltQuestion: "",
      currentAltCorrectAnswer: "",
      currentAltAnswerList: [],

      questionCount: 1,
      questionAPI: [], //this has all the data from the api, need to run through this and split it up into question, answers, and correct answer
      altQuestionIfFalse: false,

      QuizResults: [],
      QuizOver: false,
      test: false,
    };
    this.onValueChange = this.onValueChange.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
  }

  //this changes the selected option to the value of the selected question
  onValueChange(event) {
    this.setState({
      selectedOption: event.target.value,
    });
  }

  //I can probably put this and handleUpdate together, they are both being called when the submit button is clicked
  formSubmit(event) {
    event.preventDefault();
    console.log(this.state.selectedOption);
  }

  async componentDidMount() {
    //this runs on page start, get request for quiz info
    http.get(config.apiEndpoint + "/quizResults/").then((res) => {
      console.log(res.data);
      this.setState({ QuizResults: res.data });
    });
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
            //this gets array of alternate questions with ids starting at 0
            ...this.state.altQuestionList,
            { id: x, question: res.data[x].question2 },
          ],
          //gets array of correct answers
          correctAnswerList: [
            ...this.state.correctAnswerList,
            {
              id: x,
              correctAnswer: res.data[x].answerList.correctAnswer.correctAnswer,
            },
          ],
          //gets array of alternate correct answers
          altCorrectAnswerList: [
            ...this.state.altCorrectAnswerList,
            {
              id: x,
              correctAnswer:
                res.data[x].answerList2.correctAnswer2.correctAnswer2,
            },
          ],
          //gets array of multiple choice options for each question
          answerList: [...this.state.answerList, res.data[x].answerList], //this gets list of answers for each question
          altAnswerList: [...this.state.altAnswerList, res.data[x].answerList2], //this gets list of answers for each question

          questionTypeList: [
            ...this.state.questionTypeList,
            { questionType: res.data[x].questionType },
          ],
        });
        //need seperate setState since this one calls upon the states set in previous setState
        this.setState({
          //set current question type
          currentQuestionType: this.state.questionTypeList[0].questionType,
          //set the current values for each question
          currentQuestion: this.state.questionList[0].question,
          currentAltQuestion: this.state.altQuestionList[0].question,
          //set current correct answers
          currentCorrectAnswer: this.state.correctAnswerList[0].correctAnswer,
          currentAltCorrectAnswer: this.state.altCorrectAnswerList[0]
            .correctAnswer,
          //set the 4 multiple choice options to the first question
          //to save progress we can make it a variable we read in from database instead of 0
          currentAnswerList: this.state.answerList[0],
          currentAltAnswerList: this.state.altAnswerList[0],
        });
      } //end of for loop
    }); //end of get request
    if (Math.random() >= 0.5) {
      this.setState({ altQuestionIfFalse: true });
    } else {
      this.setState({ altQuestionIfFalse: false });
    }
  } // end of on component did mount

  //this handle update updates the current question and the current answer, on submit
  handleMCUpdate = () => {
    if (this.state.questionAPI[this.state.questionCount] === undefined) {
      console.log("end of quiz reached");
      this.setState({ QuizOver: true });
    } else {
      this.setState({
        currentQuestionType: this.state.questionAPI[this.state.questionCount]
          .questionType,
        currentQuestion: this.state.questionList[this.state.questionCount]
          .question,
        currentAltQuestion: this.state.altQuestionList[this.state.questionCount]
          .question,
        currentCorrectAnswer: this.state.correctAnswerList[
          this.state.questionCount
        ].correctAnswer,
        currentAltCorrectAnswer: this.state.altCorrectAnswerList[
          this.state.questionCount
        ].correctAnswer,
        currentAnswerList: this.state.answerList[this.state.questionCount],
        currentAltAnswerList: this.state.altAnswerList[
          this.state.questionCount
        ],
        questionCount: this.state.questionCount + 1,
      });

      //this is where it checks if the answer entered for the current question is correct or wrong
      //need to put api put request here to update user quiz database
      if (this.state.altQuestionIfFalse === true) {
        if (this.state.selectedOption === this.state.currentCorrectAnswer) {
          console.log("correct");
          //this part below sets the question to true if answer is correct
          let questionVar = "question" + this.state.questionCount;
          this.state.QuizResults[0][questionVar] = true;
          http.put(
            config.apiEndpoint + "/quizResults/1/",
            this.state.QuizResults[0]
          );
        } else {
          console.log("wrong");
        }
      } else {
        //if altQuestionIfFalse is false = alternate question
        if (this.state.selectedOption === this.state.currentAltCorrectAnswer) {
          console.log("correct");
          //this part below sets the question to true if answer is correct
          let questionVar = "question" + this.state.questionCount;
          this.state.QuizResults[0][questionVar] = true;
          http.put(
            config.apiEndpoint + "/quizResults/1/",
            this.state.QuizResults[0]
          );
        } else {
          console.log("wrong");
        }
      }
      //random is alt question or not
      if (Math.random() >= 0.5) {
        this.setState({ altQuestionIfFalse: true });
      } else {
        this.setState({ altQuestionIfFalse: false });
      }
    } //end of else
  };

  handleFreeResponse = () => {
    if (this.state.questionAPI[this.state.questionCount] === undefined) {
      console.log("end of quiz reached");
      this.setState({ QuizOver: true });
    } else {
      this.setState({
        currentQuestionType: this.state.questionAPI[this.state.questionCount]
          .questionType,
        currentQuestion: this.state.questionList[this.state.questionCount]
          .question,
        currentAltQuestion: this.state.altQuestionList[this.state.questionCount]
          .question,
        currentCorrectAnswer: this.state.correctAnswerList[
          this.state.questionCount
        ].correctAnswer,
        currentAltCorrectAnswer: this.state.altCorrectAnswerList[
          this.state.questionCount
        ].correctAnswer,
        currentAnswerList: this.state.answerList[this.state.questionCount],
        currentAltAnswerList: this.state.altAnswerList[
          this.state.questionCount
        ],
        questionCount: this.state.questionCount + 1,
      }); //end of setstate
      //random is alt question or not
      if (Math.random() >= 0.5) {
        this.setState({ altQuestionIfFalse: true });
      } else {
        this.setState({ altQuestionIfFalse: false });
      }
    } //end of else

    console.log("free response answered");
  };

  render() {
    return (
      <React.Fragment>
        <div className="background">
          {this.state.altQuestionIfFalse === true &&
            this.state.currentQuestionType === "MC" &&
            this.state.QuizOver !== true && (
              <div>
                <h1 className="center">{this.state.currentQuestion}</h1>
                <form onSubmit={this.formSubmit} class="form">
                  {this.state.currentAnswerList.answer1 !== "" && (
                    <div className="inputGroup">
                      <input
                        type="radio"
                        name="radio"
                        id="radio1"
                        value={this.state.currentAnswerList.answer1}
                        checked={
                          this.state.selectedOption ===
                          this.state.currentAnswerList.answer1
                        }
                        onChange={this.onValueChange}
                      />
                      <label for="radio1">
                        {this.state.currentAnswerList.answer1}
                      </label>
                    </div>
                  )}

                  {this.state.currentAnswerList.answer2 !== "" && (
                    <div className="inputGroup">
                      <input
                        type="radio"
                        name="radio"
                        id="radio2"
                        value={this.state.currentAnswerList.answer2}
                        checked={
                          this.state.selectedOption ===
                          this.state.currentAnswerList.answer2
                        }
                        onChange={this.onValueChange}
                      />
                      <label for="radio2">
                        {this.state.currentAnswerList.answer2}
                      </label>
                    </div>
                  )}
                  {this.state.currentAnswerList.answer3 !== "" && (
                    <div className="inputGroup">
                      <input
                        type="radio"
                        name="radio"
                        id="radio3"
                        value={this.state.currentAnswerList.answer3}
                        checked={
                          this.state.selectedOption ===
                          this.state.currentAnswerList.answer3
                        }
                        onChange={this.onValueChange}
                      />
                      <label for="radio3">
                        {this.state.currentAnswerList.answer3}
                      </label>
                    </div>
                  )}
                  {this.state.currentAnswerList.answer4 !== "" && (
                    <div className="inputGroup">
                      <input
                        type="radio"
                        name="radio"
                        id="radio4"
                        value={this.state.currentAnswerList.answer4}
                        checked={
                          this.state.selectedOption ===
                          this.state.currentAnswerList.answer4
                        }
                        onChange={this.onValueChange}
                      />
                      <label for="radio4">
                        {this.state.currentAnswerList.answer4}
                      </label>
                    </div>
                  )}
                  <h1>
                    <span></span>
                    <button
                      type="submit"
                      className="btn btn-dark float-right"
                      onClick={this.handleMCUpdate}
                    >
                      Submit
                    </button>
                  </h1>
                </form>
                <h1>Selected option is : {this.state.selectedOption}</h1>
                <h1>Correct Answer: {this.state.currentCorrectAnswer}</h1>
                <h1>current question type: {this.state.currentQuestionType}</h1>
              </div>
            )}
          {this.state.altQuestionIfFalse === false &&
            this.state.currentQuestionType === "MC" &&
            this.state.QuizOver !== true && (
              <div>
                <h1 className="center">{this.state.currentAltQuestion}</h1>
                <form onSubmit={this.formSubmit} class="form">
                  {this.state.currentAltAnswerList.answer1 !== "" && (
                    <div className="inputGroup">
                      <input
                        type="radio"
                        name="radio"
                        id="radio1"
                        value={this.state.currentAltAnswerList.answer1}
                        checked={
                          this.state.selectedOption ===
                          this.state.currentAltAnswerList.answer1
                        }
                        onChange={this.onValueChange}
                      />
                      <label for="radio1">
                        {this.state.currentAltAnswerList.answer1}
                      </label>
                    </div>
                  )}
                  {this.state.currentAltAnswerList.answer2 !== "" && (
                    <div className="inputGroup">
                      <input
                        type="radio"
                        name="radio"
                        id="radio2"
                        value={this.state.currentAltAnswerList.answer2}
                        checked={
                          this.state.selectedOption ===
                          this.state.currentAltAnswerList.answer2
                        }
                        onChange={this.onValueChange}
                      />
                      <label for="radio2">
                        {this.state.currentAltAnswerList.answer2}
                      </label>
                    </div>
                  )}
                  {this.state.currentAltAnswerList.answer3 !== "" && (
                    <div className="inputGroup ">
                      <input
                        type="radio"
                        name="radio"
                        id="radio3"
                        value={this.state.currentAltAnswerList.answer3}
                        checked={
                          this.state.selectedOption ===
                          this.state.currentAltAnswerList.answer3
                        }
                        onChange={this.onValueChange}
                      />
                      <label for="radio3">
                        {this.state.currentAltAnswerList.answer3}
                      </label>
                    </div>
                  )}
                  {this.state.currentAltAnswerList.answer4 !== "" && (
                    <div className="inputGroup">
                      <input
                        type="radio"
                        name="radio"
                        id="radio4"
                        value={this.state.currentAltAnswerList.answer4}
                        checked={
                          this.state.selectedOption ===
                          this.state.currentAltAnswerList.answer4
                        }
                        onChange={this.onValueChange}
                      />
                      <label for="radio4">
                        {this.state.currentAltAnswerList.answer4}
                      </label>
                    </div>
                  )}
                  <button
                    type="submit"
                    className="btn btn-dark float-right"
                    onClick={this.handleMCUpdate}
                  >
                    Submit
                  </button>
                </form>
                <h1>Selected option is : {this.state.selectedOption}</h1>
                <h1>Correct Answer: {this.state.currentAltCorrectAnswer}</h1>
                <h1>current question type: {this.state.currentQuestionType}</h1>
              </div>
            )}
          {this.state.currentQuestionType === "FREE" &&
            this.state.altQuestionIfFalse === true &&
            this.state.QuizOver !== true && (
              <div>
                <h1 className="center">{this.state.currentQuestion}</h1>
                <div className="form-group">
                  <textarea
                    className="form-control textarea"
                    id="exampleFormControlTextarea1"
                    rows="3"
                  ></textarea>
                </div>
                <form onSubmit={this.formSubmit}>
                  <button
                    type="submit"
                    className="btn btn-dark float-right"
                    onClick={this.handleFreeResponse}
                  >
                    Submit
                  </button>
                </form>
              </div>
            )}
          {this.state.currentQuestionType === "FREE" &&
            this.state.altQuestionIfFalse === false &&
            this.state.QuizOver !== true && (
              <div>
                <h1 className="center">{this.state.currentAltQuestion}</h1>
                <form onSubmit={this.formSubmit}>
                  <div className="form-group">
                    <textarea
                      className="form-control textarea"
                      id="exampleFormControlTextarea1"
                      rows="3"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-dark float-right"
                    onClick={this.handleFreeResponse}
                  >
                    Submit
                  </button>
                </form>
              </div>
            )}
          {this.state.QuizOver === true && (
            <div>
              <h1>Quiz Completed</h1>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Question;
