"use client"

import React, { useEffect, useState, useRef } from "react"
import { Cinzel } from "next/font/google"
const cinzel = Cinzel({ subsets: ["latin"], weight: ["700"] })

const surveyQuestions = [
  {
    id: 1,
    type: "multiple-choice",
    question: "How often do you verify the source of news articles you see online?",
    options: ["Always", "Often", "Sometimes", "Rarely or Never"],
  },
  {
    id: 2,
    type: "multiple-choice",
    question: "Do you agree with the statement: 'Digital footprints matter for future opportunities'?",
    options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"],
  },
  {
    id: 3,
    type: "multiple-choice",
    question: "How confident are you in identifying a phishing email?",
    options: ["Very Confident", "Confident", "Somewhat Confident", "Not Confident"],
  },
  {
    id: 4,
    type: "multiple-choice",
    question: "How often do you review the privacy settings on your social media accounts?",
    options: ["Monthly or more", "Quarterly", "Annually", "Never"],
  },
  {
    id: 5,
    type: "multiple-choice",
    question: "When downloading a new app, do you usually read the permissions it requests?",
    options: ["Always", "Often", "Sometimes", "Rarely or Never"],
  },
  {
    id: 6,
    type: "multiple-choice",
    question: "How concerned are you about your personal data being collected by websites?",
    options: ["Very Concerned", "Moderately Concerned", "Slightly Concerned", "Not Concerned"],
  },
  {
    id: 7,
    type: "multiple-choice",
    question: "Do you use a different, complex password for every important online account?",
    options: ["Yes, for all major accounts", "Yes, for some accounts", "No, I reuse passwords often", "I use a password manager"],
  },
  {
    id: 8,
    type: "multiple-choice",
    question: "If a stranger sends you a friend request on social media, what do you usually do?",
    options: ["Accept immediately", "Check their profile before accepting", "Ignore or delete the request", "Accept if they have mutual friends"],
  },
  {
    id: 9,
    type: "multiple-choice",
    question: "How often do you use two-factor authentication (2FA) for your accounts?",
    options: ["For all accounts that offer it", "For some important accounts", "Rarely", "Never"],
  },
  {
    id: 10,
    type: "text-input",
    question: "In your opinion, what’s the biggest digital safety issue people face today?",
  },
]

function Hero() {
  const [step, setStep] = useState(0)
  const [currentSurveyIndex, setCurrentSurveyIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [Name, setName] = useState("")
  const [Age, setAge] = useState("")
  const songAudioRef = useRef(null)

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 1000)
    const t2 = setTimeout(() => setStep(2), 3000)
    const t3 = setTimeout(() => setStep(4), 6000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  useEffect(() => {
    try {
      const a = new Audio("/happy-message-ping-351298 (1).mp3")
      a.preload = "auto"
      songAudioRef.current = a
    } catch {}
  }, [])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveResult, setSaveResult] = useState(null)
  const [saveError, setSaveError] = useState(null)

  const handleSubmitDetails = () => {
    if (Name && Age) {
      setIsSubmitting(true)
      setTimeout(() => {
        setStep(5)
        setIsSubmitting(false)
      }, 700)
    }
  }

  const handleAnswerSelect = (option) => {
    const qId = surveyQuestions[currentSurveyIndex].id
    setUserAnswers((prev) => ({ ...prev, [qId]: option }))
    setTimeout(goToNextQuestion, 500)
  }

  const handleTextChange = (e) => {
    const qId = surveyQuestions[currentSurveyIndex].id
    setUserAnswers((prev) => ({ ...prev, [qId]: e.target.value }))
  }

  const goToNextQuestion = () => {
    if (currentSurveyIndex < surveyQuestions.length - 1) {
      setCurrentSurveyIndex((i) => i + 1)
    } else {
      setStep(6)
    }
  }

  const currentQuestion = surveyQuestions[currentSurveyIndex]

  const playPing = async () => {
    try {
      const a = songAudioRef.current || new Audio("/happy-message-ping-351298 (1).mp3")
      songAudioRef.current = a
      await a.play()
    } catch {}
  }

  useEffect(() => {
    if (step === 5) playPing()
  }, [currentSurveyIndex, step])

  const handleFinalSubmit = async () => {
    try {
      setIsSaving(true)
      setSaveError(null)
      const params = new URLSearchParams()
      params.set('name', Name)
      params.set('age', Age)
      params.set('answers', encodeURIComponent(JSON.stringify(userAnswers)))
      const url = `/api/saveData?${params.toString()}`  
      const resp = await fetch(url)
      const data = await resp.json().catch(() => null)
      if (!resp.ok) throw new Error(data?.message || `HTTP ${resp.status}`)
      setSaveResult(data)
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    if (step === 6) handleFinalSubmit()
  }, [step])

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-transparent text-white relative overflow-hidden">
      {/* 🔮 Aura and SVG background */}
      <div className="top-aura absolute inset-0 bg-gradient-to-b from-purple-700/30 via-transparent to-transparent blur-3xl" aria-hidden="true" />
      <div className="content-frame pointer-events-none absolute inset-x-0 top-1/3">
        <svg
          className="squiggle-svg w-full"
          viewBox="0 0 1600 360"
          preserveAspectRatio="none"
          role="img"
          aria-hidden="true"
        >
          <path
            d="M 30 80 C 120 10, 260 40, 360 80 C 480 140, 620 40, 760 80 C 900 120, 1040 40, 1180 80 C 1290 110, 1420 70, 1570 110"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 30 260 C 120 320, 260 280, 360 260 C 480 230, 620 300, 760 260 C 900 220, 1040 300, 1180 260 C 1290 230, 1420 270, 1570 230"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* 💬 Lisa Intro */}
      <div className="flex flex-col items-center justify-center z-10">
        <img src="/7e0bcff70452c2eca7f1250938b226c3_w200.webp" className="rotate-90" alt="" />
        <div
          className={`flex flex-col items-center justify-center transition-opacity duration-700 ${
            step < 4 ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
          }`}
        >
          <h2
            className={`text-4xl md:text-6xl ${cinzel.className} font-extrabold mb-4 transition-all duration-700 ${
              step === 1 || step === 2 ? "opacity-100" : "opacity-0"
            }`}
          >
            Hi I am Lisa
          </h2>
          <h3
            className={`text-xl md:text-2xl ${cinzel.className} font-medium text-center transition-all duration-700 ${
              step === 2 ? "opacity-100" : "opacity-0"
            }`}
          >
            I'd like to ask you a few survey questions.
          </h3>
        </div>
      </div>

      {/* 🧍 Name & Age */}
      {step === 4 && (
        <div
          className={`flex flex-col space-y-6 items-center justify-center transition-opacity duration-700 w-full max-w-sm px-4 mt-12 ${
            isSubmitting ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="form-control w-full">
            <input
              className="input input-alt"
              placeholder="What is your Name?"
              required
              type="text"
              value={Name}
              onChange={(e) => setName(e.target.value)}
            />
            <span className="input-border input-border-alt"></span>
          </div>
          <div className="form-control w-full">
            <input
              className="input input-alt"
              placeholder="What is your Age?"
              required
              type="text"
              value={Age}
              onChange={(e) => setAge(e.target.value)}
            />
            <span className="input-border input-border-alt"></span>
          </div>
          <button className="btn-23 mt-4" onClick={handleSubmitDetails} disabled={!Name || !Age || isSubmitting}>
            <span className="text">Next</span>
            <span aria-hidden className="marquee cursor-pointer">Next</span>
          </button>
        </div>
      )}

      {/* 🧩 Survey Questions */}
      {step === 5 && currentQuestion && (
        <div className="flex flex-col space-y-8 items-center justify-center transition-opacity duration-700 w-full max-w-lg px-4 mt-12 opacity-100 z-10">
          <h4 className={`text-2xl ${cinzel.className} font-bold text-center`}>
            {`Question ${currentSurveyIndex + 1} of ${surveyQuestions.length}: ${currentQuestion.question}`}
          </h4>

          {currentQuestion.type === "multiple-choice" && (
            <div className="flex flex-col w-full space-y-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full py-3 px-6 rounded-full border-2 transition-all duration-300 cursor-pointer ${
                    userAnswers[currentQuestion.id] === option
                      ? "bg-white text-black border-white scale-105"
                      : "bg-transparent text-white border-white hover:bg-white/10"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === "text-input" && (
            <div className="form-control w-full">
              <textarea
                className="input input-alt w-full h-32 p-4 resize-none bg-transparent border border-white/50 rounded-lg text-white focus:border-white focus:ring-0"
                placeholder="Type your response here..."
                onChange={handleTextChange}
                value={userAnswers[currentQuestion.id] || ""}
              />
              <button
                onClick={goToNextQuestion}
                className="btn-23 mt-6 w-full cursor-pointer"
                disabled={!userAnswers[currentQuestion.id] || userAnswers[currentQuestion.id].trim() === ""}
              >
                <span className="text">Submit</span>
                <span aria-hidden className="marquee">Submit</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 🎉 Completion */}
      {step === 6 && (
        <div className="flex flex-col space-y-6 items-center justify-center transition-opacity duration-700 w-full max-w-lg px-4 mt-12 opacity-100 z-10">
          <h4 className={`text-4xl ${cinzel.className} font-extrabold text-center`}>Survey Complete!</h4>
          <p className="text-xl text-center">Thank you, {Name || "User"}, for participating!</p>
          <p className={`text-2xl ${cinzel.className} font-bold text-gray-400`}>
            Your responses have been recorded.
          </p>
        </div>
      )}
    </section>
  )
}

export default Hero
