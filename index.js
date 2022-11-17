//global data
let financeData = {
    expenses: [],
    incomes: [],
    totalIncomes: function () {
        let inc = 0;
        for (let x of this.incomes){
            inc+=Number(x.value);
        }
        return inc;
    },
    totalExpenses: function () {
        let exp = 0;
        for (let x of this.expenses){
            exp+=Number(x.value);
        }
        return exp;
    }
}

//functions
function changeTopText () {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];   
    let today = new Date();
    let text = `Available budget in ${months[today.getMonth()]} ${today.getFullYear()}`;
    document.querySelector("#currentMonth").innerHTML = text;
}

function addElement (a, b) {
    let child = document.createElement(b);
    document.querySelector(a).appendChild(child);
}

function addClass (a, b) {
    document.querySelector(a).classList=b;
}

function addAttribute (a, b, c) {
    document.querySelector(a).setAttribute(b, c);
}

function addText (b, c) {
    let text = document.createTextNode(c);
    document.querySelector(b).appendChild(text);
}

function getInput (){
    let arr = [];
    arr[0] = document.getElementById("newEntryType");
    arr[1] = document.getElementById("newEntryDescription");
    arr[2] = document.getElementById("newEntryValue");
    return arr;
}

function getButton () {
    return document.querySelector("#addNewButton");
}

function checkValidity () {
    testMarker = getInput();
    button = getButton();
    if ((testMarker[0].value!="") &&(testMarker[1].value!="") && (testMarker[2].value>0)){
        button.value = "submit";
        button.disabled = false;
        return (true);
    } else {
        button.value="fill all data";
        button.disabled = true;
        return (false);
    }
}

function fill() {
    let inputs = getInput();
    let budget = {
        description: inputs[1].value,
        value: Number(inputs[2].value),
        date: new Date()
    }
    if (inputs[0].value>0) {        
        financeData.incomes.push(budget);
        printIncomes();
    } else {
        financeData.expenses.push(budget);
        printExpenses(); 
    }
    localStorage.clear();
    localStorage.setItem("incomes", JSON.stringify(financeData.incomes));
    localStorage.setItem("expenses", JSON.stringify(financeData.expenses));
}

function resetAll(){
    localStorage.clear();
    financeData = {
        expenses: [],
        incomes: [],
    }
    location.reload();
}

function formatNumber (a){
    let tmp = Number(a).toLocaleString('en-US', { minimumFractionDigits : 2, maximumFractionDigits : 2});
    return `${tmp}`;
}

function getFracNumber (data) {
    let frac = 100*Number(data.value)/(financeData.totalExpenses());
    return Number(frac).toFixed(1);
}

function updateTotals (){
    let tmp = financeData.totalIncomes()-financeData.totalExpenses();
    if (tmp>=0) {
        document.querySelector(".monthBalance").innerText="+"+formatNumber(tmp);
    } else {
        document.querySelector(".monthBalance").innerText=formatNumber(tmp);
    }
    document.querySelector(".incomeSum").innerText="+"+formatNumber(financeData.totalIncomes());
    document.querySelector(".expensesSum").innerText="-"+formatNumber(financeData.totalExpenses());
    let tmp2 = 100*(financeData.totalExpenses()/financeData.totalIncomes());
    if (tmp2) {
        document.querySelector(".totExpFrac .totFrac").innerText=Number(tmp2).toFixed(1)+"%";
    } else document.querySelector(".totExpFrac .totFrac").innerText="";
}

function printIncomes () {
    document.querySelector(".incTable").innerHTML="";
    addElement(".incTable","tr");
    addElement(".incTable tr","th");
    addClass(".incTable th", "blue");
    addAttribute(".incTable th", "colspan", 2);
    addText(".incTable th", "Incomes");
    for (incomeElement of financeData.incomes){
        addElement(".incTable", "tr");
        addElement(".incTable tr:last-of-type", "td");
        addClass(".incTable tr:last-of-type td:last-of-type", "oldIncDsc green");
        addText(".incTable tr:last-of-type td:last-of-type", incomeElement.description);  
        addElement(".incTable tr:last-of-type", "td");
        addClass(".incTable tr:last-of-type td:last-of-type", "oldIncVal blue");
        addText(".incTable tr:last-of-type td:last-of-type", "+"+formatNumber(incomeElement.value));
    }
    updateTotals();
}

function printExpenses () {
    document.querySelector(".expTable").innerHTML="";
    addElement(".expTable","tr");
    addElement(".expTable tr","th");
    addClass(".expTable th", "red");
    addAttribute(".expTable th", "colspan", 3);
    addText(".expTable th", "Expenses");
    for (expensesElement of financeData.expenses){
        addElement(".expTable", "tr");
        addElement(".expTable tr:last-of-type", "td");
        addClass(".expTable tr:last-of-type td:last-of-type", "oldExpDsc green");
        addText(".expTable tr:last-of-type td:last-of-type", expensesElement.description);  
        addElement(".expTable tr:last-of-type", "td");
        addClass(".expTable tr:last-of-type td:last-of-type", "oldExpVal red");
        addText(".expTable tr:last-of-type td:last-of-type", "-"+formatNumber(expensesElement.value));
        addElement(".expTable tr:last-of-type", "td");
        addClass(".expTable tr:last-of-type td:last-of-type", "oldExpFrac red");
        addElement(".expTable tr:last-of-type td:last-of-type", "div");
        addClass(".expTable tr:last-of-type div", "oldFrac");
        addText(".expTable tr:last-of-type div", getFracNumber(expensesElement)+"%");
    }
    updateTotals();
}