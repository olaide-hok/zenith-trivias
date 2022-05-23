import axios from 'axios'
import React, { useState, useContext } from 'react'

const table = {
  sports: 21,
  history: 23,
  politics: 24,
  vehicle: 28,
  animals: 27,
  mathematics: 19
}

const API_ENDPOINT = 'https://opentdb.com/api.php?'

const AppContext = React.createContext()

const AppProvider = ({ children }) => {

  const [waiting, setWaiting] = useState(true)
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [error, setError] = useState(false)
  const [quiz, setQuiz] = useState({
    amount: 10,
    category: 'sports',
    difficulty: 'easy',
    questionType: 'multiple'
  })

  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchQuestions = async (url) => {
    setLoading(true)
    setWaiting(false)
    const response = await axios.get(url).catch((error) => 
    console.log(error))
    if (response) {
      const data = response.data.results
      if (data.length > 0) {
        setQuestions(data)
        setLoading(false)
        setWaiting(false)
        setError(false)
      } else {
        setWaiting(true)
        setError(true)
      }
    }
    else {
      setWaiting(true)
    }
  }

  const nextQuestion = () => {
    setIndex((oldIndex) => {
      const index = oldIndex + 1
      if (index > questions.length - 1) {
         openModal()
        return 0
      } else {
      return index
      }
    })
  }

  const checkAnswer = (value) => {
    if (value) {
      setCorrect((oldState) => oldState + 1)
    }
    nextQuestion()
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setWaiting(true)
    setCorrect(0)
    setIsModalOpen(false)
  }

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setQuiz({...quiz, [name]: value})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const {amount, category, difficulty, questionType} = quiz

    const url = `${API_ENDPOINT}amount=${amount}&category=${table[category]}&difficulty=${difficulty}&type=${questionType}`
    fetchQuestions(url)
  }

  return <AppContext.Provider value={{
    waiting,
    loading,
    questions,
    error,
    index,
    correct,
    isModalOpen,
    nextQuestion,
    checkAnswer,
    closeModal,
    quiz,
    handleChange,
    handleSubmit

  }}>{children}</AppContext.Provider>
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
