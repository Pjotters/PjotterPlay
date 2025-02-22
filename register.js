import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyBCXaYJI9dxwqKD1Qsb_9AOdsnVTPG2uHM",
    authDomain: "pjotters-company.firebaseapp.com",
    databaseURL: "https://pjotters-company-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "pjotters-company",
    storageBucket: "pjotters-company.appspot.com",
    messagingSenderId: "64413422793",
    appId: "1:64413422793:web:4025770645944818d6e918"
};

try {
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

        if (password !== confirmPassword) {
            alert('Wachtwoorden komen niet overeen');
            return;
        }

        if (!terms) {
            alert('Je moet akkoord gaan met de voorwaarden');
            return;
        }

        try {
            // Eerst de gebruiker aanmaken
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update profiel
            await updateProfile(user, {
                displayName: username
            });

            // Wacht even voordat we naar Firestore schrijven
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Maak gebruikersprofiel aan in Firestore met merge optie
            try {
                await setDoc(doc(db, 'users', user.uid), {
                    username: username,
                    email: email,
                    createdAt: new Date().toISOString(),
                    gamePreferences: {
                        genres: [],
                        difficulty: 'all'
                    }
                }, { merge: true });

                localStorage.setItem('userLoggedIn', 'true');
                window.location.href = 'gallery.html';
            } catch (firestoreError) {
                console.error('Firestore error:', firestoreError);
                // Gebruiker is wel aangemaakt, dus doorsturen
                localStorage.setItem('userLoggedIn', 'true');
                window.location.href = 'gallery.html';
            }
        } catch (error) {
            console.error('Registration error:', error);
            let errorMessage = 'Registratie mislukt: ';
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage += 'Dit e-mailadres is al in gebruik.';
                    break;
                case 'auth/weak-password':
                    errorMessage += 'Het wachtwoord moet minimaal 6 tekens lang zijn.';
                    break;
                case 'auth/invalid-email':
                    errorMessage += 'Ongeldig e-mailadres.';
                    break;
                default:
                    errorMessage += error.message;
            }
            
            alert(errorMessage);
        }
    });
} catch (error) {
    console.error('Firebase initialization error:', error);
    alert('Er is een probleem met de verbinding. Probeer het later opnieuw.');
}