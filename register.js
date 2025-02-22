import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Gebruik de bestaande Firebase configuratie
const firebaseConfig = {
    apiKey: "AIzaSyBCXaYJI9dxwqKD1Qsb_9AOdsnVTPG2uHM",
    authDomain: "pjotters-company.firebaseapp.com",
    projectId: "pjotters-company",
    storageBucket: "pjotters-company.appspot.com",
    messagingSenderId: "64413422793",
    appId: "1:64413422793:web:4025770645944818d6e918"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;

    // Validatie
    if (password !== confirmPassword) {
        alert('Wachtwoorden komen niet overeen');
        return;
    }

    if (!terms) {
        alert('Je moet akkoord gaan met de voorwaarden');
        return;
    }

    try {
        // Maak nieuwe gebruiker aan
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profiel met gebruikersnaam
        await updateProfile(user, {
            displayName: username
        });

        // Maak gebruikersprofiel aan in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            username: username,
            email: email,
            createdAt: new Date(),
            gamePreferences: {
                genres: [],
                difficulty: 'all'
            }
        });

        // Sla login status op
        localStorage.setItem('userLoggedIn', 'true');
        
        // Redirect naar gallery
        window.location.href = '/gallery.html';
    } catch (error) {
        let errorMessage = 'Registratie mislukt: ';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage += 'Dit e-mailadres is al in gebruik.';
                break;
            case 'auth/weak-password':
                errorMessage += 'Het wachtwoord moet minimaal 6 tekens lang zijn.';
                break;
            default:
                errorMessage += error.message;
        }
        
        alert(errorMessage);
    }
});