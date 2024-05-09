/* eslint-disable react/prop-types */
import { useContext, createContext, useState, useEffect } from "react";

const AddQueueContext = createContext();
const DeleteQueueContext = createContext();
const GetQuestionsContext = createContext();

export const useAddQuestion = () => {
  return useContext(AddQueueContext);
};
export const useDeleteQuestion = () => {
  return useContext(DeleteQueueContext);
};
export const useGetQuestion = () => {
  return useContext(GetQuestionsContext);
};

export function QuestionQueueProvider({ children }) {
  const [questions, setquestions] = useState([]);

  useEffect(() => {
    getinitialQuestions();
  }, []);
  useEffect(() => {
    setQuestionsLocally();
  }, [questions]);
  function setQuestionsLocally() {
    const questionsLocal = JSON.stringify(questions);
    localStorage.setItem("questions", questionsLocal);
  }
  function addQuestion(question) {
    setquestions((prev) => {
      return [...prev, question];
    });
    alert("Question added");
  }
  function deleteQuestion(id) {
    const newQuestions = questions.filter((item) => {
      if (item.messageId != id) {
        return item;
      }
    });
    setquestions(newQuestions);
    alert("Question deleted");
  }

  function getinitialQuestions() {
    const questions = localStorage.getItem("questions");
    if (questions) {
      setquestions(JSON.parse(questions));
    }
  }
  return (
    <AddQueueContext.Provider value={addQuestion}>
      <DeleteQueueContext.Provider value={deleteQuestion}>
        <GetQuestionsContext.Provider value={questions}>
          {children}
        </GetQuestionsContext.Provider>
      </DeleteQueueContext.Provider>
    </AddQueueContext.Provider>
  );
}
