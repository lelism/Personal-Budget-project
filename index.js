//--------------------------------------------------------------
//      variable assignments for key HTML elements and inputs
//--------------------------------------------------------------
const newEntryType = document.getElementById("newEntryType");
const newEntryDescription = document.getElementById("newEntryDescription");
const newEntryValue = document.getElementById("newEntryValue");
const inputs = [newEntryType, newEntryDescription, newEntryValue];
const submitButton = document.querySelector("#addNewButton");
const resetButton = document.getElementById("resetButton");
const monthBalance = document.querySelector(".monthBalance");
const incomeSum = document.querySelector(".incomeSum");
const expensesSum = document.querySelector(".expensesSum");
const expensesFrac = document.querySelector(".totExpFrac .totFrac");
const incomesTable = document.querySelector("#incBody");
const expensesTable = document.querySelector("#expBody");


//-----------------------------
//      global variables
//-----------------------------
let financeData = {
    expenses: [],
    incomes: [],
    totalIncomes: function () {
        let inc = 0;
        this.incomes.forEach(el => inc+=el.value);
        return inc;
    },
    totalExpenses: function () {
        let exp = 0;
        this.expenses.forEach(el => exp+=el.value);
        return exp;
    }
}


//-------------------------------
//      functions
//-------------------------------
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

function updateTotals (){
    let balance = financeData.totalIncomes()-financeData.totalExpenses();
    if (balance>=0) {
        monthBalance.innerText="+"+formatNumber(balance);
    } else {
        monthBalance.innerText=formatNumber(balance);
    }
    incomeSum.innerText="+"+formatNumber(financeData.totalIncomes());
    expensesSum.innerText="-"+formatNumber(financeData.totalExpenses());
    let incExpRatio = 100*(financeData.totalExpenses()/financeData.totalIncomes());
    if (incExpRatio) {
        expensesFrac.innerText=Number(incExpRatio).toFixed(1)+"%";
    } else expensesFrac.innerText="";
}

function checkValidity () {
    if ((inputs[0].value!="") && (inputs[1].value!="") && (inputs[2].value > 0)){
        submitButton.value = "submit";
        submitButton.disabled = false;
        return true;
    } else {
        submitButton.value="fill all data";
        submitButton.disabled = true;
        return false;
    }
}

function fill() {
    let budget = {
        description: inputs[1].value,
        value: Number(inputs[2].value),
        date: new Date()
    }
    if (inputs[0].value > 0) {        
        financeData.incomes.push(budget);
        printIncomes(budget);
    } else {
        financeData.expenses.push(budget);
        printExpenses(budget); 
        refeshExpFraction()
    }
    inputs.forEach(el => el.value = "");
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
    inputs.forEach(el => el.value = "");
    location.reload();
}

function formatNumber (nmb){
    let stringNum = Number(nmb).toLocaleString('en-US', { minimumFractionDigits : 2, maximumFractionDigits : 2});
    return stringNum;
}

function refreshTable(){
    incomesTable.innerHTML="";
    expensesTable.innerHTML="";
    financeData.incomes.forEach(item => printIncomes(item));
    financeData.expenses.forEach(item => printExpenses(item));
    refeshExpFraction();
}

function refeshExpFraction(){
    let i = 0;
    let selector="";
    let totExpSum= financeData.totalExpenses();
    financeData.expenses.forEach(expItem => {
        selector=`#expBody tr:nth-of-type(${i+1}) div`;
        document.querySelector(selector).innerText="";
        let frac = 100*Number(expItem.value)/totExpSum;
        let fractionStr = document.createTextNode(Number(frac).toFixed(1)+"%");
        document.querySelector(selector).appendChild(fractionStr);
        i++;
    });
}

function printIncomes (singleItem) {
    let trow = 
        `<tr>
            <td class="oldDsc green">${singleItem.description}</td>
            <td class="oldVal blue">-${formatNumber(singleItem.value)}</td>
        </tr>`;
    incomesTable.innerHTML+=trow;
    updateTotals();
}

function printExpenses (singleItem) {
    let trow = 
        `<tr>
            <td class="oldDsc green">${singleItem.description}</td>
            <td class="oldVal red">-${formatNumber(singleItem.value)}</td>
            <td class="oldExpFrac red"><div class="oldFrac"></div></td>  
        </tr>`;
    expensesTable.innerHTML+=trow;
    updateTotals();
}

function init() {
    if (localStorage.length>0) {
        financeData.incomes = JSON.parse(localStorage.incomes);
        financeData.expenses = JSON.parse(localStorage.expenses);
    }
    changeTopText();
    updateTotals();
    refreshTable();
    checkValidity();
    inputs.forEach(el => el.addEventListener("input", checkValidity));
    submitButton.addEventListener("click", fill);
    resetButton.addEventListener("click", resetAll);
}


//-------------------------------
//      initialise app
//-------------------------------
init();

