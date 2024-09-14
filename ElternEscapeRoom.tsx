'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

// Empathie-Enigma
function EmpathieEnigma({ onSolve }) {
  const [currentEmoticon, setCurrentEmoticon] = useState('')
  const [userGuess, setUserGuess] = useState('')
  const [score, setScore] = useState(0)

  const emoticonMeanings = {
    '😊': 'Zufriedenheit',
    '😢': 'Traurigkeit',
    '😠': 'Ärger',
    '😕': 'Verwirrung',
    '🤔': 'Nachdenklichkeit',
  }

  useEffect(() => {
    setCurrentEmoticon(Object.keys(emoticonMeanings)[Math.floor(Math.random() * Object.keys(emoticonMeanings).length)])
  }, [])

  const handleGuess = () => {
    if (userGuess.toLowerCase() === emoticonMeanings[currentEmoticon].toLowerCase()) {
      setScore(score + 1)
      if (score + 1 >= 3) {
        onSolve(score + 1)
      } else {
        setCurrentEmoticon(Object.keys(emoticonMeanings)[Math.floor(Math.random() * Object.keys(emoticonMeanings).length)])
        setUserGuess('')
      }
    } else {
      setScore(Math.max(0, score - 1))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Empathie-Enigma</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-6xl text-center">{currentEmoticon}</p>
          <Input
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            placeholder="Was bedeutet dieses Emoticon?"
          />
          <Button onClick={handleGuess} className="w-full">Überprüfen</Button>
          <p>Punkte: {score}/3</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Feedback-Fabrik
function FeedbackFabrik({ onSolve }) {
  const [currentPhrase, setCurrentPhrase] = useState('')
  const [userPhrase, setUserPhrase] = useState('')
  const [score, setScore] = useState(0)

  const phrasePairs = [
    { negative: 'Ihr Kind ist faul', positive: 'Ihr Kind hat Potenzial zur Verbesserung' },
    { negative: 'Ihr Kind stört ständig', positive: 'Ihr Kind zeigt viel Energie' },
    { negative: 'Ihr Kind ist unaufmerksam', positive: 'Ihr Kind könnte von mehr Fokus profitieren' },
  ]

  useEffect(() => {
    setCurrentPhrase(phrasePairs[Math.floor(Math.random() * phrasePairs.length)].negative)
  }, [])

  const handleSubmit = () => {
    const correctPhrase = phrasePairs.find(pair => pair.negative === currentPhrase)?.positive
    if (userPhrase.toLowerCase() === correctPhrase?.toLowerCase()) {
      setScore(score + 1)
      if (score + 1 >= 3) {
        onSolve(score + 1)
      } else {
        setCurrentPhrase(phrasePairs[Math.floor(Math.random() * phrasePairs.length)].negative)
        setUserPhrase('')
      }
    } else {
      setScore(Math.max(0, score - 1))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback-Fabrik</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>Formuliere positiv: "{currentPhrase}"</p>
          <Textarea
            value={userPhrase}
            onChange={(e) => setUserPhrase(e.target.value)}
            placeholder="Gib hier deine positive Formulierung ein"
          />
          <Button onClick={handleSubmit} className="w-full">Überprüfen</Button>
          <p>Punkte: {score}/3</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Protokoll-Parcours
function ProtokollParcours({ onSolve }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [notes, setNotes] = useState([''])
  const [currentNote, setCurrentNote] = useState('')
  const [foundExit, setFoundExit] = useState(false)

  const maze = [
    ['S', ' ', 'W', ' ', 'N'],
    ['W', ' ', 'W', ' ', ' '],
    [' ', ' ', 'W', 'W', ' '],
    ['W', ' ', ' ', ' ', ' '],
    ['W', 'W', 'W', 'W', 'E']
  ]

  const move = (dx, dy) => {
    const newX = position.x + dx
    const newY = position.y + dy
    if (newX >= 0 && newX < 5 && newY >= 0 && newY < 5 && maze[newY][newX] !== 'W') {
      setPosition({ x: newX, y: newY })
      if (maze[newY][newX] === 'N') {
        setNotes([...notes, ''])
      } else if (maze[newY][newX] === 'E') {
        setFoundExit(true)
      }
    }
  }

  const handleNoteChange = (e) => {
    setCurrentNote(e.target.value)
    const updatedNotes = [...notes]
    updatedNotes[updatedNotes.length - 1] = e.target.value
    setNotes(updatedNotes)
  }

  useEffect(() => {
    if (foundExit && notes.filter(note => note.trim() !== '').length >= 3) {
      onSolve(notes.filter(note => note.trim() !== '').length)
    }
  }, [foundExit, notes, onSolve])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Protokoll-Parcours</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-1">
            {maze.map((row, y) => 
              row.map((cell, x) => (
                <div 
                  key={`${x}-${y}`} 
                  className={`w-8 h-8 border ${
                    x === position.x && y === position.y 
                      ? 'bg-blue-500' 
                      : cell === 'W' 
                        ? 'bg-gray-500' 
                        : cell === 'E'
                          ? 'bg-green-500'
                          : cell === 'N'
                            ? 'bg-yellow-500'
                            : 'bg-white'
                  }`}
                />
              ))
            )}
          </div>
          <div className="flex justify-center space-x-2">
            <Button onClick={() => move(-1, 0)}>←</Button>
            <Button onClick={() => move(1, 0)}>→</Button>
            <Button onClick={() => move(0, -1)}>↑</Button>
            <Button onClick={() => move(0, 1)}>↓</Button>
          </div>
          <Textarea
            value={currentNote}
            onChange={handleNoteChange}
            placeholder="Notizen hier eingeben..."
          />
          <p>Gesammelte Notizen: {notes.filter(note => note.trim() !== '').length}/3</p>
          {foundExit && <p className="font-bold">Ausgang gefunden! Sammle mindestens 3 Notizen, um zu entkommen.</p>}
        </div>
      </CardContent>
    </Card>
  )
}

// Main Eltern-Escape-Room component
export default function ElternEscapeRoom() {
  const [currentPuzzle, setCurrentPuzzle] = useState(0)
  const [timer, setTimer] = useState(600) // 10 minutes
  const [score, setScore] = useState(0)
  const [escaped, setEscaped] = useState(false)

  const puzzles = [
    { name: 'Empathie-Enigma', component: EmpathieEnigma },
    { name: 'Feedback-Fabrik', component: FeedbackFabrik },
    { name: 'Protokoll-Parcours', component: ProtokollParcours },
  ]

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1 || escaped) {
          clearInterval(countdown)
          return 0
        }
        return prevTimer - 1
      })
    }, 1000)

    return () => clearInterval(countdown)
  }, [escaped])

  const handlePuzzleSolved = (puzzleScore) => {
    setScore(score + puzzleScore)
    if (currentPuzzle < puzzles.length - 1) {
      setCurrentPuzzle(currentPuzzle + 1)
    } else {
      setEscaped(true)
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  const CurrentPuzzleComponent = puzzles[currentPuzzle].component

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Eltern-Escape-Room</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {!escaped && timer > 0 ? (
            <CurrentPuzzleComponent onSolve={handlePuzzleSolved} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{escaped ? 'Glückwunsch!' : 'Zeit abgelaufen!'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{escaped ? 'Du bist erfolgreich entkommen!' : 'Leider hast du es nicht geschafft zu entkommen.'}</p>
                <p>Dein Punktestand: {score}</p>
              </CardContent>
            </Card>
          )}
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Escape Room Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>Verbleibende Zeit: {formatTime(timer)}</p>
                <Progress value={(timer / 600) * 100} className="w-full" />
                <p>Aktueller Punktestand: {score}</p>
                <p>Aktuelles Rätsel: {puzzles[currentPuzzle].name}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}