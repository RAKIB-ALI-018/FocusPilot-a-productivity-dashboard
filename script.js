let sidebar_options = document.querySelectorAll(".sidebar_options");
let fullContent = document.querySelectorAll(".fullContent");
let dashboard = document.querySelector(".content_top");
let backBtn = document.querySelectorAll(".backBtn");


// dashboard active set ho jayega apne aap jab bhi page refresh hoga
sidebar_options[0].classList.add("active");


// Full Content
sidebar_options.forEach(function (elem) {
    elem.addEventListener('click', function () {

        // 1. full content hide ho jayenge sabhi ke sabhi
        fullContent.forEach(function (content) {
            content.style.display = "none";
        });

        // 2. active class remove hogi sare sidebar options pr se
        sidebar_options.forEach(function (option) {
            option.classList.remove("active");
        });

        // 3. clicked item pr active class add hogi
        elem.classList.add("active");

        if (elem.id == "0") {
            // Dashboard show karega
            dashboard.style.display = "block";

        } else {
            // agar id "0" nahi hai toh us id ka full content show hoga
            // aur dashboard show nahi hoga
            dashboard.style.display = "none";
            fullContent[elem.id].style.display = "block";
            // console.log(fullContent[elem.id]);

        }
    });
});
// 

//New Task Button pr click karne pr "to do list" ka full content open hoga

let newTaskBtn = document.querySelector(".topbar_right")
newTaskBtn.addEventListener('click', function () {

    // 1. full content hide ho jayenge sabhi ke sabhi
    fullContent.forEach(function (content) {
        content.style.display = "none";
    });

    // 2. active class remove hogi sare sidebar options pr se
    sidebar_options.forEach(function (option) {
        option.classList.remove("active");
    });

    dashboard.style.display = "none";
    fullContent[1].style.display = "block";
    sidebar_options[1].classList.add("active");

})


// Back Button
backBtn.forEach(function (elem) {
    elem.addEventListener('click', function () {

        // 1. sare full content hide ho jaynge
        fullContent.forEach(function (content) {
            content.style.display = "none";
        });

        // 2. back click karte hi sirf dashboard show hoga
        dashboard.style.display = "block";

        // 3. active sirf dashbaord pr active rahega
        sidebar_options.forEach(function (option) {
            option.classList.remove("active");
        });
        sidebar_options[0].classList.add("active");
    });
});

// to do list - Form
let currTask = []

// Local Storage concept
if (localStorage.getItem('currTask')) {
    currTask = JSON.parse(localStorage.getItem('currTask'))
} else {
    console.log("Task List is Empty.");
}
// 

let form = document.querySelector(".remainingFullContent form")
let taskInput = document.querySelector(".enterTask")
let addTaskBtn = document.querySelector(".addTask")

function renderTask() {
    //
    let allTask = document.querySelector(".allTask")
    let sum = ''
    currTask.forEach(function (elem, index) {
        sum += `<div class="task">
            <h5>${elem.task}</h5>
            <div class="taskButtons">
                <div class="deleteTask" data-index="${index}">
                    <i class="ri-delete-bin-line"></i>
                </div>
                <button class="completeTask" data-index="${index}" 
                    style="
                        background-color: ${elem.completed ? 'white' : ''};
                        color: ${elem.completed ? '#1D9E75' : 'white'};
                        border: ${elem.completed ? '1px solid #1D9E75' : 'none'};
                    ">
                    ${elem.completed ? 'Completed' : 'Mark as completed'}
                </button>
            </div>
        </div>`
    })

    allTask.innerHTML = sum
    // updateDashboard()
    //

    //
    let completeTaskBtns = document.querySelectorAll(".completeTask")

    completeTaskBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {

            let index = btn.getAttribute('data-index');

            // update completed status in array
            currTask[index].completed = true;

            // save to localStorage
            localStorage.setItem('currTask', JSON.stringify(currTask));

            // re-render
            renderTask();
            // updateDashboard()
        });

    });
    //


    let deleteTaskBtns = document.querySelectorAll(".deleteTask")
    deleteTaskBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            let index = btn.getAttribute('data-index'); // convert to number
            currTask.splice(index, 1);
            localStorage.setItem('currTask', JSON.stringify(currTask));
            renderTask();
        });
    });

    updateDashboard()
}
renderTask()



// Form submit karne pr page reload nhi hoga
form.addEventListener('submit', function (elem) {
    elem.preventDefault();
    if (taskInput.value.trim() === "") return;  // empty tasks

    currTask.push({ task: taskInput.value })
    localStorage.setItem('currTask', JSON.stringify(currTask))
    taskInput.value = "";    // input clear ho jayega

    renderTask()

})
// 





//Motivational quote 
let quote = document.querySelector(".quote_box_bottom h1")
let author = document.querySelector(".quote_box_bottom .quote_author h2")
let quoteBtn = document.querySelector(".quote_change_button")


let quoteBox = document.querySelector(".quote_box")






async function getQuote() {
    try {
        const response = await fetch("https://dummyjson.com/quotes/random");
        const data = await response.json();

        quote.innerHTML = data.quote;
        author.innerHTML = "- " + data.author;

    } catch (error) {
        console.log("Error fetching quote:", error);
    }
}

quoteBtn.addEventListener("click", function () {
    // console.log(r, g, b);
    getQuote();

});

getQuote();
// 

//Pomodoro Timer

let pomodoroTime = document.querySelector(".pomodoroTime")

let startBtn = document.querySelector(".start")
let stopBtn = document.querySelector(".stop")
let resetBtn = document.querySelector(".reset")


//ye toggle wala part hai
let soundToggle = document.querySelector(".switch input");
let soundEnabled = localStorage.getItem("soundEnabled") !== "false";

soundToggle.checked = soundEnabled;

soundToggle.addEventListener("change", function () {
    soundEnabled = this.checked;
    localStorage.setItem("soundEnabled", soundEnabled);
});
// 

//alarm sound
let alarmSound = new Audio("alarmSound.mp3")
function ringAlarm() {

    if (!soundEnabled) return;

    alarmSound.play();

    setTimeout(() => {
        alarmSound.pause();
        alarmSound.currentTime = 0;
    }, 10000);  //10 seconds ke liye alaram chalega
}



let timerInterval = null


// Timer Duration Settings
let focusTimeSelect = document.querySelector("#focusTime");
let shortBreakTimeSelect = document.querySelector("#shortBreakTime");
let longBreakTimeSelect = document.querySelector("#longBreakTime");

// Load saved values
let focusDuration = Number(localStorage.getItem("focusDuration")) || 25;
let shortBreakDuration = Number(localStorage.getItem("shortBreakDuration")) || 5;
let longBreakDuration = Number(localStorage.getItem("longBreakDuration")) || 15;

let totalSeconds = focusDuration * 60;
let currentModeTime = focusDuration * 60;

function updateTimer() {
    let minutes = Math.floor(totalSeconds / 60)
    let seconds = totalSeconds % 60

    pomodoroTime.innerHTML = `${String(minutes).padStart("2", "0")}:${String(seconds).padStart("2", "0")}`
}
updateTimer()

function startTimer() {
    clearInterval(timerInterval)
    timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--
            updateTimer()
        } else {
            clearInterval(timerInterval)
            // timesUp.innerHTML = "🎉 Time's Up!."
            // alarmSound.play();
            ringAlarm()
        }
    }, 1000);
}
function pauseTimer() {
    clearInterval(timerInterval)
}



function resetTimer() {
    totalSeconds = currentModeTime
    updateTimer()
    clearInterval(timerInterval)
}

startBtn.addEventListener('click', startTimer)
stopBtn.addEventListener('click', pauseTimer)
resetBtn.addEventListener('click', resetTimer)
//



let shortBreakTime = document.querySelector(".shortBreakTime")

let pomodoroBtn = document.querySelector(".pomodoro")
let shortBreakBtn = document.querySelector(".shortBreak")
let longBreakBtn = document.querySelector(".longBreak")

let timeBox = document.querySelector(".pomodoroTimer_box")
let startStopResetBtns = document.querySelectorAll(".pomodoroButtons button")

let timesUp = document.querySelector(".timer h2")

pomodoroBtn.style.backgroundColor = "#1d9e7569"

// Short Break
shortBreakBtn.addEventListener('click', function () {
    currentMode = "shortBreak"

    shortBreakBtn.style.backgroundColor = "#7f77dd9e";
    longBreakBtn.style.backgroundColor = "rgb(255, 255, 255, 0)";
    pomodoroBtn.style.backgroundColor = "rgb(255, 255, 255, 0)";

    currentModeTime = shortBreakDuration * 60;
    totalSeconds = currentModeTime;

    timeBox.style.backgroundColor = "#7F77DD";

    startStopResetBtns.forEach(function (elem) {
        elem.style.backgroundColor = "#7F77DD";
    });

    updateTimer();
    clearInterval(timerInterval);
});

//Long Break Time
longBreakBtn.addEventListener('click', function () {
    currentMode = "longBreak"

    longBreakBtn.style.backgroundColor = "rgba(100, 148, 237, 0.439)";
    shortBreakBtn.style.backgroundColor = "rgb(255, 255, 255, 0)";
    pomodoroBtn.style.backgroundColor = "rgb(255, 255, 255, 0)";

    currentModeTime = longBreakDuration * 60;
    totalSeconds = currentModeTime;

    timeBox.style.backgroundColor = "cornflowerblue";

    startStopResetBtns.forEach(function (elem) {
        elem.style.backgroundColor = "cornflowerblue";
    });

    updateTimer();
    clearInterval(timerInterval);
});
// 




//pomodoro Time
pomodoroBtn.addEventListener('click', function () {
    currentMode = "pomodoro"

    pomodoroBtn.style.backgroundColor = "#1d9e7569";
    shortBreakBtn.style.backgroundColor = "rgb(255, 255, 255, 0)";
    longBreakBtn.style.backgroundColor = "rgb(255, 255, 255, 0)";

    currentModeTime = focusDuration * 60;
    totalSeconds = currentModeTime;

    timeBox.style.backgroundColor = "#1D9E75";

    startStopResetBtns.forEach(function (elem) {
        elem.style.backgroundColor = "#1D9E75";
    });

    updateTimer();
    clearInterval(timerInterval);
});
// 




// Show saved values in dropdowns
focusTimeSelect.value = focusDuration;
shortBreakTimeSelect.value = shortBreakDuration;
longBreakTimeSelect.value = longBreakDuration;

let currentMode = "pomodoro"

focusTimeSelect.addEventListener("change", function () {
    focusDuration = Number(this.value);
    localStorage.setItem("focusDuration", focusDuration);
    if (currentMode === "pomodoro") {
        currentModeTime = focusDuration * 60;
        totalSeconds = currentModeTime;
        updateTimer();
    }
});

shortBreakTimeSelect.addEventListener("change", function () {
    shortBreakDuration = Number(this.value);
    localStorage.setItem("shortBreakDuration", shortBreakDuration);
    if (currentMode === "shortBreak") {
        currentModeTime = shortBreakDuration * 60;
        totalSeconds = currentModeTime;
        updateTimer();
    }
});

longBreakTimeSelect.addEventListener("change", function () {
    longBreakDuration = Number(this.value);
    localStorage.setItem("longBreakDuration", longBreakDuration);
    if (currentMode === "longBreak") {
        currentModeTime = longBreakDuration * 60;
        totalSeconds = currentModeTime;
        updateTimer();
    }
});



// Goals
let currGoal = []

if (localStorage.getItem('currGoal')) {
    currGoal = JSON.parse(localStorage.getItem('currGoal'))
} else {
    console.log("Goal List is Empty.");
}

let setGoalForm = document.querySelector(".setGoal form");
let goalInput = document.querySelector(".goalInput")

function renderGoal() {
    let allGoal = document.querySelector(".allGoals")
    let sum = ''

    currGoal.forEach(function (elem, index) {
        sum += `<div class="task">
            <h5>${elem.task}</h5>
            <div class="taskButtons">
                <div class="deleteGoal" data-index="${index}">
                    <i class="ri-delete-bin-line"></i>
                </div>
                <button class="completeGoal" data-index="${index}" 
                    style="
                        background-color: ${elem.completed ? 'white' : ''};
                        color: ${elem.completed ? '#1D9E75' : 'white'};
                        border: ${elem.completed ? '1px solid #1D9E75' : 'none'};
                    ">
                    ${elem.completed ? 'Completed' : 'Mark as completed'}
                </button>
            </div>
        </div>`
    })

    allGoal.innerHTML = sum

    // complete button — search inside allGoal only
    let completeGoalBtns = allGoal.querySelectorAll(".completeGoal")
    completeGoalBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            let index = btn.getAttribute('data-index');
            currGoal[index].completed = true;
            localStorage.setItem('currGoal', JSON.stringify(currGoal));
            renderGoal();
        });
    });

    // delete button — search inside allGoal only
    let deleteGoalBtns = allGoal.querySelectorAll(".deleteGoal")
    deleteGoalBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            let index = btn.getAttribute('data-index');
            currGoal.splice(index, 1);
            localStorage.setItem('currGoal', JSON.stringify(currGoal));
            renderGoal();
        });
    });
}
renderGoal()

setGoalForm.addEventListener('submit', function (elem) {
    elem.preventDefault();
    if (goalInput.value.trim() === "") return;

    currGoal.push({ task: goalInput.value, completed: false })
    localStorage.setItem('currGoal', JSON.stringify(currGoal))
    goalInput.value = "";

    renderGoal()
})





// dashboard stats update function
function updateDashboard() {
    let totalTasks = currTask.length

    let todaysTask = document.querySelector(".tasks_today h3")
    todaysTask.innerHTML = `${currTask.length}`

    let completedTask = document.querySelector(".completedTask")
    let taskThatAreCompleted = 0;

    currTask.forEach(function (elem) {
        if (elem.completed) {
            taskThatAreCompleted++;
        }
    })

    completedTask.innerHTML = `${taskThatAreCompleted} completed`


    let uncompleteTasks = document.querySelector(".needs_attention h3")
    uncompleteTasks.innerHTML = `${totalTasks - taskThatAreCompleted}`


    let taskCompletion = document.querySelector(".completion_perc h3")
    let taskUncompletion = document.querySelector("#undoneTaskPerc")
    if (totalTasks === 0) {
        taskCompletion.innerHTML = "0%";
        taskUncompletion.innerHTML = "0% left";
    } else {
        taskCompletion.innerHTML =
            `${((taskThatAreCompleted / totalTasks) * 100).toFixed(2)}%`;

        taskUncompletion.innerHTML =
            `${(((totalTasks - taskThatAreCompleted) / totalTasks) * 100).toFixed(2)}% left`;
    }
}
updateDashboard()

//



//live date and time
const timeElement = document.getElementById("live-time");
const dateElement = document.getElementById("live-date");

function updateDateTime() {
    const now = new Date();

    // Time
    const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });

    // Date
    const date = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    timeElement.textContent = time;
    dateElement.textContent = date;
}

updateDateTime();
setInterval(updateDateTime, 1000);

//


// Add Notes Section
let noteArea = document.querySelector(".note");

// Load saved note
if (localStorage.getItem("noteArea")) {
    noteArea.value = localStorage.getItem("noteArea");
}

// Save note whenever user types
noteArea.addEventListener("input", function () {
    localStorage.setItem("noteArea", noteArea.value);
});

// localStorage.removeItem("noteArea");
// noteArea.value = "";






//theme change karne ka code
let themeChangeBtn = document.querySelector(".changeTheme");

let sidebar = document.querySelector(".sidebar")
let topbar = document.querySelector(".topbar")
let content = document.querySelector(".content")
// console.log(sidebar);
// console.log(topbar);
// console.log(content);

// Load saved theme
let currentTheme = localStorage.getItem("theme");

if (currentTheme === "light") {
    themeChangeBtn.innerHTML = "Switch to Dark Theme";
    sidebar.style.backgroundColor = "#2C5EAD";
    topbar.style.backgroundColor = "#1591DC";
    content.style.backgroundColor = "#27374D";
} else {
    themeChangeBtn.innerHTML = "Switch to Light Theme";
    sidebar.style.backgroundColor = "#27374D";
    topbar.style.backgroundColor = "#526D82";
    content.style.backgroundColor = "rgb(36, 36, 36)";
}



function themeChange() {
    themeChangeBtn.addEventListener("click", function () {

        if (localStorage.getItem("theme") !== "light") {

            themeChangeBtn.innerHTML = "Switch to Dark Theme";
            sidebar.style.backgroundColor = "#2C5EAD";
            topbar.style.backgroundColor = "#1591DC";
            content.style.backgroundColor = "#27374D";

            localStorage.setItem("theme", "light");

        } else {

            themeChangeBtn.innerHTML = "Switch to Light Theme";
            sidebar.style.backgroundColor = "#27374D";
            topbar.style.backgroundColor = "#526D82";
            content.style.backgroundColor = "rgb(36, 36, 36)";

            localStorage.setItem("theme", "dark");
        }
    });
}
themeChange()





//user ka name set karne ka code 
let nameInput = document.querySelector(".changeNameInput");
let userNameElement = document.querySelector(".userName span");
let nameChangeForm = document.querySelector(".nameChangeOption form");

let userName = null;

if (localStorage.getItem("userName")) {
    userName = JSON.parse(localStorage.getItem("userName"));
} else {
    console.log("Name is Empty.");
}

function setName() {
    if (userName) {
        userNameElement.innerHTML = userName;
    }
}

setName();

nameChangeForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (nameInput.value.trim() === "") return;
    userName = nameInput.value;
    userNameElement.innerHTML = userName;
    localStorage.setItem("userName", JSON.stringify(userName));
    nameInput.value = "";
});


//sabhi tasks aur goals ko clear karne ke liye

let tasksClearBtn = document.querySelector("#cleartasks")
let goalsClearBtn = document.querySelector("#clearGoals")

// console.log(tasksClearBtn);
tasksClearBtn.addEventListener("click", function () {
    currTask = [];
    localStorage.removeItem("currTask");
    renderTask();
});

goalsClearBtn.addEventListener("click", function () {
    currGoal = [];
    localStorage.removeItem("currGoal");
    renderGoal();
});





