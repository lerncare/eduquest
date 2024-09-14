'use client'

import { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Html } from '@react-three/drei'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Brain component
function Brain({ onRegionClick }) {
  const brainRef = useRef()

  useFrame((state) => {
    if (brainRef.current) {
      brainRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={brainRef}>
      {/* Main brain shape */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ff9999" />
      </mesh>
      
      {/* Prefrontal Cortex */}
      <Html position={[0.8, 0.5, 0.5]} center>
        <Button 
          onClick={() => onRegionClick('prefrontalCortex')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
        >
          Präfrontaler Cortex
        </Button>
      </Html>
      
      {/* Hippocampus */}
      <Html position={[-0.5, 0, 0.8]} center>
        <Button 
          onClick={() => onRegionClick('hippocampus')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm"
        >
          Hippocampus
        </Button>
      </Html>
      
      {/* Amygdala */}
      <Html position={[0, -0.5, 0.8]} center>
        <Button 
          onClick={() => onRegionClick('amygdala')}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
        >
          Amygdala
        </Button>
      </Html>
    </group>
  )
}

// Mini-game components
function PrefrontalCortexPuzzle({ onComplete }) {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Unterrichtsvorbereitung', priority: 0 },
    { id: 2, text: 'Elterngespräch', priority: 0 },
    { id: 3, text: 'Klassenarbeit korrigieren', priority: 0 },
    { id: 4, text: 'Fortbildung planen', priority: 0 },
  ])

  const handlePriorityChange = (id, change) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, priority: Math.max(0, Math.min(3, task.priority + change)) } : task
    ))
  }

  const handleSubmit = () => {
    const score = tasks.reduce((acc, task) => acc + task.priority, 0) / (tasks.length * 3) * 100
    onComplete(Math.round(score))
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <h2 className="text-xl font-bold">Präfrontaler Cortex-Puzzle</h2>
        <p>Priorisieren Sie die folgenden Aufgaben von 0 (niedrig) bis 3 (hoch):</p>
        {tasks.map(task => (
          <div key={task.id} className="flex items-center justify-between">
            <span>{task.text}</span>
            <div>
              <Button onClick={() => handlePriorityChange(task.id, -1)}>-</Button>
              <span className="mx-2">{task.priority}</span>
              <Button onClick={() => handlePriorityChange(task.id, 1)}>+</Button>
            </div>
          </div>
        ))}
        <Button onClick={handleSubmit} className="w-full">Fertig</Button>
      </CardContent>
    </Card>
  )
}

function HippocampusChallenge({ onComplete }) {
  const [events] = useState([
    { id: 1, text: 'Unterricht 9:00-10:30', time: '9:00' },
    { id: 2, text: 'Pausenaufsicht 10:30-10:45', time: '10:30' },
    { id: 3, text: 'Lehrerkonferenz 13:00-14:00', time: '13:00' },
    { id: 4, text: 'Elterngespräch 15:30-16:00', time: '15:30' },
  ])
  const [currentEvent, setCurrentEvent] = useState(events[0])
  const [score, setScore] = useState(0)

  const handleGuess = (guessedTime) => {
    if (guessedTime === currentEvent.time) {
      setScore(score + 1)
    }
    const nextEvent = events.find(event => event.id > currentEvent.id)
    if (nextEvent) {
      setCurrentEvent(nextEvent)
    } else {
      onComplete(score / events.length * 100)
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <h2 className="text-xl font-bold">Hippocampus-Herausforderung</h2>
        <p>Wählen Sie die korrekte Startzeit für das folgende Ereignis:</p>
        <p className="font-bold">{currentEvent.text}</p>
        <div className="grid grid-cols-2 gap-2">
          {['9:00', '10:30', '13:00', '15:30'].map(time => (
            <Button key={time} onClick={() => handleGuess(time)}>{time}</Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function AmygdalaArena({ onComplete }) {
  const [scenario] = useState({
    text: 'Ein Schüler stört wiederholt den Unterricht.',
    options: [
      { text: 'Den Schüler laut zurechtweisen', score: 0 },
      { text: 'Den Schüler nach der Stunde ansprechen', score: 2 },
      { text: 'Die Klasse in Gruppen aufteilen und dem Schüler eine Aufgabe geben', score: 1 },
    ]
  })

  const handleChoice = (score) => {
    onComplete(score / 2 * 100)
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <h2 className="text-xl font-bold">Amygdala-Arena</h2>
        <p>{scenario.text}</p>
        <p>Wie würden Sie reagieren?</p>
        {scenario.options.map((option, index) => (
          <Button key={index} onClick={() => handleChoice(option.score)} className="block w-full">
            {option.text}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}

function ProgressTracker({ progress }) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <h2 className="text-xl font-bold">Fortschritt</h2>
        <div className="space-y-2">
          <div>
            <span>Präfrontaler Cortex: </span>
            <progress value={progress.prefrontalCortex} max="100" className="w-full" />
          </div>
          <div>
            <span>Hippocampus: </span>
            <progress value={progress.hippocampus} max="100" className="w-full" />
          </div>
          <div>
            <span>Amygdala: </span>
            <progress value={progress.amygdala} max="100" className="w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function MindMaster() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [progress, setProgress] = useState({
    prefrontalCortex: 0,
    hippocampus: 0,
    amygdala: 0,
  })

  const handleRegionClick = (region: string) => {
    setSelectedRegion(region)
  }

  const handleGameComplete = (region: string, score: number) => {
    setProgress(prev => ({
      ...prev,
      [region]: Math.max(prev[region], score),
    }))
    setSelectedRegion(null)
  }

  return (
    <div className="w-full h-screen flex">
      <div className="w-3/4 h-full">
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <Brain onRegionClick={handleRegionClick} />
          <OrbitControls enablePan={false} enableZoom={false} />
          <Environment preset="studio" />
        </Canvas>
      </div>
      <div className="w-1/4 h-full bg-gray-100 p-4 overflow-y-auto">
        {selectedRegion === 'prefrontalCortex' && (
          <PrefrontalCortexPuzzle onComplete={score => handleGameComplete('prefrontalCortex', score)} />
        )}
        {selectedRegion === 'hippocampus' && (
          <HippocampusChallenge onComplete={score => handleGameComplete('hippocampus', score)} />
        )}
        {selectedRegion === 'amygdala' && (
          <AmygdalaArena onComplete={score => handleGameComplete('amygdala', score)} />
        )}
        {!selectedRegion && <ProgressTracker progress={progress} />}
      </div>
    </div>
  )
}