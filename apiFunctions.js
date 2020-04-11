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


function getStoreInventory(storeId){
    return fetch('https://cors-anywhere.herokuapp.com/https://systembevakningsagenten.se/api/json/1.0/inventoryForStore.json?' + new URLSearchParams({
        id: storeId
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
        limit: 1
    }), {method: "GET"})             
    .then(resp => resp.json())
    .catch(function(error) {
        console.log(error);
    })
}

export {getStoresInCity, getStoreInventory, getClosestStore};