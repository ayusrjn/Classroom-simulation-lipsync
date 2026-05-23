import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Setup
const container = document.getElementById('app')
const scene = new THREE.Scene()
scene.background = new THREE.Color('#1a1a24') // dark atmospheric room
scene.fog = new THREE.FogExp2('#1a1a24', 0.02)

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 5, 12)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
container.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.maxPolarAngle = Math.PI / 2 - 0.1 // don't go below floor
controls.minDistance = 2
controls.maxDistance = 30
controls.target.set(0, 3, 0)

// Lighting
const ambientLight = new THREE.HemisphereLight('#ffffff', '#444455', 0.5)
scene.add(ambientLight)

const sunLight = new THREE.DirectionalLight('#ffddaa', 1.5)
sunLight.position.set(10, 15, 10)
sunLight.castShadow = true
sunLight.shadow.mapSize.width = 2048
sunLight.shadow.mapSize.height = 2048
sunLight.shadow.camera.near = 0.5
sunLight.shadow.camera.far = 50
sunLight.shadow.camera.left = -15
sunLight.shadow.camera.right = 15
sunLight.shadow.camera.top = 15
sunLight.shadow.camera.bottom = -15
sunLight.shadow.bias = -0.0005
scene.add(sunLight)

const fillLight = new THREE.PointLight('#aaeeff', 0.8, 20)
fillLight.position.set(-5, 5, -5)
scene.add(fillLight)

// Materials
const floorMat = new THREE.MeshStandardMaterial({ color: '#333340', roughness: 0.8 })
const wallMat = new THREE.MeshStandardMaterial({ color: '#e0e0e0', roughness: 0.9 })
const deskWoodMat = new THREE.MeshStandardMaterial({ color: '#8b5a2b', roughness: 0.6 })
const deskMetalMat = new THREE.MeshStandardMaterial({ color: '#555555', roughness: 0.4, metalness: 0.6 })
const boardMat = new THREE.MeshStandardMaterial({ color: '#2a3b2c', roughness: 0.9 }) // dark green chalkboard

// Classroom Environment
const room = new THREE.Group()
scene.add(room)

// Floor
const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), floorMat)
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
room.add(floor)

// Walls
const wallGeo = new THREE.PlaneGeometry(40, 15)
const backWall = new THREE.Mesh(wallGeo, wallMat)
backWall.position.set(0, 7.5, -20)
backWall.receiveShadow = true
room.add(backWall)

const leftWall = new THREE.Mesh(wallGeo, wallMat)
leftWall.position.set(-20, 7.5, 0)
leftWall.rotation.y = Math.PI / 2
leftWall.receiveShadow = true
room.add(leftWall)

const rightWall = new THREE.Mesh(wallGeo, wallMat)
rightWall.position.set(20, 7.5, 0)
rightWall.rotation.y = -Math.PI / 2
rightWall.receiveShadow = true
room.add(rightWall)

// Chalkboard
const boardGeo = new THREE.BoxGeometry(20, 7, 0.2)
const board = new THREE.Mesh(boardGeo, boardMat)
board.position.set(0, 6, -19.8)
board.castShadow = true
board.receiveShadow = true
room.add(board)

const boardFrameGeo = new THREE.BoxGeometry(20.4, 7.4, 0.1)
const boardFrame = new THREE.Mesh(boardFrameGeo, deskWoodMat)
boardFrame.position.set(0, 6, -19.9)
room.add(boardFrame)

// Desks Function
function createDesk(x, z) {
  const desk = new THREE.Group()
  
  // Top
  const topGeo = new THREE.BoxGeometry(2.4, 0.1, 1.4)
  const top = new THREE.Mesh(topGeo, deskWoodMat)
  top.position.y = 1.6
  top.castShadow = true
  top.receiveShadow = true
  desk.add(top)
  
  // Legs
  const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.6)
  const positions = [
    [-1.0, 0.8, -0.5], [1.0, 0.8, -0.5],
    [-1.0, 0.8, 0.5], [1.0, 0.8, 0.5]
  ]
  
  positions.forEach(pos => {
    const leg = new THREE.Mesh(legGeo, deskMetalMat)
    leg.position.set(pos[0], pos[1], pos[2])
    leg.castShadow = true
    desk.add(leg)
  })
  
  desk.position.set(x, 0, z)
  return desk
}

// Add student desks
for(let r = 0; r < 4; r++) {
  for(let c = 0; c < 5; c++) {
    // Leave the middle empty for the character
    if (r === 1 && (c === 2)) continue;
    if (r === 2 && (c === 2)) continue;
    
    const x = (c - 2) * 4.5
    const z = (r - 1) * -4.5 - 2
    room.add(createDesk(x, z))
  }
}

// Teacher Desk
const teacherDesk = createDesk(6, -15)
teacherDesk.scale.set(1.5, 1.1, 1.2)
room.add(teacherDesk)

// Character
const character = new THREE.Group()
character.position.set(0, 0, -6.5) // standing in the middle aisle
scene.add(character)

// Character Materials
const skinMat = new THREE.MeshStandardMaterial({ color: '#ffccaa', roughness: 0.4 })
const shirtMat = new THREE.MeshStandardMaterial({ color: '#ff4444', roughness: 0.6 })
const pantsMat = new THREE.MeshStandardMaterial({ color: '#2244aa', roughness: 0.8 })
const eyeMat = new THREE.MeshStandardMaterial({ color: '#111111', roughness: 0.1 })
const scleraMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.2 })
const pupilMat = new THREE.MeshStandardMaterial({ color: '#000000', roughness: 0.1 })
const mouthMat = new THREE.MeshStandardMaterial({ color: '#881111', roughness: 0.5 })
const hairMat = new THREE.MeshStandardMaterial({ color: '#332211', roughness: 0.9 })

// Body
const body = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.5, 1.8), shirtMat)
body.position.y = 2.7
body.castShadow = true
character.add(body)

// Head
const headGroup = new THREE.Group()
headGroup.position.y = 4.0

const headGeo = new THREE.SphereGeometry(0.5, 32, 32)
const head = new THREE.Mesh(headGeo, skinMat)
head.castShadow = true
headGroup.add(head)

// Hair
const hairGeo = new THREE.SphereGeometry(0.52, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.2)
const hair = new THREE.Mesh(hairGeo, hairMat)
hair.castShadow = true
headGroup.add(hair)

// Ears
const earGeo = new THREE.SphereGeometry(0.1, 16, 16)
const leftEar = new THREE.Mesh(earGeo, skinMat)
leftEar.position.set(-0.48, 0, 0)
const rightEar = new THREE.Mesh(earGeo, skinMat)
rightEar.position.set(0.48, 0, 0)
headGroup.add(leftEar, rightEar)

// Nose
const noseGeo = new THREE.SphereGeometry(0.08, 16, 16)
const nose = new THREE.Mesh(noseGeo, skinMat)
nose.position.set(0, 0, 0.48)
nose.scale.set(1, 1.2, 1)
headGroup.add(nose)

// Eyes (Sclera + Pupil)
const scleraGeo = new THREE.SphereGeometry(0.08, 16, 16)
const pupilGeo = new THREE.SphereGeometry(0.04, 16, 16)

const leftEyeGroup = new THREE.Group()
leftEyeGroup.position.set(-0.2, 0.1, 0.42)
const leftSclera = new THREE.Mesh(scleraGeo, scleraMat)
const leftPupil = new THREE.Mesh(pupilGeo, pupilMat)
leftPupil.position.set(0, 0, 0.06) // protruding slightly from sclera
leftEyeGroup.add(leftSclera, leftPupil)

const rightEyeGroup = new THREE.Group()
rightEyeGroup.position.set(0.2, 0.1, 0.42)
const rightSclera = new THREE.Mesh(scleraGeo, scleraMat)
const rightPupil = new THREE.Mesh(pupilGeo, pupilMat)
rightPupil.position.set(0, 0, 0.06) // protruding slightly
rightEyeGroup.add(rightSclera, rightPupil)

headGroup.add(leftEyeGroup, rightEyeGroup)

// Mouth (More visible and realistic)
const mouthGeo = new THREE.TorusGeometry(0.18, 0.05, 8, 20, Math.PI)
const mouth = new THREE.Mesh(mouthGeo, mouthMat)
mouth.position.set(0, -0.15, 0.47)
mouth.rotation.x = Math.PI
headGroup.add(mouth)

character.add(headGroup)

// Arms
const armGeo = new THREE.CylinderGeometry(0.15, 0.12, 1.4)
armGeo.translate(0, -0.6, 0) // move pivot to shoulder

const leftArm = new THREE.Mesh(armGeo, shirtMat)
leftArm.position.set(-0.8, 3.4, 0)
leftArm.rotation.z = 0.2
leftArm.castShadow = true
character.add(leftArm)

const rightArm = new THREE.Mesh(armGeo, shirtMat)
rightArm.position.set(0.8, 3.4, 0)
rightArm.rotation.z = -0.2
rightArm.castShadow = true
character.add(rightArm)

// Legs
const legGeo = new THREE.CylinderGeometry(0.2, 0.15, 1.8)
legGeo.translate(0, -0.9, 0) // move pivot to hip

const leftLeg = new THREE.Mesh(legGeo, pantsMat)
leftLeg.position.set(-0.3, 1.8, 0)
leftLeg.castShadow = true
character.add(leftLeg)

const rightLeg = new THREE.Mesh(legGeo, pantsMat)
rightLeg.position.set(0.3, 1.8, 0)
rightLeg.castShadow = true
character.add(rightLeg)

// --- Audio Setup ---
let analyser = null
let dataArray = null

const micBtn = document.getElementById('mic-btn')
if (micBtn) {
  micBtn.addEventListener('click', async () => {
    if (analyser) return // Already initialized

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const source = audioContext.createMediaStreamSource(stream)
      
      analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      const bufferLength = analyser.frequencyBinCount
      dataArray = new Uint8Array(bufferLength)
      
      source.connect(analyser)
      
      micBtn.textContent = 'Microphone Active'
      micBtn.classList.add('active')
    } catch (err) {
      console.error('Error accessing microphone:', err)
      micBtn.textContent = 'Microphone Error'
    }
  })
}

// Window Resize Handling
window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// Animation Loop
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)
  
  const time = clock.getElapsedTime()
  
  // Idle animation for character
  character.position.y = Math.sin(time * 2) * 0.05
  headGroup.rotation.y = Math.sin(time * 0.5) * 0.2
  headGroup.rotation.x = Math.sin(time * 1.2) * 0.05
  
  // Slight arm movement
  leftArm.rotation.x = Math.sin(time * 2) * 0.1
  rightArm.rotation.x = Math.sin(time * 2 + Math.PI) * 0.1

  // Audio Reactivity (Mouth Movement)
  if (analyser && dataArray) {
    analyser.getByteFrequencyData(dataArray)
    let sum = 0
    for(let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i]
    }
    const avg = sum / dataArray.length
    
    // Map average volume to a scale multiplier (avg is usually 0-100)
    const volume = Math.min(avg / 20, 4) 
    
    // Lerp the scale for smoother movement instead of jittering
    const targetScale = 1 + volume
    mouth.scale.y += (targetScale - mouth.scale.y) * 0.2
    mouth.scale.z = mouth.scale.y // Also scale Z to open it wider if it's rotated
  }

  controls.update()
  renderer.render(scene, camera)
}

animate()
