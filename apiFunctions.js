//this file will be responsible for talking with the api

function getStoresInCity(city){
    return fetch('https://cors-anywhere.herokuapp.com/https://systembevakningsagenten.se/api/json/2.1/searchStore.json?' + new URLSearchParams({
        query: city
    }), {method: "GET"})             
    .then(resp => resp.json())
    .catch(function(error) {
        console.log(error);
    })
}

function getClosestStore(lat, lng){
    return fetch('https://cors-anywhere.herokuapp.com/https://systembevakningsagenten.se/api/json/2.1/searchStore.json?' + new URLSearchParams({
        lat: lat,
        lng: lng,
        limit: 10,
        dist_km: 100
    }), {method: "GET"})             
    .then(resp => resp.json())
    .catch(function(error) {
        console.log(error);
    })
}

function getStoreInventory(id){
    console.log(id)
    return fetch('https://cors-anywhere.herokuapp.com/https://systembevakningsagenten.se/api/json/1.0/inventoryForStore.json?' + new URLSearchParams({
        id: id 
    }), {method: "GET"})             
    .then(resp => resp.json())
    .catch(function(error) {
        console.log(error);
    })
}

export {getStoresInCity, getClosestStore, getStoreInventory};