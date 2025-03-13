import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, push, get, child } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAfqFixezjsC60Pk-85F1wpCo614YSNglg",
    authDomain: "hostel-deed0.firebaseapp.com",
    databaseURL: "https://hostel-deed0-default-rtdb.firebaseio.com",
    projectId: "hostel-deed0",
    storageBucket: "hostel-deed0.firebasestorage.app",
    messagingSenderId: "986821469766",
    appId: "1:986821469766:web:a2fa024f42f591c3208c47",
    measurementId: "G-82RFHCFN52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Define Room Structure
const rooms = {
    "ground_floor": Array.from({ length: 10 }, (_, i) => `gm${i + 1}`),
    "middle_floor": Array.from({ length: 11 }, (_, i) => `mr${i + 1}`),
    "last_floor": ["gr1", "mr1", "lr1"]
};

// Function to Assign Room
async function assignRoom(age) {
    const studentsSnapshot = await get(child(ref(db), "students"));
    let students = [];
    if (studentsSnapshot.exists()) {
        students = Object.values(studentsSnapshot.val());
    }

    for (let floor in rooms) {
        for (let room of rooms[floor]) {
            let roomMates = students.filter(s => s.room === room);

            // Check if the room is not full (max 4 students) and age compatibility
            if (roomMates.length < 4 && (roomMates.length === 0 || roomMates.every(s => Math.abs(s.age - age) <= 2))) {
                return room;
            }
        }
    }
    return "No available room";
}

// Handle Form Submission
document.getElementById("student-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const name = document.getElementById("name").value;
    const age = parseInt(document.getElementById("age").value);
    const matric = document.getElementById("matric").value;
    
    const assignedRoom = await assignRoom(age);
    if (assignedRoom === "No available room") {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No available room for the given age range or all rooms are full!"
        });
        return;
    }

    try {
        await push(ref(db, "students"), {
            name,
            age,
            matric,
            room: assignedRoom,
            timestamp: new Date().toISOString()
        });

        Swal.fire({
            icon: "success",
            title: "Success!",
            text: `${name} has been assigned to room ${assignedRoom}!`
        });

        document.getElementById("student-form").reset();
    } catch (error) {
        console.error("Error adding student: ", error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong! Please try again."
        });
    }
});
