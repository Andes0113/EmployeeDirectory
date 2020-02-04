const gallery = document.getElementById("gallery");
let modald = document.createElement("div");
let input = document.createElement("input");
let searchbutton = document.createElement("button");
let people;

input.placeholder = "Search"
searchbutton.textContent = "Submit"

document.querySelector(".search-container").appendChild(input);
document.querySelector(".search-container").appendChild(searchbutton);
document.body.appendChild(modald);

input.addEventListener("keyup", ()=>{
    populate(people, input.value);
})
searchbutton.addEventListener("click", ()=>{
    populate(people, input.value);
})

/*
 * Gets info from API
 * Param: String
 * Return: None
*/
function fetchData(url){
    return fetch(url)
            .then(checkStatus)
            .then(res => res.json())
            .catch(error => console.log(error));
}
/*
 * Checks if promise was resolved
 * Param: Response
 * Returns: Promise result
*/
function checkStatus(response){
    if(response.ok){
        return Promise.resolve(response);
    }else{
        return Promise.reject(new Error(response.statusText))
    }
}

fetchData('https://randomuser.me/api/?nat=us&results=12')
    .then(data => {
        people = data.results
        populate(people, "");
});

/*
 * Populates page with cards based on if they contain a string
 * Param: Object array, Filter word
 * Returns: None
*/
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

/*
 * Checks if object contains keyword
 * Param: object, string
 * Returns: Boolean
*/
function checkWord(data, keyword){
    return data.name.first.toLowerCase().indexOf(keyword.toLowerCase()) >= 0 || data.name.last.toLowerCase().indexOf(keyword.toLowerCase()) >= 0 || data.email.toLowerCase().indexOf(keyword.toLowerCase()) >= 0 || data.location.city.toLowerCase().indexOf(keyword.toLowerCase()) >= 0 || data.location.state.toLowerCase().indexOf(keyword.toLowerCase()) >= 0;
}

/*
 * Adds modal to screen
 * Param: Object array
 * Returns: None
*/
function addListeners(data){
    for(let i = 0; i < document.getElementsByClassName("card").length; i++){

        document.getElementsByClassName("card")[i].addEventListener("click", ()=>{

            let name = document.getElementsByClassName("card")[i].children[1].children[0].innerHTML;
            let a = 0;
            for(let j = 0; j < data.length; j++){
                if(data[j].name.first + " " + data[j].name.last ===  name){
                    a = j;
                }
            }
            document.body.innerHTML += modalText(data[a]);
            addButtons(data, data[a]);
            if(i == 0){
                document.getElementById("modal-prev").style.backgroundColor = "White";
                document.getElementById("modal-prev").style.border = "1px solid rgba(255, 255, 255, 0)";
                document.getElementById("modal-prev").textContent = "";
                document.getElementById("modal-prev").disabled = true;
            }else if(i == data.length-1){
                document.getElementById("modal-next").style.backgroundColor = "White";
                document.getElementById("modal-next").style.border = "1px solid rgba(255, 255, 255, 0)";
                document.getElementById("modal-next").textContent = "";
                document.getElementById("modal-next").disabled = true;
            }
        })
    } 
}

/*
 * Adds buttons to modal
 * Param: array of objects, object
 * Returns: None
*/
function addButtons(data, point){
    let i;
    for(let j = 0; j < data.length; j++){
        if(data[j] == point){
            i = j;
        }
    }
    document.getElementById("modal-close-btn").addEventListener("click", ()=>{
        document.body.removeChild(document.querySelector(".modal-container"));
        addListeners(data);
    })
    document.getElementById("modal-prev").addEventListener("click", ()=>{
        document.body.removeChild(document.querySelector(".modal-container"));
        if(i > 0){
            i--;
            document.body.innerHTML += modalText(data[i]);
            addButtons(data, data[i]);
            if(i == 0){
                document.getElementById("modal-prev").style.backgroundColor = "White";
                document.getElementById("modal-prev").style.border = "1px solid rgba(255, 255, 255, 0)";
                document.getElementById("modal-prev").textContent = "";
                document.getElementById("modal-prev").disabled = true;
            }
        }
    });
    document.getElementById("modal-next").addEventListener("click", ()=>{
        document.body.removeChild(document.querySelector(".modal-container"));
        if(i < data.length-1){
            i++;
            document.body.innerHTML += modalText(data[i]);
            addButtons(data, data[i]);
            if(i == data.length-1){
                document.getElementById("modal-next").style.backgroundColor = "White";
                document.getElementById("modal-next").style.border = "1px solid rgba(255, 255, 255, 0)";
                document.getElementById("modal-next").textContent = "";
                document.getElementById("modal-next").disabled = true;
            }
        }
    });
}

/*
 * Storage for modal text
 * Param: Object
 * Returns: String
*/
function modalText(point){
    return `
    <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${point.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${point.name.first} ${point.name.last}</h3>
                <p class="modal-text">${point.email}</p>
                <p class="modal-text cap">${point.location.city}</p>
                <hr>
                <p class="modal-text">Home: ${point.phone}</p>
                <p class="modal-text">Cell: ${point.cell}</p>
                <p class="modal-text">${point.location.street.number} ${point.location.street.name}, ${point.location.city}, ${point.location.state} ${point.location.postcode}</p>
                <p class="modal-text">Birthday: ${point.dob.date.substring(5,7)}/${point.dob.date.substring(8,10)}/${point.dob.date.substring(0,4)}</p>
            </div>
        </div>

        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>`;
}