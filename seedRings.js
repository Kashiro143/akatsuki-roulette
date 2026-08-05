import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Configuration de votre base de données de test
const firebaseConfig = {
  apiKey: "AIzaSyAxvASWA6luO-zU9XZ1i5otjYDEvoHN5PI",
  authDomain: "akatsuki-roulette-test.firebaseapp.com",
  projectId: "akatsuki-roulette-test",
  storageBucket: "akatsuki-roulette-test.firebasestorage.app",
  messagingSenderId: "457734216615",
  appId: "1:457734216615:web:be7bafe07328bc013f7482",
  measurementId: "G-4ZQK4FDSBS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const ringsData = {
  zero: {
    name: "Zéro / Zérolithe",
    kanji: "零",
    finger: "Pouce droit",
    owner: "Pain",
    description: "Symbole de l'autorité absolue. Elle confère le pouvoir de centraliser les volontés et de porter le fardeau du jugement divin sur le monde.",
    assignedTo: null
  },
  seiryu: {
    name: "Bleu / Azur",
    kanji: "青",
    finger: "Index droit",
    owner: "Deidara (puis Tobi)",
    description: "Liée au flux de l'art éphémère. Elle exige de son porteur qu'il transforme chaque explosion en une œuvre immortelle.",
    assignedTo: null
  },
  byakko: {
    name: "Blanc / Tigre Blanc",
    kanji: "白",
    finger: "Majeur droit",
    owner: "Konan",
    description: "Portée par l'ange de l'organisation. Elle symbolise la loyauté indéfectible et la pureté d'une volonté vouée à la paix.",
    assignedTo: null
  },
  suzaku: {
    name: "Écarlate / Vermillon",
    kanji: "朱",
    finger: "Annulaire droit",
    owner: "Itachi Uchiha",
    description: "L'œil de l'illusion suprême et du sacrifice. Elle confère le devoir de porter le poids des ténèbres pour protéger l'ordre de l'ombre.",
    assignedTo: null
  },
  koryu: {
    name: "Ciel / Le Vide",
    kanji: "空",
    finger: "Auriculaire droit",
    owner: "Orochimaru",
    description: "L'insaisissable, le vide. Elle est destinée à celui qui cherche à percer tous les secrets de la création et de l'immortalité.",
    assignedTo: null
  },
  nansei: {
    name: "Sud",
    kanji: "南",
    finger: "Auriculaire gauche",
    owner: "Jūzō Biwa (puis Kisame Hoshigaki)",
    description: "L'arme des abysses. Elle impose la force brute, la froideur du requin et la loyauté face aux missions impossibles.",
    assignedTo: null
  },
  hokusei: {
    name: "Nord",
    kanji: "北",
    finger: "Annulaire gauche",
    owner: "Kakuzu",
    description: "Le cœur de la comptabilité et de la survie. Elle incarne la rigueur, l'expérience des âges et la valeur absolue du profit.",
    assignedTo: null
  },
  santai: {
    name: "Trois / Trinité",
    kanji: "三",
    finger: "Majeur gauche",
    owner: "Hidan",
    description: "Le sceau de la foi aveugle et de l'immortalité douloureuse. Elle lie son porteur à des rituels sanglants et fanatiques.",
    assignedTo: null
  },
  gyokunan: {
    name: "Sphère / Jupon",
    kanji: "玉",
    finger: "Index gauche",
    owner: "Sasori (puis Tobi)",
    description: "L'art des marionnettes éternelles. Elle demande à son détenteur de figer le temps et de plier la vie à sa vision mécanique.",
    assignedTo: null
  },
  honto: {
    name: "Sanglier",
    kanji: "亥",
    finger: "Pouce gauche",
    owner: "Zetsu",
    description: "L'espion aux deux visages, témoin silencieux de tous les secrets. Elle confère le rôle d'observer l'ombre sans jamais être vu.",
    assignedTo: null
  }
};

async function seedDatabase() {
  const email = process.env.AKATSUKI_ADMIN_EMAIL;
  const password = process.env.AKATSUKI_ADMIN_PASSWORD;
  if (!email || !password) {
    console.error("Définissez AKATSUKI_ADMIN_EMAIL et AKATSUKI_ADMIN_PASSWORD (compte leader du projet de test).");
    process.exit(1);
  }
  console.log("Connexion du leader au projet de test...");
  await signInWithEmailAndPassword(auth, email, password);
  console.log("Injection des bagues dans Firestore (Environnement de test)...");
  try {
    for (const [id, data] of Object.entries(ringsData)) {
      await setDoc(doc(db, "rings", id), data);
      console.log(`Bague ajoutée : ${data.name} (${id})`);
    }
    console.log("Toutes les bagues ont été ajoutées avec succès dans le projet de test !");
    process.exit(0);
  } catch (error) {
    console.error("Erreur lors de l'injection :", error);
    process.exit(1);
  }
}

seedDatabase();