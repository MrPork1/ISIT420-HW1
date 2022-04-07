
let movieArray = [];

let storeIDArray = [98053, 98007, 98055, 98011, 98046];
let cdID =   [123456, 123654, 321456, 321654, 654123, 654321, 543216, 354126, 621453, 623451];

// define a constructor to create movie objects
let MovieObject = function (pTitle, pYear, pGenre, pMan, pWoman, pURL) {
    this.ID = Math.random().toString(16).slice(5)  // tiny chance could get duplicates!
    this.Title = pTitle;
    this.Year = pYear;
    this.Genre = pGenre;  // action  comedy  drama  horrow scifi  musical  western
}

let SalesObject = function(pStoreID, pSalesPersonID, pCdID, pPricePaid, pDate) {
    this.StoreID = storeIDArray[Math.floor(Math.random()* storeIDArray.length)];
    this.SalesPersonID = Math.floor(Math.random()*24);
    this.CdID = cdID[Math.floor(Math.random() * cdID.length)];
    this.PricePaid = Math.floor(Math.random() * (15 - 5 + 1) + 5);
    let d = new Date();
    d.toDateString();
    this.Date = d;
}

let selectedGenre = "not selected";

document.addEventListener("DOMContentLoaded", function () {

    createList();

// add button events ************************************************************************
    
    document.getElementById("buttonSubmitOne").addEventListener("click", function () {
        let newSalesObject = new SalesObject;

        fetch('/AddSales', {
            method: "POST",
            body: JSON.stringify(newSalesObject),
            headers: {"Content-type": "application/json; charset=UTF-8"}
            })
            .then(response => response.json()) 
            .then(json => console.log(json),
            createList()
            )
            .catch(err => console.log(err));
    
        // $.ajax({
        //     url : "/AddMovie",
        //     type: "POST",
        //     data: JSON.stringify(newMovie),
        //     contentType: "application/json; charset=utf-8",
        //      success: function (result) {
        //         console.log(result);
        //         createList();
        //     }
        // });
       
    });

    document.getElementById("buttonCreate").addEventListener("click", function() {
        let storeObject = new SalesObject;
        document.getElementById("p1").innerHTML = storeObject.StoreID;
        document.getElementById("p2").innerHTML = storeObject.SalesPersonID;
        document.getElementById("p3").innerHTML = storeObject.CdID;
        document.getElementById("p4").innerHTML = storeObject.PricePaid;
        document.getElementById("p5").innerHTML = storeObject.Date;
    });



    // document.getElementById("buttonGet").addEventListener("click", function () {
    //     createList();      
    // });

    // document.getElementById("buttonDelete").addEventListener("click", function () {
    //     deleteMovie(document.getElementById("deleteID").value);      
    // });
    
    // document.getElementById("buttonClear").addEventListener("click", function () {
    //     document.getElementById("title").value = "";
    //     document.getElementById("year").value = "";
    // });

    // $(document).bind("change", "#select-genre", function (event, ui) {
    //     selectedGenre = $('#select-genre').val();
    // });

  

});  
// end of wait until document has loaded event  *************************************************************************


function createList() {
// update local array from server

    fetch('/getAllSales')
    // Handle success
    .then(response => response.json())  // get the data out of the response object
    .then( responseData => fillUL(responseData))    //update our array and li's
    .catch(err => console.log('Request Failed', err)); // Catch errors

    // $.get("/getAllMovies", function(data, status){  // AJAX get
    //     movieArray = data;  // put the returned server json data into our local array
        
    //       // clear prior data
    //     var divMovieList = document.getElementById("divMovieList");
    //     while (divMovieList.firstChild) {    // remove any old data so don't get duplicates
    //         divMovieList.removeChild(divMovieList.firstChild);
    //     };

    //     var ul = document.createElement('ul');

    //     movieArray.forEach(function (element,) {   // use handy array forEach method
    //         var li = document.createElement('li');
    //         li.innerHTML = element.ID + ":  &nbsp &nbsp  &nbsp &nbsp " + 
    //         element.Title + "  &nbsp &nbsp  &nbsp &nbsp "  
    //         + element.Year + " &nbsp &nbsp  &nbsp &nbsp  " + element.Genre;
    //         ul.appendChild(li);
    //     });
    //     divMovieList.appendChild(ul)

    // });
};

function fillUL(data) {
        // clear prior data
    var divMovieList = document.getElementById("divMovieList");
    while (divMovieList.firstChild) {    // remove any old data so don't get duplicates
        divMovieList.removeChild(divMovieList.firstChild);
    };

    var ul = document.createElement('ul');
    movieArray = data;
    movieArray.forEach(function (element,) {   // use handy array forEach method
        var li = document.createElement('li');
        li.innerHTML = element.ID + ":  &nbsp &nbsp  &nbsp &nbsp " + 
        element.Title + "  &nbsp &nbsp  &nbsp &nbsp "  
        + element.Year + " &nbsp &nbsp  &nbsp &nbsp  " + element.Genre;
        ul.appendChild(li);
    });
    divMovieList.appendChild(ul)
}

function deleteSales(ID) {

    fetch('/DeleteSales/' + ID, {
        method: "DELETE",
       // body: JSON.stringify(_data),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      .then(response => response.json()) 
      .then(json => console.log(json))
      .catch(err => console.log(err));



    // $.ajax({
    //     type: "DELETE",
    //     url: "/DeleteMovie/" +ID,
    //     success: function(result){
    //         alert(result);
    //         createList();
    //     },
    //     error: function (xhr, textStatus, errorThrown) {  
    //         alert("Server could not delete Movie with ID " + ID)
    //     }  
    // });
   
}


  
