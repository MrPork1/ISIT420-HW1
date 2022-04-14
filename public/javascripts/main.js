
let orderArray = [];
let cdArray = [];

let storeIDArray = [98053, 98007, 98077, 98055, 98011, 98046];
let cdID =   [123456, 123654, 321456, 321654, 654123, 654321, 543216, 354126, 621453, 623451];

let code98053 = [1,2,3,4];
let code98007 = [5,6,7,8];
let code98077 = [9,10,11,12];
let code98055 = [13,14,15,16];
let code98011 = [17,18,19,20];
let code98046 = [21,22,23,24];

let dict = {
    98053: code98053,
    98007: code98007,
    98077: code98077,
    98055: code98055,
    98011: code98011,
    98046: code98046
};

let SalesObject = function(pStoreID, pSalesPersonID, pCdID, pPricePaid, pDate) {
    this.StoreID = storeIDArray[Math.floor(Math.random()* storeIDArray.length)];
    let newArray = dict[this.StoreID];
    this.SalesPersonID = newArray[Math.floor(Math.random()* newArray.length)];
    this.CdID = cdID[Math.floor(Math.random() * cdID.length)];
    this.PricePaid = Math.floor(Math.random() * (15 - 5 + 1) + 5);
    let d = new Date();
    d.toDateString();
    this.Date = d;
}

let selectedGenre = "not selected";

document.addEventListener("DOMContentLoaded", function () {

    //createList();

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
            )
            .catch(err => console.log(err));
       
    });

    document.getElementById("SumQuery").addEventListener("click", function () {
        fetch('/sum')
        .then(response => response.json())
        .then(responseData => fillULTopSales(responseData))
        .catch(err => console.log('Request Failed',  err));
    });

    document.getElementById("CDQuery").addEventListener("click", function () {
        fetch('/totalcd')
        .then(response => response.json())
        .then(responseData => fillULTotalCDSold(responseData))
        .catch(err => console.log('Request Failed',  err));
    });

    document.getElementById("buttonSubmit500").addEventListener("click", function() {

        let currentDate = Date.now();

        let firstOrder = new SalesObject;
        PushSalesObject(firstOrder);


        for(let i = 0; i < 499; i++)
        {
            let newSalesObject = new SalesObject;
            //console.log(newSalesObject);                        
            let numMinutes = Math.floor(Math.random() * (5000 - 1000 + 1) + 1000);
            newSalesObject.Date = new Date(currentDate + numMinutes * 60000);
            PushSalesObject(newSalesObject);
            //console.log(newSalesObject);
        }
    });

    document.getElementById("buttonCreate").addEventListener("click", function() {
        let storeObject = new SalesObject;
        document.getElementById("p1").innerHTML = storeObject.StoreID;
        document.getElementById("p2").innerHTML = storeObject.SalesPersonID;
        document.getElementById("p3").innerHTML = storeObject.CdID;
        document.getElementById("p4").innerHTML = storeObject.PricePaid;
        document.getElementById("p5").innerHTML = storeObject.Date;
    });
});
  
// end of wait until document has loaded event  *************************************************************************

function fillULTopSales(data) {
    orderArray = data;
    console.log(orderArray);
    var orderList = document.getElementById("divOrderList");
    while (orderList.firstChild) {
        orderList.removeChild(orderList.firstChild);
    };

    var ul = document.createElement('ul');
    var li = document.createElement('li');
    li.innerHTML = "Sales Person ID: " + orderArray[0]._id + ". Total Sales (Price Paid): $" + orderArray[0].total;
    ul.appendChild(li);
    orderList.appendChild(ul);
}

function fillULTotalCDSold(data) {
    cdArray = data;
    console.log(cdArray);
    var cdList = document.getElementById("divCDList");
    while (cdList.firstChild) {
        cdList.removeChild(cdList.firstChild);
    };

    var ul = document.createElement('ul');
    var li = document.createElement('li');
    li.innerHTML = "Total CDs sold on 14th of April 2022: " + cdArray.length;
    ul.appendChild(li);

    cdList.appendChild(ul);
}

function PushSalesObject(pSalesObject) {
    fetch('/AddSales', {
        method: "POST",
        body: JSON.stringify(pSalesObject),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json()) 
        .then(json => console.log(json),
        )
        .catch(err => console.log(err));
};