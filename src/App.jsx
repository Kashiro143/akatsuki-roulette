import React, { useState, useEffect, useRef, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB652pqD4OpjOpA5En_6zGaOKCfnKvuPDM",
  authDomain: "akatsuki-roulette.firebaseapp.com",
  projectId: "akatsuki-roulette",
  storageBucket: "akatsuki-roulette.firebasestorage.app",
  messagingSenderId: "29445288629",
  appId: "1:29445288629:web:0cf64daee2421a429084fc",
  measurementId: "G-367NH8MFR8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Synthèse sonore organique et mystique (esprit Akatsuki / sceau de chakra)
const playSound = (type) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    if (type === 'click' || type === 'seal') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } 
    else if (type === 'roulette') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(70 + Math.random() * 15, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.06);
    } 
    else if (type === 'reveal') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(25, audioCtx.currentTime + 0.8);
      
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    }
    else if (type === 'boom') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(90, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(18, audioCtx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.38, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);

      const noise = audioCtx.createOscillator();
      const noiseGain = audioCtx.createGain();
      noise.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);
      noise.type = 'sawtooth';
      noise.frequency.setValueAtTime(200, audioCtx.currentTime);
      noise.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.2);
      noiseGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      noiseGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      noise.start();
      noise.stop(audioCtx.currentTime + 0.2);
    }
  } catch (e) {
    // Audio bloqué par le navigateur
  }
};

// Silhouette de nuage façon Akatsuki (rouge cerclé de noir), purement décorative
const AkatsukiCloud = ({ style }) => (
  <svg viewBox="0 0 100 60" style={style} xmlns="http://www.w3.org/2000/svg">
    <g>
      <ellipse cx="30" cy="36" rx="24" ry="17" fill="#7f1d1d" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="54" cy="24" rx="19" ry="15" fill="#7f1d1d" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="73" cy="37" rx="17" ry="13" fill="#7f1d1d" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="46" cy="42" rx="30" ry="15" fill="#7f1d1d" stroke="#000" strokeWidth="2.5" />
    </g>
  </svg>
);

const questions = [
  {
    id: 1,
    title: "Quelle est ta véritable nature face à la corruption et à la folie de ce monde ?",
    options: [
      { text: "La souffrance est la seule vérité universelle. Je veux imposer la paix par une douleur rédemptrice.", trait: "pain" },
      { text: "Le monde n'est qu'une illusion cruelle et trompeuse. Je souhaite le plonger dans un rêve parfait et éternel.", trait: "illusion" },
      { text: "Tout est vicié et voué au néant. Je dois tout purger par le chaos et la destruction absolue.", trait: "chaos" },
      { text: "Je cherche l'expression suprême. Graver mon existence dans l'éternité par un art absolu et fulgurant.", trait: "art" }
    ]
  },
  {
    id: 2,
    title: "Face à un mur infranchissable ou à un échec, quelle est l'essence de ta réaction ?",
    options: [
      { text: "J'applique une volonté divine et inflexible, convaincu que mon jugement est le seul juste.", trait: "pain" },
      { text: "Je manipule les ficelles dans l'ombre, faisant de mes rivaux les pions aveugles de mes desseins.", trait: "illusion" },
      { text: "Je fonce tête baissée, consumant tout obstacle dans les flammes voraces d'un brasier ardent.", trait: "chaos" },
      { text: "Je prépare chaque détail avec une méticulosité froide, anticipant l'œuvre parfaite.", trait: "art" }
    ]
  },
  {
    id: 3,
    title: "Quel est ton rapport secret au fardeau, au temps et à la mortalité ?",
    options: [
      { text: "Je me sacrifie corps et âme, devenant le vaisseau vide d'une justice qui me dépasse.", trait: "art" },
      { text: "L'immortalité est une nécessité froide pour voir s'accomplir le grand plan de l'Œil de la Lune.", trait: "illusion" },
      { text: "Je refuse toute chaîne. Seule la force brute, la domination et la survie dictent ma loi.", trait: "chaos" },
      { text: "Je porte le poids du péché et de la solitude, consumant ma propre vie pour un idéal supérieur.", trait: "pain" }
    ]
  },
  {
    id: 4,
    title: "Comment perçois-tu les liens qui unissent les êtres vivants ?",
    options: [
      { text: "Les liens engendrent l'attachement, puis la souffrance. Connaître la douleur permet de tout comprendre.", trait: "pain" },
      { text: "Les liens sont des faiblesses pathétiques que l'on doit trancher ou exploiter sans remords.", trait: "illusion" },
      { text: "Les liens n'ont aucune valeur face au pouvoir de détruire et d'écraser ceux qui se dressent.", trait: "chaos" },
      { text: "Un lien se transmet, s'immortalise, quitte à ce que le corps périsse et que l'esprit devienne pantin.", trait: "art" }
    ]
  },
  {
    id: 5,
    title: "Si tu devais laisser une trace indélébile de ton passage dans l'histoire, que serait-elle ?",
    options: [
      { text: "Un cataclysme mémorable qui rappellera à jamais le goût amer de la douleur aux hommes.", trait: "pain" },
      { text: "Une manipulation si subtile que personne n'aura jamais su que je tirais les ficelles de l'humanité.", trait: "illusion" },
      { text: "Un champ de ruines fumantes, car le monde ne mérite que de renaître de ses cendres.", trait: "chaos" },
      { text: "Une œuvre d'art définitive, figée dans le temps, terrifiante de beauté et de perfection.", trait: "art" }
    ]
  },
  {
    id: 6,
    title: "Au fond de ton âme, sous quelle bannière t'apprêtes-tu à prêter serment ?",
    options: [
      { text: "Sous le signe de la Douleur, pour guider les égarés vers le silence éternel.", trait: "pain" },
      { text: "Sous le voile de l'Illusion, pour arracher les mortels à leur triste réalité.", trait: "illusion" },
      { text: "Sous l'étendard du Chaos, pour faire régner la loi du plus fort dans le sang.", trait: "chaos" },
      { text: "Sous le sceau de l'Art et de la Transcendance, pour accomplir le chef-d'œuvre ultime.", trait: "art" }
    ]
  }
];

export default function App() {
  const [step, setStep] = useState('cover');
  const [playerName, setPlayerName] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [availableRings, setAvailableRings] = useState([]);
  const [allRings, setAllRings] = useState([]);
  const [assignedRing, setAssignedRing] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [rollingText, setRollingText] = useState('Recherche dans le flux...');

  const [isQuizFadingIn, setIsQuizFadingIn] = useState(false);
  const [isResultFadingIn, setIsResultFadingIn] = useState(false);
  const [isRouletteFadingIn, setIsRouletteFadingIn] = useState(false);
  const [rouletteCounter, setRouletteCounter] = useState(0);
  const [isRouletteFinalizing, setIsRouletteFinalizing] = useState(false);
  const [isRouletteExiting, setIsRouletteExiting] = useState(false);
  const [isGalleryFadingIn, setIsGalleryFadingIn] = useState(false);
  const [pendingAnswers, setPendingAnswers] = useState([]);
  
  const [selectedGalleryRing, setSelectedGalleryRing] = useState(null); 
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const audioRef = useRef(null);
  
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState(false);
  const [editingRingId, setEditingRingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', kanji: '', owner: '', description: '', history: '' });

  // Rituel de bris du sceau (étape "sealed")
  const [sealProgress, setSealProgress] = useState(0);
  const [isSealBroken, setIsSealBroken] = useState(false);
  const [isSealHolding, setIsSealHolding] = useState(false);
  const sealHoldInterval = useRef(null);
  const sealDecayInterval = useRef(null);
  const sealRumbleRef = useRef(null);

  const fetchRings = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'rings'));
      const ringsList = [];
      const fullList = [];
      querySnapshot.forEach((docSnap) => {
        const data = { id: docSnap.id, ...docSnap.data() };
        fullList.push(data);
        if (!data.assignedTo) ringsList.push(data);
      });
      setAvailableRings(ringsList);
      setAllRings(fullList);
    } catch (e) {
      console.error("Erreur chargement Firestore:", e);
    }
  };

  useEffect(() => {
    fetchRings();
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Yuji+Boku&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true);
      }).catch((e) => {
        console.log("Autoplay bloqué :", e);
        setIsMusicPlaying(false);
      });
    }
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true);
      }).catch((e) => {
        console.log("Lecture audio bloquée :", e);
      });
    }
  };

  const handleOpenNameInput = () => {
    playSound('click');
    if (audioRef.current && !isMusicPlaying) {
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true);
      }).catch(() => {});
    }
    setStep('name-input');
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    playSound('click');
    if (availableRings.length === 0) {
      setStep('finished');
      setTimeout(() => setIsResultFadingIn(true), 50);
    } else {
      setStep('quiz');
      setIsQuizFadingIn(false);
      setTimeout(() => setIsQuizFadingIn(true), 50);
    }
  };

  const startSealRumble = () => {
    if (sealRumbleRef.current) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(42, ctx.currentTime);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      sealRumbleRef.current = { ctx, osc, gain };
    } catch (e) {
      // Audio bloqué par le navigateur
    }
  };

  const updateSealRumble = (progress) => {
    const r = sealRumbleRef.current;
    if (!r) return;
    try {
      const now = r.ctx.currentTime;
      r.osc.frequency.linearRampToValueAtTime(42 + progress * 1.1, now + 0.05);
      r.gain.gain.linearRampToValueAtTime(0.04 + (progress / 100) * 0.09, now + 0.05);
    } catch (e) {
      // ignore
    }
  };

  const stopSealRumble = (immediate) => {
    const r = sealRumbleRef.current;
    if (!r) return;
    try {
      const now = r.ctx.currentTime;
      r.gain.gain.cancelScheduledValues(now);
      r.gain.gain.setValueAtTime(r.gain.gain.value, now);
      r.gain.gain.linearRampToValueAtTime(0.0001, now + (immediate ? 0.15 : 0.4));
      r.osc.stop(now + (immediate ? 0.2 : 0.45));
    } catch (e) {
      // ignore
    }
    sealRumbleRef.current = null;
  };

  const startBreakingSeal = () => {
    if (isSealBroken || sealHoldInterval.current) return;
    if (sealDecayInterval.current) {
      clearInterval(sealDecayInterval.current);
      sealDecayInterval.current = null;
    }
    setIsSealHolding(true);
    startSealRumble();
    sealHoldInterval.current = setInterval(() => {
      setSealProgress((prev) => {
        const next = Math.min(prev + 2.2, 100);
        updateSealRumble(next);
        if (Math.floor(next / 14) > Math.floor(prev / 14)) {
          playSound('seal');
          if (navigator.vibrate) navigator.vibrate(8);
        }
        if (next >= 100) {
          clearInterval(sealHoldInterval.current);
          sealHoldInterval.current = null;
          setIsSealHolding(false);
          setIsSealBroken(true);
          stopSealRumble(true);
          playSound('boom');
          if (navigator.vibrate) navigator.vibrate([25, 30, 55]);
          setTimeout(() => startRoulette(pendingAnswers), 950);
        }
        return next;
      });
    }, 35);
  };

  const stopBreakingSeal = () => {
    if (sealHoldInterval.current) {
      clearInterval(sealHoldInterval.current);
      sealHoldInterval.current = null;
    }
    setIsSealHolding(false);
    if (!isSealBroken) {
      stopSealRumble(false);
      sealDecayInterval.current = setInterval(() => {
        setSealProgress((prev) => {
          const next = Math.max(prev - 3, 0);
          if (next <= 0 && sealDecayInterval.current) {
            clearInterval(sealDecayInterval.current);
            sealDecayInterval.current = null;
          }
          return next;
        });
      }, 30);
    }
  };

  const handleAnswer = (trait) => {
    playSound('click');
    const newAnswers = [...answers, trait];
    setAnswers(newAnswers);
    if (currentQuestion + 1 < questions.length) {
      setIsQuizFadingIn(false);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setIsQuizFadingIn(true);
      }, 200);
    } else {
      setPendingAnswers(newAnswers);
      setIsQuizFadingIn(false);
      setTimeout(() => {
        setSealProgress(0);
        setIsSealBroken(false);
        setIsSealHolding(false);
        setStep('sealed');
      }, 200);
    }
  };

  const openGallery = () => {
    playSound('click');
    setIsGalleryFadingIn(false);
    setStep('gallery-fullscreen');
    setTimeout(() => setIsGalleryFadingIn(true), 50);
  };

  const startRoulette = (finalAnswers) => {
    setStep('roulette');
    setIsRouletteFadingIn(false);
    setRouletteCounter(0);
    setIsRouletteFinalizing(false);
    setIsRouletteExiting(false);
    setTimeout(() => setIsRouletteFadingIn(true), 50);
    setIsRolling(true);

    // Le tirage réel est déterminé dès le départ, pour que la roulette s'arrête pile dessus
    const selected = availableRings[Math.floor(Math.random() * availableRings.length)];

    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      setRouletteCounter(counter);

      if (counter > 30) {
        clearInterval(interval);
        playSound('boom');
        if (navigator.vibrate) navigator.vibrate([20, 25, 40]);
        setRollingText(`${selected.kanji} — ${selected.name}`);
        setIsRouletteFinalizing(true);

        // Laisser le joueur s'imprégner du résultat avant qu'il ne remonte à l'écran suivant
        setTimeout(() => setIsRouletteExiting(true), 1500);
        setTimeout(() => finalizeRingAssignment(finalAnswers, selected), 1900);
      } else {
        playSound('roulette');
        const randomRing = availableRings[Math.floor(Math.random() * availableRings.length)];
        setRollingText(`${randomRing.kanji} — ${randomRing.name}`);
      }
    }, 70);
  };

  const finalizeRingAssignment = (finalAnswers, preSelectedRing) => {
    const traitCounts = finalAnswers.reduce((acc, t) => {
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {});
    
    const dominantTrait = Object.keys(traitCounts).reduce((a, b) => traitCounts[a] > traitCounts[b] ? a : b, 'pain');

    const selected = preSelectedRing || availableRings[Math.floor(Math.random() * availableRings.length)];
    
    setAssignedRing(selected);
    setIsRolling(false);
    setStep('result');
    setIsResultFadingIn(false);
    setTimeout(() => setIsResultFadingIn(true), 50);
    playSound('reveal');

    try {
      const ringRef = doc(db, 'rings', selected.id);
      updateDoc(ringRef, { 
        assignedTo: playerName,
        history: arrayUnion(playerName)
      });
      fetchRings();
    } catch (error) {
      console.error("Erreur attribution:", error);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    playSound('click');
    if (adminPassword === "akatsuki2026") {
      setAdminError(false);
      setStep('admin-dashboard');
    } else {
      setAdminError(true);
    }
  };

  const resetAllRings = async () => {
    if (!window.confirm("Libérer toutes les bagues et effacer l'historique des joueurs ?")) return;
    try {
      for (const ring of allRings) {
        const ringRef = doc(db, 'rings', ring.id);
        await updateDoc(ringRef, { 
          assignedTo: null,
          history: [ring.owner] 
        });
      }
      await fetchRings();
      alert("Toutes les bagues ont été réinitialisées.");
    } catch (error) {
      console.error(error);
    }
  };

  const declareFallenAndRelease = async (ringId, currentHolder) => {
    if (!window.confirm(`Déclarer ${currentHolder || 'le porteur actuel'} déchu/mort ? La bague sera remise en jeu dans la roulette et son nom restera gravé dans le lignage.`)) return;
    playSound('click');
    try {
      const ringRef = doc(db, 'rings', ringId);
      await updateDoc(ringRef, { 
        assignedTo: null 
      });
      await fetchRings();
    } catch (error) {
      console.error("Erreur lors de la destitution:", error);
    }
  };

  // Tracés SVG des fissures du sceau, irradiant depuis le centre (75,75)
  const crackPaths = [
    "M75,75 L68,50 L72,35 L60,18",
    "M75,75 L95,55 L88,38 L100,20",
    "M75,75 L100,80 L120,75 L135,68",
    "M75,75 L100,95 L118,105 L132,120",
    "M75,75 L80,105 L70,120 L78,140",
    "M75,75 L55,100 L45,115 L28,125",
    "M75,75 L50,80 L28,75 L12,80",
    "M75,75 L55,60 L35,55 L18,42",
    "M75,75 L65,90 L45,95 L30,105",
  ];

  // Particules générées au moment de la rupture du sceau (étincelles + éclats)
  const shatterParticles = useMemo(() => {
    if (!isSealBroken) return [];
    return Array.from({ length: 22 }, (_, i) => {
      const angle = (i / 22) * Math.PI * 2 + Math.random() * 0.3;
      const distance = 90 + Math.random() * 90;
      const isShard = i % 3 === 0;
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        delay: Math.random() * 0.15,
        size: isShard ? 7 + Math.random() * 7 : 3 + Math.random() * 4,
        rotate: Math.random() * 360,
        shard: isShard,
      };
    });
  }, [isSealBroken]);

  // Tremblement croissant pendant le maintien de la pression sur le sceau
  const sealJitterX = isSealHolding ? (Math.random() - 0.5) * (sealProgress / 100) * 10 : 0;
  const sealJitterY = isSealHolding ? (Math.random() - 0.5) * (sealProgress / 100) * 10 : 0;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflowX: 'hidden', boxSizing: 'border-box', padding: '30px 20px', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      <audio ref={audioRef} src="pain-theme.mp3" loop />

      {/* Contrôleur audio discret */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(5, 5, 7, 0.85)',
        backdropFilter: 'blur(5px)',
        border: '1px solid rgba(185, 28, 28, 0.3)',
        padding: '6px 12px',
        borderRadius: '20px',
        zIndex: 10
      }}>
        <button 
          onClick={toggleMusic}
          style={{ background: 'none', border: 'none', color: isMusicPlaying ? '#ef4444' : '#52525b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', fontFamily: 'monospace' }}
        >
          {isMusicPlaying ? '♪ [ON]' : '♪ [OFF]'}
        </button>
        <input 
          type="range" min="0" max="1" step="0.05" value={volume} 
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          style={{ width: '50px', accentColor: '#ef4444', cursor: 'pointer' }}
        />
      </div>

      {/* Bouton pour accéder au Cercle des Détenteurs depuis la Cover */}
      {step === 'cover' && (
        <button
          onClick={openGallery}
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            background: 'rgba(153, 27, 27, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            cursor: 'pointer',
            zIndex: 10,
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            gap: '7px'
          }}
        >
          <AkatsukiCloud style={{ width: '16px', height: 'auto' }} />
          Cercle des Détenteurs
        </button>
      )}

      {/* Arrière-plan général */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `linear-gradient(rgba(5, 5, 7, 0.82), rgba(5, 5, 7, 0.96)), url("${import.meta.env.BASE_URL}background.jpg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0
      }}></div>

      {/* Brume mystique ambiante, sur toutes les étapes */}
      <div className="smoke-container">
        <div className="smoke-puff smoke-1"></div>
        <div className="smoke-puff smoke-2"></div>
        <div className="smoke-puff smoke-3"></div>
      </div>

      <div style={{ zIndex: 2 }}></div>

      {/* VUE PLEIN ÉCRAN : ACCORDÉON DES DÉTENTEURS */}
      {step === 'gallery-fullscreen' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 5, 7, 0.98)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexShrink: 0 }}>
            <button 
              onClick={() => { playSound('click'); setStep(assignedRing ? 'result' : (availableRings.length === 0 ? 'finished' : 'cover')); setSelectedGalleryRing(null); }}
              style={{ background: 'transparent', border: 'none', color: '#a1a1aa', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer' }}
            >
              ← Retour
            </button>
            <h2 style={{ color: '#ef4444', fontSize: '18px', fontFamily: '"Yuji Boku", serif', letterSpacing: '3px', margin: 0 }}>
              Cercle des Détenteurs
            </h2>
            <div style={{ width: '120px' }}></div>
          </div>

          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            flex: 1, 
            gap: '8px', 
            width: '100%', 
            height: 'calc(100vh - 70px)',
            overflow: 'hidden'
          }}>
            {allRings.map((ring, index) => {
              const isSelected = selectedGalleryRing?.id === ring.id;
              const isHovered = hoveredIndex === index && !selectedGalleryRing;
              const isFree = !ring.assignedTo;
              
              let flexValue = '1';
              if (selectedGalleryRing) {
                flexValue = isSelected ? '4 0 0%' : '0.4 0 0%';
              } else if (isHovered) {
                flexValue = '1.8 0 0%';
              }

              const activeHolder = ring.assignedTo || ring.owner;

              return (
                <div
                  key={ring.id}
                  onClick={() => { playSound('click'); setSelectedGalleryRing(isSelected ? null : ring); }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    flex: flexValue,
                    height: '100%',
                    background: 'rgba(10, 10, 14, 0.9)',
                    border: `1px solid ${isSelected ? '#ef4444' : isHovered ? 'rgba(239, 68, 68, 0.6)' : isFree ? 'rgba(82, 82, 91, 0.4)' : 'rgba(82, 82, 91, 0.25)'}`,
                    borderStyle: isFree && !isSelected && !isHovered ? 'dashed' : 'solid',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    opacity: isGalleryFadingIn ? 1 : 0,
                    transform: isGalleryFadingIn ? 'translateY(0)' : 'translateY(24px)',
                    transition: `opacity 0.5s ease ${index * 0.04}s, transform 0.5s ease ${index * 0.04}s, flex 0.4s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.4s ease, box-shadow 0.4s ease`,
                    display: 'flex',
                    flexDirection: isSelected ? 'row' : 'column',
                    boxShadow: isSelected ? '0 0 45px rgba(239, 68, 68, 0.45)' : isHovered ? '0 0 20px rgba(239, 68, 68, 0.2)' : 'none'
                  }}
                >
                  {isFree && !isSelected && (
                    <span style={{
                      position: 'absolute', top: '8px', right: '8px', zIndex: 3,
                      background: 'rgba(5, 5, 7, 0.75)', border: '1px solid rgba(161, 161, 170, 0.5)',
                      color: '#a1a1aa', fontSize: '8px', letterSpacing: '1.5px', textTransform: 'uppercase',
                      padding: '3px 7px', borderRadius: '10px', fontFamily: 'monospace',
                      animation: 'freeRingPulse 2.4s ease-in-out infinite'
                    }}>
                      Libre
                    </span>
                  )}

                  <div style={{
                    position: 'relative',
                    width: isSelected ? '45%' : '100%',
                    height: isSelected ? '100%' : '100%',
                    backgroundImage: `url("${import.meta.env.BASE_URL}characters/${ring.id}.jpg"), url("${import.meta.env.BASE_URL}background.jpg")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: isFree && !isSelected ? 'grayscale(0.75) brightness(0.55)' : 'none',
                    transition: 'all 0.4s ease'
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: isSelected 
                        ? 'linear-gradient(to right, transparent, rgba(5,5,7,0.8))'
                        : 'linear-gradient(to top, rgba(5,5,7,0.95) 15%, rgba(5,5,7,0.4))'
                    }}></div>
                    
                    {!isSelected && (
                      <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '0',
                        right: '0',
                        textAlign: 'center',
                        padding: '0 5px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                      }}>
                        <span style={{ color: isFree ? '#a1a1aa' : '#ef4444', fontSize: 'clamp(16px, 2vw, 22px)', fontFamily: '"Yuji Boku", serif', display: 'block', textShadow: isFree ? 'none' : '0 0 10px rgba(239,68,68,0.5)' }}>
                          {ring.kanji}
                        </span>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                          <span style={{ color: isFree ? '#d4d4d8' : '#f4f4f5', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '600', maxWidth: '90%' }}>
                            {activeHolder}
                          </span>
                          {isFree ? (
                            <span style={{ color: '#71717a', fontSize: '9px', fontStyle: 'italic', letterSpacing: '0.5px', opacity: 0.85 }}>
                              En attente d'un porteur
                            </span>
                          ) : (
                            ring.owner && ring.owner !== activeHolder && (
                              <span style={{ color: '#a1a1aa', fontSize: '9px', fontStyle: 'italic', letterSpacing: '0.5px', opacity: 0.85, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90%' }}>
                                {ring.owner}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {isSelected && (
                    <div style={{
                      width: '55%',
                      height: '100%',
                      padding: '30px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      background: 'rgba(8, 8, 12, 0.98)',
                      overflowY: 'auto',
                      boxSizing: 'border-box',
                      borderLeft: '1px solid rgba(239, 68, 68, 0.3)'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                          <span style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '2px' }}>Bague & Kanji</span>
                          <h3 style={{ color: '#ef4444', fontSize: '28px', fontFamily: '"Yuji Boku", serif', margin: '4px 0 0 0' }}>
                            {ring.kanji} — {ring.name}
                          </h3>
                        </div>

                        <div>
                          <span style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '2px' }}>Porteur Actuel</span>
                          <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <p style={{ color: '#f87171', fontSize: '16px', margin: 0, fontWeight: 'bold' }}>
                              👤 {activeHolder}
                            </p>
                            {isFree && (
                              <p style={{ color: '#a1a1aa', fontSize: '11px', fontStyle: 'italic', margin: 0, opacity: 0.9 }}>
                                ⛓️ Bague libre — en attente d'un nouveau porteur
                              </p>
                            )}
                            {ring.owner && ring.owner !== activeHolder && (
                              <p style={{ color: '#a1a1aa', fontSize: '11px', fontStyle: 'italic', margin: 0, opacity: 0.9, letterSpacing: '0.5px' }}>
                                Porteur initial originel : <span style={{ color: '#d4d4d8' }}>{ring.owner}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <span style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase', fontFamily: 'monospace', display: 'block', marginBottom: '8px', letterSpacing: '2px' }}>
                            Lignage & Arbre Généalogique
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {ring.history && ring.history.map((person, idx) => (
                              <div key={idx} style={{ 
                                background: idx === 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(39, 39, 42, 0.4)', 
                                color: idx === 0 ? '#fca5a5' : '#d4d4d8', 
                                borderLeft: `3px solid ${idx === 0 ? '#ef4444' : '#52525b'}`,
                                padding: '8px 12px', 
                                fontSize: '12px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderRadius: '0 4px 4px 0'
                              }}>
                                <span style={{ fontWeight: idx === 0 ? '600' : 'normal' }}>{person}</span>
                                <span style={{ fontSize: '9px', color: '#71717a', fontFamily: 'monospace' }}>
                                  {idx === 0 ? 'Porteur initial' : `Génération ${idx + 1}`}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '2px' }}>Destinée & Description</span>
                          <p style={{ color: '#d4d4d8', fontSize: '13px', lineHeight: '1.5', margin: '6px 0 0 0' }}>
                            {ring.description}
                          </p>
                        </div>
                      </div>

                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedGalleryRing(null); }}
                        style={{ background: '#18181b', color: '#a1a1aa', border: '1px solid #27272a', padding: '8px 16px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', alignSelf: 'flex-start', borderRadius: '4px' }}
                      >
                        ← Refermer l'accordéon
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONTENEUR PRINCIPAL DU SITE */}
      <div style={{ width: '100%', maxWidth: '600px', zIndex: 2, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* ÉTAPE 1 : Cover */}
        {step === 'cover' && (
          <div 
            onClick={handleOpenNameInput}
            style={{ textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%', padding: '40px' }}
          >
            <AkatsukiCloud style={{
              width: 'clamp(90px, 22vw, 130px)', height: 'auto',
              filter: 'drop-shadow(0 0 22px rgba(239, 68, 68, 0.5))',
              animation: 'coverCloudBreathe 4s ease-in-out infinite'
            }} />
            <div style={{ color: '#a1a1aa', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '4px', opacity: 0.8, fontWeight: '500' }}>
              Toucher pour éveiller le rituel
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : Saisie du nom */}
        {step === 'name-input' && (
          <form onSubmit={handleNameSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '30px' }}>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="votre nom..."
              autoFocus
              required
              style={{ 
                width: '100%', 
                background: 'transparent', 
                border: 'none', 
                borderBottom: '2px solid rgba(239, 68, 68, 0.5)', 
                color: '#ef4444', 
                textAlign: 'center', 
                fontSize: 'clamp(38px, 7vw, 64px)', 
                fontFamily: '"Yuji Boku", serif', 
                letterSpacing: '3px',
                outline: 'none', 
                padding: '10px 0',
                textShadow: '0 0 30px rgba(239, 68, 68, 0.8)'
              }}
            />
            <button
              type="submit"
              style={{ background: 'transparent', color: '#a1a1aa', border: 'none', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '3px', cursor: 'pointer', transition: 'color 0.2s', fontWeight: '600' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
              onMouseOut={(e) => e.currentTarget.style.color = '#a1a1aa'}
            >
              [ Entrer dans l'Ombre ]
            </button>
          </form>
        )}

        {/* ÉTAPE 3 : Rituel de bris du sceau */}
        {step === 'sealed' && (
          <div style={{
            textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%',
            transform: isSealHolding ? `translate(${sealJitterX}px, ${sealJitterY}px)` : 'none',
            animation: isSealBroken ? 'sealBreakShake 0.55s ease-out' : 'none'
          }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 style={{ color: '#ef4444', fontSize: '28px', margin: 0, fontFamily: '"Yuji Boku", serif', textShadow: '0 0 20px rgba(239, 68, 68, 0.6)' }}>{playerName}</h3>
              <p style={{ color: '#d4d4d8', fontSize: '13px', maxWidth: '380px', margin: '0 auto', lineHeight: '1.6', fontWeight: '400' }}>
                {isSealBroken
                  ? "Le sceau se brise. Ta véritable nature va être révélée..."
                  : sealProgress > 0
                    ? "Le sceau frémit sous ta volonté. Ne relâche pas..."
                    : "Un sceau interdit retient ton destin. Maintiens ta pression pour le briser."}
              </p>
            </div>

            <div style={{ position: 'relative', width: 'clamp(240px, 70vw, 340px)', aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

              {/* Nuages rouges façon Akatsuki, ambiance décorative */}
              <AkatsukiCloud style={{
                position: 'absolute', top: '-8%', left: '-14%', width: '46%', height: 'auto', opacity: isSealBroken ? 0 : 0.4,
                animation: 'cloudDrift 9s ease-in-out infinite', transition: 'opacity 0.5s ease', filter: 'blur(0.3px)'
              }} />
              <AkatsukiCloud style={{
                position: 'absolute', bottom: '-6%', right: '-16%', width: '40%', height: 'auto', opacity: isSealBroken ? 0 : 0.35,
                animation: 'cloudDrift 11s ease-in-out infinite reverse', transition: 'opacity 0.5s ease', filter: 'blur(0.3px)'
              }} />

              {/* Flash de rupture, plein écran (cœur blanc vers halo rouge) */}
              {isSealBroken && (
                <div style={{
                  position: 'fixed', inset: 0, zIndex: 5, pointerEvents: 'none',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(239,68,68,0.55) 35%, rgba(239,68,68,0) 68%)',
                  animation: 'sealFlash 0.7s ease-out forwards'
                }} />
              )}

              {/* Onde de choc double, expansion rapide */}
              {isSealBroken && (
                <>
                  <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '2px solid rgba(239,68,68,0.85)', animation: 'shockwaveExpand 0.9s ease-out forwards' }} />
                  <div style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '2px solid rgba(252,165,165,0.6)', animation: 'shockwaveExpand 0.9s ease-out 0.12s forwards' }} />
                </>
              )}

              {/* Éclats et étincelles projetés lors de la rupture */}
              {shatterParticles.map((p) => (
                <div key={p.id} style={{
                  position: 'absolute', top: '50%', left: '50%',
                  width: `${p.size}px`,
                  height: p.shard ? `${p.size * 0.35}px` : `${p.size}px`,
                  background: p.shard ? 'linear-gradient(90deg, #fca5a5, #991b1b)' : '#ef4444',
                  borderRadius: p.shard ? '2px' : '50%',
                  boxShadow: '0 0 8px 2px rgba(239,68,68,0.8)',
                  '--tx': `${p.x}px`, '--ty': `${p.y}px`, '--r': `${p.rotate}deg`,
                  animation: `shatterFly 0.9s ease-out ${p.delay}s forwards`,
                  opacity: 0, pointerEvents: 'none'
                }} />
              ))}

              {/* Anneau de runes rotatif, accélère avec la pression */}
              <svg width="100%" height="100%" viewBox="0 0 210 210" style={{
                position: 'absolute',
                opacity: isSealBroken ? 0 : 0.55,
                animation: `sealRotateRing ${8 - (sealProgress / 100) * 6}s linear infinite`,
                transition: 'opacity 0.5s ease'
              }}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <rect key={i} x="103" y="4" width="4" height="14" rx="1" fill="#ef4444" opacity={0.55}
                    transform={`rotate(${(i / 16) * 360} 105 105)`} />
                ))}
              </svg>

              {/* Cercle de progression du maintien */}
              <svg width="85.7%" height="85.7%" viewBox="0 0 180 180" style={{
                position: 'absolute', transform: 'rotate(-90deg)',
                opacity: isSealBroken ? 0 : 1, transition: 'opacity 0.4s ease'
              }}>
                <circle cx="90" cy="90" r="82" fill="none" stroke="#27272a" strokeWidth="2" />
                <circle
                  cx="90" cy="90" r="82" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 82}
                  strokeDashoffset={2 * Math.PI * 82 * (1 - sealProgress / 100)}
                  style={{ filter: 'drop-shadow(0 0 6px rgba(239,68,68,0.8))', transition: 'stroke-dashoffset 0.05s linear' }}
                />
              </svg>

              {/* Sceau central : zone de pression + fissures progressives + kanji imposant */}
              <div
                onMouseDown={startBreakingSeal}
                onMouseUp={stopBreakingSeal}
                onMouseLeave={stopBreakingSeal}
                onTouchStart={(e) => { e.preventDefault(); startBreakingSeal(); }}
                onTouchEnd={stopBreakingSeal}
                style={{
                  width: '71.4%', height: '71.4%', borderRadius: '50%', position: 'relative',
                  background: 'radial-gradient(circle, rgba(24,24,27,0.9) 0%, rgba(10,10,14,0.95) 70%)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: isSealBroken ? 'default' : 'pointer', userSelect: 'none', WebkitTapHighlightColor: 'transparent',
                  transform: isSealBroken ? 'scale(1.5)' : `scale(${1 + sealProgress / 400})`,
                  opacity: isSealBroken ? 0 : 1,
                  transition: isSealBroken ? 'transform 0.65s ease-out, opacity 0.65s ease-out 0.1s' : 'transform 0.1s ease'
                }}
              >
                <svg width="100%" height="100%" viewBox="0 0 150 150" style={{ position: 'absolute', top: 0, left: 0 }}>
                  {crackPaths.map((d, i) => {
                    const threshold = i * 11;
                    const reveal = Math.max(0, Math.min(1, (sealProgress - threshold) / 18));
                    return (
                      <path key={i} d={d} fill="none" stroke="#fca5a5" strokeWidth="1.2"
                        style={{ opacity: reveal, filter: 'drop-shadow(0 0 3px rgba(239,68,68,0.9))' }}
                      />
                    );
                  })}
                </svg>

                <span style={{
                  fontFamily: '"Yuji Boku", serif',
                  fontSize: 'clamp(60px, 17vw, 96px)',
                  color: '#ef4444',
                  lineHeight: 1,
                  textShadow: isSealBroken
                    ? '0 0 45px rgba(255,255,255,0.9), 0 0 80px rgba(239,68,68,0.9)'
                    : undefined,
                  animation: isSealBroken ? 'none' : 'sealPulseCore 2s ease-in-out infinite'
                }}>
                  封
                </span>
              </div>
            </div>

            <span style={{
              color: '#52525b', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'monospace',
              opacity: isSealBroken ? 0 : 1, transition: 'opacity 0.3s ease'
            }}>
              {sealProgress < 100 ? 'Presser et maintenir' : 'Sceau rompu'}
            </span>
          </div>
        )}

        {/* ÉTAPE 4 : Questionnaire (Immersif & Étendu) */}
        {step === 'quiz' && (
          <div style={{ 
            width: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center', 
            gap: '25px',
            opacity: isQuizFadingIn ? 1 : 0,
            transform: isQuizFadingIn ? 'translateY(0)' : 'translateY(15px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ color: '#71717a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '3px', fontFamily: 'monospace' }}>
                Épreuve spirituelle {currentQuestion + 1} / {questions.length}
              </span>
              <span style={{ color: '#ef4444', fontSize: '16px', fontFamily: '"Yuji Boku", serif', textShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}>
                {playerName}
              </span>
            </div>

            <h2 style={{ color: '#f4f4f5', fontSize: 'clamp(18px, 3.5vw, 23px)', fontWeight: '400', margin: 0, lineHeight: '1.4', maxWidth: '520px' }}>
              {questions[currentQuestion].title}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '500px' }}>
              {questions[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option.trait)}
                  style={{ 
                    textAlign: 'center', 
                    background: 'transparent', 
                    border: 'none', 
                    borderBottom: '1px solid rgba(82, 82, 91, 0.4)', 
                    color: '#d4d4d8', 
                    padding: '12px 10px', 
                    fontSize: '13px', 
                    cursor: 'pointer', 
                    transition: 'all 0.3s ease', 
                    lineHeight: '1.4',
                    fontWeight: '400',
                    outline: 'none'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#ef4444';
                    e.currentTarget.style.borderColor = '#ef4444';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = '#d4d4d8';
                    e.currentTarget.style.borderColor = 'rgba(82, 82, 91, 0.4)';
                  }}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ÉTAPE 5 : Roulette */}
        {step === 'roulette' && (
          <div style={{ 
            width: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center', 
            gap: '30px',
            opacity: isRouletteFadingIn ? 1 : 0,
            transform: isRouletteFadingIn ? 'translateY(0)' : 'translateY(15px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ color: '#71717a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '3px', fontFamily: 'monospace' }}>
                Résonance Spirituelle
              </span>
              <h2 style={{ color: '#e4e4e7', fontSize: '20px', fontWeight: '400', margin: 0, opacity: isRouletteExiting ? 0 : 1, transition: 'opacity 0.4s ease' }}>
                {isRouletteFinalizing ? 'Le sceau a choisi...' : 'Le destin des bagues se scelle...'}
              </h2>
            </div>

            <div style={{ position: 'relative', width: 'clamp(220px, 60vw, 300px)', aspectRatio: '1 / 1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

              {/* Flash de verdict quand la roulette s'arrête */}
              {isRouletteFinalizing && (
                <div style={{
                  position: 'fixed', inset: 0, zIndex: 5, pointerEvents: 'none',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(239,68,68,0.5) 35%, rgba(239,68,68,0) 68%)',
                  animation: 'sealFlash 0.55s ease-out forwards'
                }} />
              )}

              {/* Anneau de runes, accélère à mesure que le tirage progresse */}
              <svg width="100%" height="100%" viewBox="0 0 210 210" style={{
                position: 'absolute',
                opacity: isRouletteFinalizing ? 0 : 0.55,
                animation: `sealRotateRing ${Math.max(2.5 - (rouletteCounter / 30) * 1.8, 0.7)}s linear infinite`,
                transition: 'opacity 0.4s ease'
              }}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <rect key={i} x="103" y="4" width="4" height="14" rx="1" fill="#ef4444" opacity={0.55}
                    transform={`rotate(${(i / 16) * 360} 105 105)`} />
                ))}
              </svg>

              {/* Cercle qui se referme à mesure qu'on approche du verdict */}
              <svg width="80%" height="80%" viewBox="0 0 180 180" style={{ position: 'absolute', transform: 'rotate(-90deg)', opacity: isRouletteExiting ? 0 : 1, transition: 'opacity 0.4s ease' }}>
                <circle cx="90" cy="90" r="82" fill="none" stroke="#27272a" strokeWidth="2" />
                <circle
                  cx="90" cy="90" r="82" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 82}
                  strokeDashoffset={2 * Math.PI * 82 * (1 - Math.min(rouletteCounter / 30, 1))}
                  style={{ filter: 'drop-shadow(0 0 6px rgba(239,68,68,0.8))', transition: 'stroke-dashoffset 0.06s linear' }}
                />
              </svg>

              <div key={rollingText} style={{
                color: '#ef4444',
                fontSize: isRouletteFinalizing ? 'clamp(26px, 5.5vw, 38px)' : 'clamp(20px, 4.2vw, 30px)',
                fontFamily: '"Yuji Boku", serif',
                padding: '0 12px', textShadow: '0 0 25px rgba(239, 68, 68, 0.7)',
                animation: isRouletteFinalizing ? 'none' : 'rouletteTextFlicker 0.12s ease-out',
                transform: isRouletteExiting ? 'translateY(-46px) scale(1.05)' : (isRouletteFinalizing ? 'scale(1.15)' : 'scale(1)'),
                opacity: isRouletteExiting ? 0 : 1,
                transition: 'transform 0.4s ease-in, opacity 0.4s ease-in, font-size 0.3s ease-out'
              }}>
                {rollingText}
              </div>
            </div>

            <span style={{ color: '#52525b', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
              {playerName}
            </span>
          </div>
        )}

        {/* ÉTAPE 6 : Résultat */}
        {step === 'result' && assignedRing && (
          <div style={{ 
            width: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center', 
            gap: '25px',
            opacity: isResultFadingIn ? 1 : 0,
            transform: isResultFadingIn ? 'translateY(0)' : 'translateY(15px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative' }}>
              <span style={{ color: '#71717a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '3px', fontFamily: 'monospace' }}>
                Bague Attribuée
              </span>

              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  position: 'absolute', width: '220px', height: '220px', borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(239,68,68,0.35) 0%, rgba(239,68,68,0) 70%)',
                  animation: 'resultBurst 1s ease-out', pointerEvents: 'none'
                }} />
                <AkatsukiCloud style={{
                  position: 'absolute', top: '-30px', left: '-45px', width: '60px', height: 'auto',
                  opacity: 0.3, animation: 'cloudDrift 10s ease-in-out infinite'
                }} />
                <AkatsukiCloud style={{
                  position: 'absolute', bottom: '-24px', right: '-50px', width: '55px', height: 'auto',
                  opacity: 0.28, animation: 'cloudDrift 12s ease-in-out infinite reverse'
                }} />
                <h2 style={{
                  color: '#ef4444', fontSize: 'clamp(28px, 6vw, 42px)', fontFamily: '"Yuji Boku", serif', margin: 0,
                  textShadow: '0 0 20px rgba(239, 68, 68, 0.6)', position: 'relative',
                  animation: 'resultKanjiReveal 0.9s ease-out'
                }}>
                  {assignedRing.kanji} — {assignedRing.name}
                </h2>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '480px', width: '100%' }}>
              <div style={{ borderBottom: '1px solid rgba(82, 82, 91, 0.3)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase', fontFamily: 'monospace', display: 'block', letterSpacing: '2px' }}>Position & Porteur</span>
                <p style={{ color: '#e4e4e7', fontSize: '14px', margin: '4px 0 0 0', fontWeight: '400' }}>
                  {assignedRing.finger} — <span style={{ color: '#f87171' }}>{assignedRing.owner}</span>
                </p>
              </div>

              <div style={{ borderBottom: '1px solid rgba(82, 82, 91, 0.3)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase', fontFamily: 'monospace', display: 'block', letterSpacing: '2px' }}>Lignage des Porteurs</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px', marginTop: '6px' }}>
                  {assignedRing.history && assignedRing.history.map((person, idx) => (
                    <span key={idx} style={{ 
                      background: idx === 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(82, 82, 91, 0.25)', 
                      color: idx === 0 ? '#fca5a5' : '#e4e4e7', 
                      border: `1px solid ${idx === 0 ? '#ef4444' : '#52525b'}`,
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      fontSize: '11px' 
                    }}>
                      {idx === 0 ? person : `👤 ${person}`}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '10px', color: '#71717a', textTransform: 'uppercase', fontFamily: 'monospace', display: 'block', letterSpacing: '2px' }}>Fardeau & Destinée</span>
                <p style={{ color: '#d4d4d8', fontSize: '13px', lineHeight: '1.5', margin: '6px 0 0 0', fontWeight: '400' }}>
                  {assignedRing.description}
                </p>
              </div>
            </div>

            <button
              onClick={openGallery}
              style={{
                background: 'rgba(153, 27, 27, 0.3)',
                border: '1px solid rgba(239, 68, 68, 0.6)',
                color: '#fca5a5',
                padding: '10px 24px',
                borderRadius: '4px',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '5px'
              }}
            >
              Regarder le Cercle des Détenteurs 💍
            </button>

            <p style={{ color: '#71717a', fontSize: '12px', fontStyle: 'italic', margin: '5px 0 0 0', letterSpacing: '1px' }}>
              « Votre âme appartient désormais aux ténèbres, {playerName}. »
            </p>
          </div>
        )}

        {/* ÉTAPE : Fini (plus de bague disponible) */}
        {step === 'finished' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '20px' }}>
            <h2 style={{ color: '#ef4444', fontSize: '24px', margin: 0, fontFamily: '"Yuji Boku", serif', letterSpacing: '2px' }}>Cercle Complet</h2>
            <p style={{ color: '#d4d4d8', fontSize: '14px', margin: 0, lineHeight: '1.6', maxWidth: '420px' }}>
              Toutes les bagues ont trouvé preneur. Le plan de l'Œil de la Lune est en marche.
            </p>
            
            <button
              onClick={openGallery}
              style={{
                background: 'rgba(153, 27, 27, 0.3)',
                border: '1px solid rgba(239, 68, 68, 0.6)',
                color: '#fca5a5',
                padding: '10px 24px',
                borderRadius: '4px',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '10px'
              }}
            >
              Regarder le Cercle des Détenteurs 💍
            </button>
          </div>
        )}

        {/* ÉTAPE : Login Admin */}
        {step === 'admin-login' && (
          <form onSubmit={handleAdminLogin} style={{ background: 'rgba(10, 10, 14, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid #27272a', borderRadius: '12px', padding: '35px 25px', display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            <h2 style={{ color: '#ef4444', fontSize: '14px', textTransform: 'uppercase', textAlign: 'center', margin: 0, letterSpacing: '1px' }}>Accès Leader</h2>
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontFamily: 'monospace', color: '#a1a1aa', marginBottom: '6px', textTransform: 'uppercase' }}>Mot de passe</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                style={{ fontFamily: 'monospace', width: '100%', background: '#050507', border: '1px solid #27272a', padding: '8px', color: '#fff', borderRadius: '4px' }}
              />
              {adminError && <p style={{ color: '#ef4444', fontSize: '11px', margin: '4px 0 0 0' }}>Accès refusé.</p>}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" onClick={() => setStep('cover')} style={{ width: '50%', background: '#18181b', color: '#fff', border: '1px solid #27272a', padding: '10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', cursor: 'pointer' }}>Retour</button>
              <button type="submit" style={{ width: '50%', background: '#991b1b', color: '#fff', border: '1px solid #ef4444', padding: '10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', cursor: 'pointer' }}>Valider</button>
            </div>
          </form>
        )}

        {/* ÉTAPE : Dashboard Admin */}
        {step === 'admin-dashboard' && (
          <div style={{ background: 'rgba(10, 10, 14, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid #27272a', borderRadius: '12px', padding: '25px', display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '520px', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#ef4444', fontSize: '14px', textTransform: 'uppercase', margin: 0, letterSpacing: '1px' }}>Panneau de Contrôle</h2>
              <button onClick={() => setStep('cover')} style={{ background: 'none', border: 'none', color: '#a1a1aa', fontSize: '11px', textDecoration: 'underline', cursor: 'pointer' }}>Quitter</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '360px', overflowY: 'auto', paddingRight: '4px' }}>
              {allRings.map((ring) => (
                <div key={ring.id} style={{ background: '#050507', padding: '12px', borderRadius: '6px', border: '1px solid #1f1f23', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {editingRingId === ring.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input type="text" value={editForm.kanji} onChange={(e) => setEditForm({...editForm, kanji: e.target.value})} placeholder="Kanji" style={{ width: '25%', padding: '6px', fontSize: '11px', background: '#0a0a0c', color: '#fff', border: '1px solid #27272a', borderRadius: '4px' }} />
                        <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} placeholder="Nom" style={{ width: '75%', padding: '6px', fontSize: '11px', background: '#0a0a0c', color: '#fff', border: '1px solid #27272a', borderRadius: '4px' }} />
                      </div>
                      <input type="text" value={editForm.owner} onChange={(e) => setEditForm({...editForm, owner: e.target.value})} placeholder="Porteur originel" style={{ padding: '6px', fontSize: '11px', background: '#0a0a0c', color: '#fff', border: '1px solid #27272a', borderRadius: '4px' }} />
                      
                      <div>
                        <label style={{ fontSize: '9px', color: '#a1a1aa', display: 'block', marginBottom: '3px', textTransform: 'uppercase', fontFamily: 'monospace' }}>Lignage (séparé par des virgules)</label>
                        <input 
                          type="text" 
                          value={editForm.history} 
                          onChange={(e) => setEditForm({...editForm, history: e.target.value})} 
                          placeholder="Kisame, Joueur1, Joueur2..." 
                          style={{ width: '100%', padding: '6px', fontSize: '11px', background: '#0a0a0c', color: '#fff', border: '1px solid #27272a', borderRadius: '4px' }} 
                        />
                      </div>

                      <textarea value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} placeholder="Description" style={{ padding: '6px', fontSize: '11px', background: '#0a0a0c', color: '#fff', border: '1px solid #27272a', borderRadius: '4px', resize: 'vertical', minHeight: '50px' }} />
                      
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        <button onClick={() => setEditingRingId(null)} style={{ background: '#27272a', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}>Annuler</button>
                        <button onClick={async () => {
                          try {
                            const ringRef = doc(db, 'rings', ring.id);
                            const historyArray = editForm.history.split(',').map(item => item.trim()).filter(Boolean);
                            
                            await updateDoc(ringRef, { 
                              name: editForm.name, 
                              kanji: editForm.kanji, 
                              owner: editForm.owner, 
                              description: editForm.description,
                              history: historyArray.length > 0 ? historyArray : [editForm.owner]
                            });
                            setEditingRingId(null);
                            await fetchRings();
                          } catch (err) { console.error(err); }
                        }} style={{ background: '#991b1b', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Sauvegarder</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxWidth: '65%' }}>
                        <span style={{ fontWeight: '600', color: '#f87171', fontSize: '13px' }}>{ring.kanji} {ring.name}</span>
                        <span style={{ color: '#a1a1aa', fontSize: '10px' }}>Porteur initial : <span style={{ color: '#e4e4e7' }}>{ring.owner}</span></span>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '3px' }}>
                          <span style={{ fontSize: '9px', color: '#71717a', alignSelf: 'center' }}>Lignage :</span>
                          {ring.history && ring.history.map((h, i) => (
                            <span key={i} style={{ background: '#18181b', color: i === 0 ? '#fca5a5' : '#d4d4d8', padding: '1px 5px', borderRadius: '3px', fontSize: '9px', border: '1px solid #27272a' }}>
                              {h}
                            </span>
                          ))}
                        </div>

                        {ring.assignedTo ? (
                          <span style={{ marginTop: '3px', background: 'rgba(153, 27, 27, 0.25)', color: '#fca5a5', padding: '2px 6px', borderRadius: '4px', border: '1px solid #7f1d1d', fontSize: '10px', width: 'fit-content' }}>
                            Porté par : {ring.assignedTo}
                          </span>
                        ) : (
                          <span style={{ marginTop: '3px', color: '#71717a', fontSize: '10px', fontStyle: 'italic' }}>
                            [ Bague libre / en attente ]
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                        <button onClick={() => {
                          setEditingRingId(ring.id);
                          setEditForm({ 
                            name: ring.name || '', 
                            kanji: ring.kanji || '', 
                            owner: ring.owner || '', 
                            description: ring.description || '', 
                            history: ring.history ? ring.history.join(', ') : '' 
                          });
                        }} style={{ background: '#18181b', color: '#e4e4e7', border: '1px solid #27272a', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}>Modifier</button>
                        
                        {ring.assignedTo ? (
                          <button onClick={() => declareFallenAndRelease(ring.id, ring.assignedTo)} style={{ background: 'rgba(185, 28, 28, 0.3)', color: '#fca5a5', border: '1px solid #ef4444', padding: '4px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}>
                            Déclarer Déchu/Mort ☠️
                          </button>
                        ) : (
                          <span style={{ fontSize: '9px', color: '#52525b', padding: '4px' }}>Déjà disponible</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button onClick={resetAllRings} style={{ background: '#7f1d1d', color: '#fff', border: '1px solid #ef4444', padding: '10px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>
              Réinitialiser TOUTES les bagues & historiques (Tests)
            </button>
          </div>
        )}

      </div>

      <footer style={{ textAlign: 'center', fontSize: '8px', color: '#27272a', fontFamily: 'monospace', zIndex: '2', letterSpacing: '1px' }}>
        <span>Akatsuki Legacy - System</span> — <button onClick={() => setStep('admin-login')} style={{ background: 'none', border: 'none', color: '#27272a', textDecoration: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}>.</button>
      </footer>

    </div>
  );
}