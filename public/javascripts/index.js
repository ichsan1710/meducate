let body = document.body;

let profile = document.querySelector('.header .flex .profile');

document.querySelector('#user-btn').onclick = () => {
    profile.classList.toggle('active');
}

let sideBar = document.querySelector('.side-bar');

document.querySelector('#menu-btn').onclick = () => {
    sideBar.classList.toggle('active');
    body.classList.toggle('active');
}

document.querySelector('#close-btn').onclick = () => {
    sideBar.classList.remove('active');
    body.classList.remove('active');
}

let landingStudyPlan = document.querySelector('.landing-section')
let createStudyPlan = document.querySelector('.create-section')
let homeSection = document.querySelector('.home-section')

/*---------- SideBar Menu ----------*/
let studyLink = document.getElementById('study-link')
let homePage = document.getElementById('home-link')
console.log(studyLink);

if(studyLink){
    studyLink.addEventListener('click', changePage)
}

if(homePage){
    homePage.addEventListener('click', function(){
        homeSection.classList.remove('hide')
        landingStudyPlan.classList.add('hide')
        createStudyPlan.classList.add('hide')
    })
}

function changePage(){
    landingStudyPlan.classList.remove('hide')
    homeSection.classList.add('hide')
    createStudyPlan.classList.add('hide')
}


//Code Untuk 'Pindah Halaman' dari Landing PAge Student Plan ke Create Student Plan
let createBtn = document.getElementById('btn-create')

if(createBtn){
    createBtn.addEventListener('click', getStudyPlanForm)
}

function getStudyPlanForm(){
    landingStudyPlan.classList.add('hide')
    createStudyPlan.classList.remove('hide')
}

//Untuk Bikin Card Element Baru
//1. Tarik dulu elemen parents-nya
let container = document.querySelector('.landing-section')

//2. Bikin elemen div kosong baru dengan class card-container
let cardElement = document.createElement('div')
cardElement.classList.add(`card-container`)
container.appendChild(cardElement)

//Tarik Button lalu buat fungsinya
let studyPlanBtn = document.getElementById("btn-createStudyPlan")

if(studyPlanBtn){
    studyPlanBtn.addEventListener('click', addStudyPlan);
}

function addStudyPlan(){
    let subject = document.getElementById("subject1").value
    let examDate = document.getElementById("exam-date").value

    let subjectDetails = `<div class="card-element">
    <div class="card-content">
        <h3 class="subject-name">Iqbal's <span class="subject-title">${subject}</span> Course</h3>
        <h3>Study Plan</h3>
    </div>

    <div class="progress">
        <h3>0%</h3>
    </div>

    <a href="#" id="btn-close">X</span></a>
</div>`
    console.log(examDate);

    cardElement.insertAdjacentHTML('beforeend', subjectDetails)

    landingStudyPlan.classList.remove('hide')
    createStudyPlan.classList.add('hide')

     //Close Btn
     let close = document.querySelectorAll('#btn-close')
    console.log(close[0]);

     for(let i=0; i<close.length; i++){
         close[i].addEventListener('click', function(e){
             // e.target.parentElement.style.display ='none';
             e.target.parentElement.remove();
             e.preventDefault(); //Menghilangkan efek dari elemen tag-nya
             e.stopPropagation(); //Menghilangkan efek event parent-snya
         } )
     }
}