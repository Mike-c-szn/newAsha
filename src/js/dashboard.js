// Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, get, remove, onValue, set } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

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

// Function to fetch and display students' data
function fetchStudents() {
    const studentsRef = ref(db, "students");

    get(studentsRef).then((snapshot) => {
        const studentTableBody = document.querySelector("#student-table tbody");
        studentTableBody.innerHTML = ""; // Clear table before inserting new data

        if (snapshot.exists()) {
            let studentsArray = [];

            snapshot.forEach((childSnapshot) => {
                const student = childSnapshot.val();
                studentsArray.push({ key: childSnapshot.key, ...student });
            });

            // Sort students by room number
            studentsArray.sort((a, b) => (a.room || "").localeCompare(b.room || "", undefined, { numeric: true }));

            // Insert students into the table in sorted order
            studentsArray.forEach((student) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${student.name || "N/A"}</td>
                    <td>${student.age || "N/A"}</td>
                    <td>${student.matric || "N/A"}</td>
                    <td>${student.room || "N/A"}</td>
                    <td>
                        <button class="delete-btn" data-id="${student.key}">Delete</button>
                    </td>
                `;

                studentTableBody.appendChild(row);
            });

            // Attach event listeners to delete buttons
            document.querySelectorAll(".delete-btn").forEach((button) => {
                button.addEventListener("click", function () {
                    const studentId = this.getAttribute("data-id");
                    deleteStudent(studentId);
                });
            });
        } else {
            studentTableBody.innerHTML = "<tr><td colspan='5'>No students found.</td></tr>";
        }
    }).catch((error) => {
        console.error("Error fetching student data:", error);
    });
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", fetchStudents);

// Function to delete a student
function deleteStudent(studentId) {
    console.log("Deleting student with ID:", studentId); // Debugging

    if (confirm("Are you sure you want to delete this student?")) {
        const studentRef = ref(db, "students/" + studentId);

        remove(studentRef)
            .then(() => {
                alert("Student deleted successfully!");
                fetchStudents(); // Refresh the table
            })
            .catch((error) => {
                console.error("Error deleting student:", error);
            });
    }
}
