'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Matter from 'matter-js'

// Meditation-Modus
function MeditationModus({ onComplete }) {
  const [pattern, setPattern] = useState([])
  const [userPattern, setUserPattern] = useState([])
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)

  useEffect(() => {
    generatePattern()
  }, [level])

  const generatePattern = () => {
    const newPattern = Array(level + 2).fill(0).map(() => Math.floor(Math.random() * 4))
    setPattern(newPattern)
    setTimeout(() => setPattern([]), 2000 * (level + 1))
  }

  const handleClick = (index) => {
    const newUserPattern = [...userPattern, index]
    setUserPattern(newUserPattern)

    if (newUserPattern.length === pattern.length) {
      if (newUserPattern.every((val, i) => val === pattern[i])) {
        setScore(score + level * 10)
        setLevel(level + 1)
        setUserPattern([])
        if (level === 5) {
          onComplete(score + level * 10)
        } else {
          generatePattern()
        }
      } else {
        setScore(Math.max(0, score - 5))
        setUserPattern([])
        generatePattern()
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meditation-Modus</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Merke dir das Muster und wiederhole es!</p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {[0, 1, 2, 3].map((index) => (
            <Button
              key={index}
              onClick={() => handleClick(index)}
              className={`h-20 ${pattern.includes(index) ? 'bg-primary' : 'bg-secondary'}`}
            />
          ))}
        </div>
        <p className="mt-4">Level: {level} | Punkte: {score}</p>
      </CardContent>
    </Card>
  )
}

// Resilienz-Rätsel
function ResilienzRaetsel({ onComplete }) {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [score, setScore] = useState(0)

  const scenarios = [
    {
      question: "Ein Schüler beschwert sich lautstark über deine Unterrichtsmethoden. Wie reagierst du?",
      answers: [
        { text: "Ignorieren und weitermachen", score: 0 },
        { text: "Den Schüler aus dem Klassenraum schicken", score: 1 },
        { text: "Ruhig bleiben und ein Gespräch nach dem Unterricht anbieten", score: 3 },
        { text: "Die Klasse nach ihrer Meinung fragen", score: 2 }
      ]
    },
    {
      question: "Du erfährst, dass ein Kollege schlecht über dich spricht. Was tust du?",
      answers: [
        { text: "Ihn direkt damit konfrontieren", score: 2 },
        { text: "Es ignorieren und hoffen, dass es aufhört", score: 0 },
        { text: "Mit dem Schulleiter darüber sprechen", score: 1 },
        { text: "Ein ruhiges Gespräch mit dem Kollegen suchen", score: 3 }
      ]
    },
    {
      question: "Eine geplante Schulveranstaltung muss kurzfristig umorganisiert werden. Wie gehst du damit um?",
      answers: [
        { text: "Stress und Überforderung zeigen", score: 0 },
        { text: "Die Veranstaltung absagen", score: 1 },
        { text: "Flexibel bleiben und Alternativen vorschlagen", score: 3 },
        { text: "Die Verantwortung an jemand anderen abgeben", score: 2 }
      ]
    }
  ]

  const handleAnswer = (answerScore) => {
    setScore(score + answerScore)
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1)
    } else {
      onComplete(score + answerScore)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resilienz-Rätsel</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-bold mb-4">{scenarios[currentScenario].question}</p>
        <RadioGroup onValueChange={(value) => handleAnswer(parseInt(value))}>
          {scenarios[currentScenario].answers.map((answer, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={answer.score.toString()} id={`answer-${index}`} />
              <Label htmlFor={`answer-${index}`}>{answer.text}</Label>
            </div>
          ))}
        </RadioGroup>
        <p className="mt-4">Szenario: {currentScenario + 1}/{scenarios.length} | Punkte: {score}</p>
      </CardContent>
    </Card>
  )
}

// Balance-Battle
function BalanceBattle({ onComplete }) {
  const canvasRef = useRef(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)

  useEffect(() => {
    const engine = Matter.Engine.create()
    const render = Matter.Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width: 300,
        height: 400,
        wireframes: false
      }
    })

    const ground = Matter.Bodies.rectangle(150, 395, 300, 10, { isStatic: true })
    const leftWall = Matter.Bodies.rectangle(5, 200, 10, 400, { isStatic: true })
    const rightWall = Matter.Bodies.rectangle(295, 200, 10, 400, { isStatic: true })

    const ball = Matter.Bodies.circle(150, 50, 10, {
      restitution: 0.9,
      render: { fillStyle: '#4CAF50' }
    })

    Matter.World.add(engine.world, [ground, leftWall, rightWall, ball])

    Matter.Runner.run(engine)
    Matter.Render.run(render)

    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        Matter.Body.applyForce(ball, ball.position, { x: -0.005, y: 0 })
      } else if (e.key === 'ArrowRight') {
        Matter.Body.applyForce(ball, ball.position, { x: 0.005, y: 0 })
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onComplete(score)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    const scoreInterval = setInterval(() => {
      setScore((prev) => prev + 1)
    }, 1000)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      Matter.Render.stop(render)
      Matter.World.clear(engine.world)
      Matter.Engine.clear(engine)
      clearInterval(timer)
      clearInterval(scoreInterval)
    }
  }, [onComplete])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance-Battle</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Halte den Ball in der Luft! Benutze die Pfeiltasten ← und →</p>
        <div ref={canvasRef} className="mt-4" />
        <p className="mt-4">Zeit: {timeLeft}s | Punkte: {score}</p>
      </CardContent>
    </Card>
  )
}

// Zen-Level Visualization
function ZenLevelVisualization({ zenLevel }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dein Zen-Level</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={zenLevel} className="w-full" />
        <p className="mt-2 text-center">{zenLevel}% Zen erreicht</p>
      </CardContent>
    </Card>
  )
}

// Main Zen-Zone component
export default function ZenZone() {
  const [currentMode, setCurrentMode] = useState(0)
  const [scores, setScores] = useState([])
  const [zenLevel, setZenLevel] = useState(0)

  const modes = [
    { name: 'Meditation-Modus', component: MeditationModus },
    { name: 'Resilienz-Rätsel', component: ResilienzRaetsel },
    { name: 'Balance-Battle', component: BalanceBattle },
  ]

  const handleModeComplete = (score) => {
    const newScores = [...scores, score]
    setScores(newScores)
    const newZenLevel = Math.min(100, Math.round((newScores.reduce((a, b) => a + b, 0) / (300 * modes.length)) * 100))
    setZenLevel(newZenLevel)

    if (currentMode < modes.length - 1) {
      setCurrentMode(currentMode + 1)
    }
  }

  const CurrentModeComponent = modes[currentMode].component

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Zen-Zone</h1>
      {currentMode < modes.length ? (
        <CurrentModeComponent onComplete={handleModeComplete} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Glückwunsch!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Du hast alle Modi abgeschlossen!</p>
            <p className="mt-2">Gesamtpunktzahl: {scores.reduce((a, b) => a + b, 0)}</p>
          </CardContent>
        </Card>
      )}
      <div className="mt-4">
        <ZenLevelVisualization zenLevel={zenLevel} />
      </div>
    </div>
  )
}