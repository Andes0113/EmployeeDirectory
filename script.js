const gallery = document.getElementById("gallery");
let people;

let modald = document.createElement("div");
let input = document.createElement("input");
let but = document.createElement("button");

input.placeholder = "Search"
but.textContent = "Submit"

document.querySelector(".search-container").appendChild(input);
document.querySelector(".search-container").appendChild(but);
document.body.appendChild(modald);

input.addEventListener("keyup", ()=>{
    console.log(people)
    populate(people, input.value);
})

function fetchData(url){
    return fetch(url)
            .then(checkStatus)
            .then(res => res.json())
            .catch(error => console.log(error));
}

function checkStatus(response){
    if(response.ok){
        return Promise.resolve(response);
    }else{
        return Promise.reject(new Error(response.statusText))
    }
}

fetchData('https://randomuser.me/api/?results=12')
    .then(data => {
        people = data.results
        populate(people, "");
});

function populate(data, keyword){
    gallery.innerHTML = "";
    for(let i = 0; i < data.length; i++){
        if(checkWord(data[i], keyword)){ 
            gallery.innerHTML += `
                <div class="card">
                    <div class="card-img-container">
                        <img class="card-img" src="${data[i].picture.large}" alt="profile picture">
                    </div>
                    <div class="card-info-container">
                        <h3 id="name" class="card-name cap">${data[i].name.first} ${data[i].name.last}</h3>
                        <p class="card-text">${data[i].email}</p>
                        <p class="card-text cap">${data[i].location.city}, ${data[i].location.state}</p>
                    </div>
                </div>
            `
        }
    }
    addListeners(data);
}

function checkWord(data, keyword){
    return data.name.first.indexOf(keyword) >= 0 || data.name.last.indexOf(keyword) >= 0 || data.email.indexOf(keyword) >= 0 || data.location.city.indexOf(keyword) >= 0 || data.location.state.indexOf(keyword) >= 0;
}

function addListeners(data){
    for(let i = 0; i < 12; i++){
        document.getElementsByClassName("card")[i].addEventListener("click", ()=>{
            document.body.innerHTML += `
            <div class="modal-container">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="${data[i].picture.large}" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${data[i].name.first} ${data[i].name.last}</h3>
                        <p class="modal-text">${data[i].email}</p>
                        <p class="modal-text cap">${data[i].location.city}</p>
                        <hr>
                        <p class="modal-text">${data[i].phone}, ${data[i].cell}</p>
                        <p class="modal-text">${data[i].location.street.number} ${data[i].location.street.name} ${data[i].location.city}, ${data[i].location.state} ${data[i].location.postcode}</p>
                        <p class="modal-text">Birthday: ${data[i].dob.substring(5,7)}/${data[i].dob.substring(8,10)}/${data[i].dob.substring(0,4)}10/21/2015</p>
                    </div>
                </div>

                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
            </div>`;
        })
    }
    
}