import React, { useContext, useState } from "react";
import { QuizContext } from "../context/context";
import {
  beginnerQuestions,
  intermediateQuestions,
  advancedQuestions,
} from "../data";
import Button from "./Button";

export default function Quiz() {
  const { level, setLevel, currentQuestion, setCurrentQuestion, score, setScore } =
    useContext(QuizContext);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

  // Pick questions based on level
  const getQuestions = (lvl) => {
    if (lvl === "beginner") return beginnerQuestions;
    if (lvl === "intermediate") return intermediateQuestions;
    if (lvl === "advanced") return advancedQuestions;
    return [];
  };

  const questions = getQuestions(level);

  const handleAnswer = (option) => {
    if (selectedAnswer) return; // prevent multiple clicks
    setSelectedAnswer(option);
    if (option === questions[currentQuestion].answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion === questions.length - 1) {
      if (level === "beginner") {
        setLevel("intermediate");
        setCurrentQuestion(0);
      } else if (level === "intermediate") {
        setLevel("advanced");
        setCurrentQuestion(0);
      } else {
        setQuizFinished(true); // finished advanced level
      }
      setSelectedAnswer(null);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setLevel("beginner");
    setQuizFinished(false);
  };

  // Final screen
  if (quizFinished) {
    return (
      <div className="flex w-full flex-col items-center justify-center mt-20 px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Quiz Finished!
        </h1>
        <p className="text-xl sm:text-2xl text-gray-200 text-center">
          Your final score: {score} /{" "}
          {beginnerQuestions.length +
            intermediateQuestions.length +
            advancedQuestions.length}
        </p>
        <button
          onClick={handleRestart}
          className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 shadow-md"
        >
          Restart
        </button>
      </div>
    );
  }

  // Quiz screen
  return (
    <div className="w-full flex justify-center mt-8 px-4">
      <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[50%] min-h-[500px] border rounded-lg bg-gray-700 p-4 sm:p-6 shadow-lg">
        <h1 className="text-center text-2xl sm:text-4xl font-bold font-serif text-white">
          React Interview Questions
        </h1>

        {/* Level buttons */}
        <div className="flex justify-center flex-wrap gap-3 sm:gap-4 my-4">
          <Button name="beginner" active={level === "beginner"} />
          <Button name="intermediate" active={level === "intermediate"} />
          <Button name="advanced" active={level === "advanced"} />
        </div>

        {questions.length > 0 && currentQuestion < questions.length && (
          <div className="mt-6 flex flex-col items-center">
            <p className="text-lg sm:text-xl font-medium text-center text-white px-2">
              {questions[currentQuestion].question}
            </p>

            {/* Options */}
            <div className="mt-4 flex flex-col gap-3 w-full max-w-md">
              {questions[currentQuestion].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!selectedAnswer}
                  className={`px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 text-sm sm:text-base
                    ${
                      selectedAnswer
                        ? opt === questions[currentQuestion].answer
                          ? "bg-green-500 text-white"
                          : opt === selectedAnswer
                          ? "bg-red-500 text-white"
                          : "bg-blue-500 text-white"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Next / Restart buttons */}
            {currentQuestion === questions.length - 1 ? (
              <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full justify-center">
                <button
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 shadow-md disabled:opacity-50"
                  onClick={handleNext}
                  disabled={!selectedAnswer}
                >
                  {level === "advanced" ? "Finish Quiz" : "Next Level"}
                </button>

                <button
                  onClick={handleRestart}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-md"
                >
                  Restart
                </button>
              </div>
            ) : (
              <button
                className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 shadow-md disabled:opacity-50"
                disabled={!selectedAnswer}
                onClick={handleNext}
              >
                Next Question
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
