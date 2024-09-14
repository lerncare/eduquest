'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

// Ideen-Inkubator
function IdeenInkubator({ onComplete }) {
  const [ideas, setIdeas] = useState([])
  const [newIdea, setNewIdea] = useState('')
  const [combinedIdea, setCombinedIdea] = useState('')

  const addIdea = () => {
    if (newIdea.trim()) {
      setIdeas([...ideas, { text: newIdea, votes: 0 }])
      setNewIdea('')
    }
  }

  const voteIdea = (index) => {
    const updatedIdeas = [...ideas]
    updatedIdeas[index].votes += 1
    setIdeas(updatedIdeas)
  }

  const combineIdeas = () => {
    const topIdeas = ideas.sort((a, b) => b.votes - a.votes).slice(0, 2)
    setCombinedIdea(`Kombinierte Idee: ${topIdeas[0].text} + ${topIdeas[1].text}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ideen-Inkubator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newIdea}
              onChange={(e) => setNewIdea(e.target.value)}
              placeholder="Neue Idee eingeben"
            />
            <Button onClick={addIdea}>Hinzufügen</Button>
          </div>
          <div className="space-y-2">
            {ideas.map((idea, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{idea.text}</span>
                <div>
                  <span className="mr-2">Votes: {idea.votes}</span>
                  <Button onClick={() => voteIdea(index)}>+1</Button>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={combineIdeas}>Ideen kombinieren</Button>
          {combinedIdea && <p className="font-bold">{combinedIdea}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

// Mentoring-Maze
function MentoringMaze({ onComplete }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [hint, setHint] = useState('')
  const [isMentor, setIsMentor] = useState(Math.random() < 0.5)

  const maze = [
    ['S', ' ', 'W', ' ', 'E'],
    ['W', ' ', 'W', ' ', ' '],
    [' ', ' ', 'W', 'W', ' '],
    ['W', ' ', ' ', ' ', ' '],
    ['W', 'W', 'W', 'W', 'F']
  ]

  const move = (dx, dy) => {
    const newX = position.x + dx
    const newY = position.y + dy
    if (newX >= 0 && newX < 5 && newY >= 0 && newY < 5 && maze[newY][newX] !== 'W') {
      setPosition({ x: newX, y: newY })
    }
  }

  const giveHint = () => {
    const hints = [
      "Versuche, dich nach rechts zu bewegen.",
      "Der Weg nach unten könnte hilfreich sein.",
      "Manchmal ist der längere Weg der richtige.",
      "Achte auf Sackgassen und vermeide sie."
    ]
    setHint(hints[Math.floor(Math.random() * hints.length)])
  }

  useEffect(() => {
    if (maze[position.y][position.x] === 'F') {
      onComplete()
    }
  }, [position, onComplete])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mentoring-Maze</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>Du bist {isMentor ? 'Mentor' : 'Mentee'}</p>
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
                        : cell === 'F'
                          ? 'bg-green-500'
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
          {isMentor && <Button onClick={giveHint}>Hinweis geben</Button>}
          {!isMentor && hint && <p className="font-bold mt-2">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

// Ressourcen-Roulette
function RessourcenRoulette({ onComplete }) {
  const [resources, setResources] = useState([])
  const [newResource, setNewResource] = useState('')
  const [timer, setTimer] = useState(60)
  const [isExchanging, setIsExchanging] = useState(false)

  useEffect(() => {
    if (isExchanging && timer > 0) {
      const countdown = setInterval(() => {
        setTimer(t => t - 1)
      }, 1000)
      return () => clearInterval(countdown)
    } else if (timer === 0) {
      onComplete()
    }
  }, [isExchanging, timer, onComplete])

  const addResource = () => {
    if (newResource.trim()) {
      setResources([...resources, newResource])
      setNewResource('')
    }
  }

  const startExchange = () => {
    setIsExchanging(true)
  }

  const exchangeResource = (index) => {
    const updatedResources = [...resources]
    updatedResources.splice(index, 1)
    setResources(updatedResources)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ressourcen-Roulette</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!isExchanging ? (
            <>
              <div className="flex space-x-2">
                <Input
                  value={newResource}
                  onChange={(e) => setNewResource(e.target.value)}
                  placeholder="Neue Ressource eingeben"
                />
                <Button onClick={addResource}>Hinzufügen</Button>
              </div>
              <Button onClick={startExchange} disabled={resources.length === 0}>
                Austausch starten
              </Button>
            </>
          ) : (
            <>
              <p>Zeit übrig: {timer} Sekunden</p>
              <div className="space-y-2">
                {resources.map((resource, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{resource}</span>
                    <Button onClick={() => exchangeResource(index)}>Tauschen</Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Reputation System
function ReputationSystem({ reputation }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deine Reputation</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={reputation} max={100} className="w-full" />
        <p className="mt-2 text-center">{reputation} Reputationspunkte</p>
      </CardContent>
    </Card>
  )
}

// Main Netzwerk-Nexus component
export default function NetzwerkNexus() {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [reputation, setReputation] = useState(0)

  const features = [
    { name: 'Ideen-Inkubator', component: IdeenInkubator },
    { name: 'Mentoring-Maze', component: MentoringMaze },
    { name: 'Ressourcen-Roulette', component: RessourcenRoulette },
  ]

  const handleFeatureComplete = () => {
    setReputation(prev => Math.min(100, prev + 20))
    if (currentFeature < features.length - 1) {
      setCurrentFeature(currentFeature + 1)
    }
  }

  const CurrentFeatureComponent = features[currentFeature].component

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Netzwerk-Nexus</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {currentFeature < features.length ? (
            <CurrentFeatureComponent onComplete={handleFeatureComplete} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Glückwunsch!</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Du hast alle Features des Netzwerk-Nexus abgeschlossen!</p>
              </CardContent>
            </Card>
          )}
        </div>
        <div>
          <ReputationSystem reputation={reputation} />
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Teilnehmer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="@user1" />
                  <AvatarFallback>U1</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="@user2" />
                  <AvatarFallback>U2</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="@user3" />
                  <AvatarFallback>U3</AvatarFallback>
                </Avatar>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}