'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Arbeitsbelastungs-Labyrinth
function ArbeitsbelastungsLabyrinth({ onComplete }) {
  const [path, setPath] = useState([])
  const [currentPosition, setCurrentPosition] = useState(0)
  const [score, setScore] = useState(0)

  useEffect(() => {
    // Generate a random path
    const newPath = Array(10).fill(0).map(() => Math.floor(Math.random() * 3))
    setPath(newPath)
  }, [])

  const handleMove = (direction) => {
    if (direction === path[currentPosition]) {
      setScore(score + 10)
      if (currentPosition === path.length - 1) {
        onComplete(score + 10)
      } else {
        setCurrentPosition(currentPosition + 1)
      }
    } else {
      setScore(Math.max(0, score - 5))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Arbeitsbelastungs-Labyrinth</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Finde den richtigen Weg durch das Labyrinth der Arbeitsbelastung!</p>
        <div className="flex justify-center space-x-4 mt-4">
          <Button onClick={() => handleMove(0)}>Links</Button>
          <Button onClick={() => handleMove(1)}>Geradeaus</Button>
          <Button onClick={() => handleMove(2)}>Rechts</Button>
        </div>
        <Progress value={(currentPosition / path.length) * 100} className="mt-4" />
        <p className="mt-2">Punkte: {score}</p>
      </CardContent>
    </Card>
  )
}

// Verhaltens-Vortex
function VerhaltensVortex({ onComplete }) {
  const [currentBehavior, setCurrentBehavior] = useState('')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)

  const behaviors = [
    { text: 'Schüler stört den Unterricht', correct: 'Ermahnen' },
    { text: 'Schüler hilft Mitschüler', correct: 'Loben' },
    { text: 'Schüler vergisst Hausaufgaben', correct: 'Erinnern' },
    { text: 'Schüler zeigt Verbesserung', correct: 'Ermutigen' },
  ]

  useEffect(() => {
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

    return () => clearInterval(timer)
  }, [score, onComplete])

  useEffect(() => {
    setCurrentBehavior(behaviors[Math.floor(Math.random() * behaviors.length)].text)
  }, [])

  const handleReaction = (reaction) => {
    const correct = behaviors.find(b => b.text === currentBehavior).correct
    if (reaction === correct) {
      setScore(score + 10)
    } else {
      setScore(Math.max(0, score - 5))
    }
    setCurrentBehavior(behaviors[Math.floor(Math.random() * behaviors.length)].text)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verhaltens-Vortex</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Reagiere schnell und angemessen auf das Schülerverhalten!</p>
        <p className="font-bold mt-4">{currentBehavior}</p>
        <div className="flex justify-center space-x-4 mt-4">
          <Button onClick={() => handleReaction('Ermahnen')}>Ermahnen</Button>
          <Button onClick={() => handleReaction('Loben')}>Loben</Button>
          <Button onClick={() => handleReaction('Erinnern')}>Erinnern</Button>
          <Button onClick={() => handleReaction('Ermutigen')}>Ermutigen</Button>
        </div>
        <Progress value={(timeLeft / 30) * 100} className="mt-4" />
        <p className="mt-2">Zeit: {timeLeft}s | Punkte: {score}</p>
      </CardContent>
    </Card>
  )
}

// Admin-Archipel
function AdminArchipel({ onComplete }) {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Noteneingabe', completed: false },
    { id: 2, name: 'Elternbriefe', completed: false },
    { id: 3, name: 'Konferenzprotokoll', completed: false },
    { id: 4, name: 'Klassenfahrt planen', completed: false },
    { id: 5, name: 'Fortbildung beantragen', completed: false },
  ])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1 || tasks.every(t => t.completed)) {
          clearInterval(timer)
          onComplete(score)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [score, tasks, onComplete])

  const handleTaskComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: true } : t))
    setScore(score + 20)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin-Archipel</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Erledige so viele administrative Aufgaben wie möglich!</p>
        <ul className="mt-4">
          {tasks.map(task => (
            <li key={task.id} className="flex justify-between items-center mt-2">
              <span>{task.name}</span>
              <Button onClick={() => handleTaskComplete(task.id)} disabled={task.completed}>
                {task.completed ? 'Erledigt' : 'Erledigen'}
              </Button>
            </li>
          ))}
        </ul>
        <Progress value={(timeLeft / 60) * 100} className="mt-4" />
        <p className="mt-2">Zeit: {timeLeft}s | Punkte: {score}</p>
      </CardContent>
    </Card>
  )
}

// Leaderboard component
function Leaderboard({ scores }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bestenliste</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rang</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Punkte</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scores.map((score, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{score.name}</TableCell>
                <TableCell>{score.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// Main Ressourcen-Rallye component
export default function RessourcenRallye() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [scores, setScores] = useState([])
  const [leaderboard, setLeaderboard] = useState([
    { name: 'Anna M.', score: 280 },
    { name: 'Thomas K.', score: 265 },
    { name: 'Sarah L.', score: 250 },
    { name: 'Michael B.', score: 235 },
    { name: 'Lisa W.', score: 220 },
  ])

  const levels = [
    { name: 'Arbeitsbelastungs-Labyrinth', component: ArbeitsbelastungsLabyrinth },
    { name: 'Verhaltens-Vortex', component: VerhaltensVortex },
    { name: 'Admin-Archipel', component: AdminArchipel },
  ]

  const handleLevelComplete = (score) => {
    setScores([...scores, score])
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1)
    } else {
      const totalScore = scores.reduce((a, b) => a + b, 0) + score
      setLeaderboard([...leaderboard, { name: 'Du', score: totalScore }].sort((a, b) => b.score - a.score).slice(0, 5))
    }
  }

  const CurrentLevelComponent = levels[currentLevel].component

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Ressourcen-Rallye</h1>
      {currentLevel < levels.length ? (
        <CurrentLevelComponent onComplete={handleLevelComplete} />
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Glückwunsch! Du hast alle Level abgeschlossen!</h2>
          <p className="mb-4">Dein Gesamtpunktestand: {scores.reduce((a, b) => a + b, 0)}</p>
        </div>
      )}
      <Leaderboard scores={leaderboard} />
    </div>
  )
}