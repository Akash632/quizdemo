import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
// You may need to import the necessary components from your UI library (e.g., VCard, VCardTitle, VCardText, VAvatar, VBtn)

function QuizComponent({ router }) {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [previousScores, setPreviousScores] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      const quizId = router.currentRoute._value.params.quiz;

      const q = query(
        collection(getFirestore(), "Spark/Master/QuizQuestions"),
        where("quizId", "==", quizId)
      );
      onSnapshot(q, (querySnapshot) => {
        const fetchedQuestions = [];
        querySnapshot.forEach((doc) => {
          fetchedQuestions.push({
            ...doc.data(),
            responded: false,
            studentAnswer: null,
          });
        });
        setQuestions(fetchedQuestions);
        setSelectedQuestion(fetchedQuestions[0]);
      });

      const q1 = query(
        collection(getFirestore(), "Spark/Master/QuizScores"),
        where("quizId", "==", quizId),
        where("userEmail", "==", localStorage.getItem("email"))
      );
      const scoresSnapshot = await getDocs(q1);
      const fetchedScores = [];
      scoresSnapshot.forEach((score) => { 
        fetchedScores.push({ ...score.data(), id: score.id });
      });
      setPreviousScores(fetchedScores);
    };

    fetchQuizData();
  }, [router]);

  const nextQuestion = () => {
    setIndex(index + 1);
    setSelectedQuestion(questions[index + 1]);
    setSelected(null);
  };

  const selectedAnswer = (ans, stage) => {
    setSelected(stage);
    const updatedQuestions = [...questions];
    updatedQuestions[index].studentAnswer = ans;
    updatedQuestions[index].responded = true;
    setQuestions(updatedQuestions);
  };

  const finishQuiz = async () => {
    let score = 0;
    questions.forEach((q) => {
      if (q.answer === q.studentAnswer) score++;
    });
    await addDoc(collection(getFirestore(), "Spark/Master/QuizScores"), {
      quizId: router.currentRoute._value.params.quiz,
      score,
      takenQuizOn: Date.now(),
      totalQuestions: questions.length,
      userEmail: localStorage.getItem("email"),
    });
    setQuizCompleted(true);
  };

  const getFormattedDate = (date) => {
    const formattedDate = new Date(date * 1000);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const day = formattedDate.getDate();
    const monthIndex = formattedDate.getMonth();
    return String(monthNames[monthIndex]).substring(0, 3) + " " + day;
  };

  return (
    <div className="quizPage">
      {!quizCompleted ? (
        <div>
          {selectedQuestion && (
            <div className="card">
              <h2>Welcome to the Quiz</h2>
              <br />
              <h4>{selectedQuestion.question}</h4>
              <br />
              <p
                className={selected === "One" ? "selected" : "none"}
                onClick={() => selectedAnswer(selectedQuestion.optionA, "One")}
              >
                {selectedQuestion.optionA}
              </p>
              <p
                className={selected === "Two" ? "selected" : "none"}
                onClick={() => selectedAnswer(selectedQuestion.optionB, "Two")}
              >
                {selectedQuestion.optionB}
              </p>
              <p
                className={selected === "Three" ? "selected" : "none"}
                onClick={() =>
                  selectedAnswer(selectedQuestion.optionC, "Three")
                }
              >
                {selectedQuestion.optionC}
              </p>
              <p
                className={selected === "Four" ? "selected" : "none"}
                onClick={() => selectedAnswer(selectedQuestion.optionD, "Four")}
              >
                {selectedQuestion.optionD}
              </p>
              <br />
              <button
                onClick={nextQuestion}
                disabled={
                  !selectedQuestion.responded || index >= questions.length - 1
                }
              >
                Next Question
              </button>
              <button
                onClick={finishQuiz}
                disabled={index !== questions.length - 1}
              >
                Finish Quiz
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>Quiz Completed</p>
        </div>
      )}

      <br />

      {previousScores.length > 0 && (
        <div className="card">
          <h2>Previous Attempts</h2>
          <br />
          <div className="scoresBox">
            {previousScores.map((score, index) => (
              <div
                key={index}
                className="d-flex align-center justify-space-between"
              >
                <div>
                  <div className="d-flex align-center flex-wrap">
                    <span className="text-h5">
                      {score.score} / {score.totalQuestions}
                    </span>
                  </div>
                  <span className="text-body-2">
                    {getFormattedDate(score.takenQuizOn)}
                  </span>
                </div>
                <div>{/* Here you can render the avatar component */}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuizComponent;
