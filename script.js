let people;
function fetchData(url){
    return fetch(url)
            .then(checkStatus)
            .then(res => console.log(res.json()))
            .catch(error => console.log(error));
}

fetchData('https://randomuser.me/api/?results=12')
    .then(results =>{
        console.log(results);
        const people = results;
        console.log(results);
    });
console.log(people)
function checkStatus(response){
    if(response.ok){
        return Promise.resolve(response);
    }else{
        return Promise.reject(new Error(response.statusText))
    }
}