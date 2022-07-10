//STORAGE
//check if sessionStorage exist
if (typeof(Storage) !== "undefined") {
    //if exist, get stored data
    if (sessionStorage.tenantAccounts && sessionStorage.tenantBills) {
        var bills = JSON.parse(sessionStorage.tenantBills);
        var account = JSON.parse(sessionStorage.tenantAccounts);
        var cred = JSON.parse(sessionStorage.tenantCred);
        var his = JSON.parse(sessionStorage.tenantHis);
        var allunits = JSON.parse(sessionStorage.tenantUnits);
        //alert(account);
    }
    //if doesnt exist, create empty objects
    else {
        var bills = {};
        var account = [];
        var cred = [["landlord","2022-01-07","L"]];
        var his = [];
        var allunits = ['1','2','3','4','5','6','7','8','9','10'];
    }
}
var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var tempArr2 = [];

document.getElementById('avunits').innerHTML = "Available Units: " + allunits;

//alert(account);
//LOGIN
function validate() {
    //get username and birthday
    var username = document.getElementById("user").value;
    var password = document.getElementById("bday").value;
    //search for username and password
    let pointer = cred.length;
    var response = "Wrong Usename or Birthday";
    for (let x = 0; x < pointer; x++) {
        let u = cred[x][0];
        let p = cred[x][1];
        let t = cred[x][2];
        //check if landlord or tenant, then go to home
        if (username == u && password == p) {
            if (t == "L") {
                window.location.href = '/home/';
                response = "Welcome back, Landlord!"
                break;
            } else if (t != "L") {
                sessionStorage.row = t - 1;
                let r = sessionStorage.row;
                window.location.href = '/tenant/';
                response = "Wecome Back," + " " +account[r][0] + "!";
                
                break;
            }
        }
            
    }
    alert(response);
}


//LANDLORD REGISTRATION
function land_reg() {
    window.location.href = "/Logbook/reglandlord/";
}
//landlord reg to login
function gotologin() {
    window.location.href = "/Logbook/";
}
//NEW TENANT CONFIRMATION di ko mapagana
function confirm_new() {
    if (confirm("Add a New Tenant")) {
        document.getElementById("add_new").submit;
    }
}
//LOGOUT
function logout() {
    if (confirm("Logout?")) {
        window.location.href = "/Logbook/logout/";
        /*window.location.href = "/Logbook/";*/
    }
}
//REGISTER
function gotomain(){
    if (confirm("Done?")) {
        window.location.href = "/Logbook/home";
    }
}
function addmore(){
    if (confirm("Add another tenant?")) {
        window.location.href = "/Logbook/addtenant";
    }
}
function backtoadd(){
    history.back();
}

function dataGetter() {
    //get name
    let fname = document.getElementById("firstname").value;
    let sname = document.getElementById("surname").value;
    //get gender
    let gen = document.getElementsByName("option");
    for (let x = 0; x < gen.length; x++) {
        if (gen[x].checked) {
            var gender = gen[x].value;
            break
        }
    }
    let name = fname+" "+sname;
    //get other data
    let bday = document.getElementById("bday").value;
    let occu = document.getElementById("occupation").value;
    let con = document.getElementById("no.").value;
    let email = document.getElementById("email").value;
    let unit = document.getElementById("unit").value;
    let ptype = document.getElementById("prop").value;
    let tenantId = account.length + 1;
    //store temporarily
    const acc = []
    const temptCred = []
    acc[0] = name;
    acc[1] = gender;
    acc[2] = bday;
    acc[3] = occu;
    acc[4] = con;
    acc[5] = email;
    acc[6] = unit;
    acc[7] = ptype;
    acc[8] = tenantId;
    if (acc.includes("")) {
        alert("Please Complete the Form");
        return
    }
    if (allunits.includes(unit)) {
    if (confirm("Add Tenant?")) {
    temptCred[0] = sname.toUpperCase();
    temptCred[1] = bday;
    temptCred[2] = tenantId;
    //remove unit from available
    for (let i = 0; i < allunits.length; i++) {
        if (unit == allunits[i]) {
            allunits.splice(i,1);
        }
    }
    //create history if new tenant
    if (document.getElementById('check').checked == false) {
        let dt = new Date();
        let dy = dt.getDate();
        let yr = dt.getFullYear();
        let mnth = months[dt.getMonth()];
        let date =  mnth+" "+yr;
        let dateToday = dy+" "+mnth+" "+yr; 
        let hisID = his.length + 1;
        if (ptype == '1 Bedroom') {
            var price = 5000;
        } else {
            var price = 8000;
        }
        const tempHis1 = [];
        tempHis1[0] = dateToday;
        tempHis1[1] = date;
        tempHis1[2] = price;
        tempHis1[3] = unit;
        tempHis1[4] = name;
        tempHis1[5] = ptype;
        tempHis1[6] = tenantId;
        tempHis1[7] = hisID;
        //store to 2d array
        his.push(tempHis1);
    }
    //store to main storage and sessionStorage
    cred.push(temptCred);
    account.push(acc);
    bills[tenantId] = tempArr2;
    //alert(bills);
    const strBills = JSON.stringify(bills);
    const strAccount = JSON.stringify(account);
    const strCred = JSON.stringify(cred);
    const strHis = JSON.stringify(his);
    const strUnits = JSON.stringify(allunits);
    sessionStorage.tenantBills = strBills;
    sessionStorage.tenantAccounts = strAccount;
    sessionStorage.tenantCred = strCred;
    sessionStorage.tenantHis = strHis;
    sessionStorage.tenantUnits = strUnits;
    alert('New Tenant: '+name);
    }
    } else {
        alert("Unit Not Available");
    }
}

//create bill info
function billCompiler() {
    //get bill data
    let dt = document.getElementById("payfor").value;
    let amt = document.getElementById("amnt").value;
    
    console.log(dt);
    if (dt != "" && amt != "") {
        for (let x = 0; x < tempArr2.length; x++) {
            if (tempArr2[x][0] == dt) {
                
                var has = 'true';
                break;
            }
        }
        console.log(has);
        if (has != 'true') {
            let a = parseInt(amt);
            //store to array
            const tempArr1 = [];
            tempArr1[0] = dt;
            tempArr1[1] = a;
            //store to 2d array
            tempArr2.push(tempArr1);
            //refresh table
            tableRefresher()
        } else {
            alert('Date was added');
        }
    } else {
        alert("Must Select a Date and Amount");
    }
    
}
function tableRefresher() {
    //refresh table
    let table = document.getElementById("billTable");
    let len = tempArr2.length;
    //remove all rows
    while(table.hasChildNodes())
    {
    table.removeChild(table.firstChild);
    }
    for (let n = 0; n < len; n++) {
        //add row
        let row = table.insertRow();
        //add table cells
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        cell1.innerHTML = tempArr2[n][0];
        cell2.innerHTML = tempArr2[n][1];
        //add onclick
        document.getElementsByTagName("tr")[n+1].setAttribute("onclick", "billRemover(this)");
    }
}
//this function can remove a bill
function billRemover(x) {
    let idx = x.rowIndex-1;
    //let idx = x.rowIndex;
    if (confirm("Remove this bill?")) {
        tempArr2.splice(idx, 1);
        //alert(tempArr2);
        tableRefresher()
      }
}
//this function can disable and enable the adding of bills
function existingTenant() {
    if (document.getElementById('check').checked == true) {
        document.getElementById("forExisting").disabled=false;
    } else {
        if (confirm("Disable Tenant?")) {
            tempArr2.splice(0, tempArr2.length);
            tableRefresher()
            document.getElementById("forExisting").disabled=true;
          }
    }
}
//bmain
    //this function can filter the table
    function tableFilter() {
    var input, filter, table, tr, td, i, txtValue, tester,x;
    input = document.getElementById("find");
    filter = input.value.toUpperCase();
    table = document.getElementById("tenants");
    tr = table.getElementsByTagName("tr");
    tester=filter*0;
    if (tester==0) {x=1;}
    else {x=0;}
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[x];
        if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
        }       
    }
}
//sort
function tableSort(sorting) {
    let sort = sorting;
    console.log(sort);
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("tenants");
    switching = true;
    while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[sort];
        y = rows[i + 1].getElementsByTagName("TD")[sort];
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      } 
    }
  }
//sort
function tableSelect(x) {
    console.log(x);
    if (x == "Name") {
        var sorting = 0;
    } else if (x == "Unit") {
        var sorting = 1;
    } else if (x == "Balance") {
        var sorting = 2;
    }tableSort(sorting)
}
//PAYMENT
//django
function billChecker() {
    let billBal = document.getElementById("myVar").value;
    if (billBal==5000 || billBal==8000) {
        document.getElementById("p").disabled=false;
    } else if (billBal==4000 || billBal==2500) {
        document.getElementById("p").disabled=true;
    }
    /*document.getElementById("id_balance").disabled=true;*/
}
function fullPayment() {
    let Bal = document.getElementById("myVar").value;
    document.getElementById("amount").value = Bal;
    document.getElementById("id_balance").value = 0;
}
function partialPayment() {
    let billBal = document.getElementById("myVar").value;
    let par = billBal/2;
    document.getElementById("amount").value = par;
    document.getElementById("id_balance").value = par;
}
//show tenant info
function change() {
    let r = sessionStorage.row;
    let name = account[r][0];
    let unit = account[r][6];
    let type = account[r][7];
    let id = account[r][8];
    document.getElementById("name").value = name;
    document.getElementById("unit").value = unit;
    document.getElementById("prop").value = type;
    let bill = bills[id];
    //alert(typeof(bill));
    //add table data
    let table = document.getElementById('payTable');
    for (let i = 0; i < bill.length; i++) {
        //insert row
        let x = table.insertRow();
        //insert cell
        let cell1 = x.insertCell(0);
        let cell2 = x.insertCell(1);
        cell1.innerHTML = bill[i][0];
        cell2.innerHTML = bill[i][1];
        document.getElementsByTagName("tr")[i+1].setAttribute("onclick", "paymentGetter(this)");
    }
}

function historyCreator(p1,p2,p3,p4,p5) {
    //create history
    let r = sessionStorage.row;
    let dt = new Date();
    let dy = dt.getDate();
    let yr = dt.getFullYear();
    let mnth = months[dt.getMonth()];
    let dateToday = dy+" "+mnth+" "+yr;
    const arrDate = p1.split("-");
    let date = months[parseInt(arrDate[1]-1)]+" "+arrDate[0];
    let tenantId = account[r][8];
    let hisID = his.length + 1;
    let billID = bills[tenantId];
    const tempHis1 = [];
    tempHis1[0] = dateToday;
    tempHis1[1] = date;
    tempHis1[2] = p2;
    tempHis1[3] = p3;
    tempHis1[4] = p4;
    tempHis1[5] = p5;
    tempHis1[6] = tenantId;
    tempHis1[7] = hisID;
    //save history
    his.push(tempHis1);
    const strHis = JSON.stringify(his);
    sessionStorage.tenantHis = strHis;
    //update bills
    const strBills = JSON.stringify(bills);
    sessionStorage.tenantBills = strBills;
    window.location.href = "/payment/";
    alert(tenantId);
}

//PROFILE
    /*tooltip
    $(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip();   
      });*/
      function editenable() {/*can edit the form*/
          document.getElementById("editform").disabled=false;
      }
      function editdisable() {/*can't edit the form*/
          document.getElementById("editform").disabled=true;
      }

//TENANT

function displayTenantinfo() {
    let r = sessionStorage.row;
    let name = account[r][0];
    let gender = account[r][1];
    let bday = account[r][2];
    let occu = account[r][3];
    let con = account[r][4];
    let email = account[r][5];
    let unit = account[r][6];
    let ptype = account[r][7];

    document.getElementById("headers").textContent = "Hello";

    if (gender == "male"){
        document.getElementById("gen").value = "Male"
    }
    else{
        document.getElementById("gen").value = "Female"
    }
    document.getElementById("fullname").value = name;
    document.getElementById("bday").value = bday;
    document.getElementById("occupation").value = occu;
    document.getElementById("no.").value = con;
    document.getElementById("email").value = email;
    document.getElementById("unitno.").value = unit;
    document.getElementById("prop").value = ptype;

    let id = account[r][8];
    let bill = bills[id];
    //alert(typeof(bill));
    //add table data
    let table = document.getElementById('tenantbill');
    for (let i = 0; i < bill.length; i++) {
        //insert row
        let x = table.insertRow();
        //insert cell
        let cell1 = x.insertCell(0);
        let cell2 = x.insertCell(1);
        cell1.innerHTML = bill[i][0];
        cell2.innerHTML = bill[i][1];

    }
    const tempHis2 = [];
    let histable = document.getElementById("tenanthis");
    let x = his[r][6];
    let len = his.length;
    for (let y = 0; y<len; y++){
        if(his[y][6] == x){
            tempHis2.push(his[y]);

        }
    }

    let leng = tempHis2.length;
    for (let n = 0; n<leng; n++) {
        //add row
        let row = histable.insertRow();
        //add table cells
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        
        cell1.innerHTML = tempHis2[n][0];
        cell2.innerHTML = tempHis2[n][1];
        cell3.innerHTML = tempHis2[n][2];
        cell4.innerHTML = '<a href="r.pdf">'+'RECEIPT'+'</a>';
        cell4.target = "_blank";
        document.getElementsByTagName("a")[n+1].setAttribute("target", "-");
    }
}

    /*click profile*/
    function clickProf() {
        var c = document.getElementById("btnProf").getAttribute("value");
        if (c=="Show Profile") {
            document.getElementById("btnProf").value="Hide Profile";
        } else if (c!="Show Profile") {
            document.getElementById("btnProf").value="Show Profile";
        }  
    }
    /*click bills*/
    function clickBills() {
        var c = document.getElementById("btnBills").getAttribute("value");
        if (c=="Show Bills") {
            document.getElementById("btnBills").value="Hide Bills";
        } else if (c!="Show Bills") {
            document.getElementById("btnBills").value="Show Bills";
        }  
    }
    /*click history*/
    function clickHis() {
        var c = document.getElementById("btnHis").getAttribute("value");
        if (c=="Show History") {
            document.getElementById("btnHis").value="Hide History";
        } else if (c!="Show History") {
            document.getElementById("btnHis").value="Show History";
        }  
    }
//PROFILE
    function profadder() {
        var tables = document.getElementById("proftableID");
        let len = account.length;
        for (let n = 0; n<len; n++) {
            //add row
            let row = tables.insertRow();
            //add table cells
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            cell1.innerHTML = account[n][0];
            cell2.innerHTML = account[n][6];
            //add onclick
            document.getElementsByTagName("tr")[n+1].setAttribute("onclick", "rowGetter(this)");
            
        }
    }

    function displayProf() {
        let r = sessionStorage.row;
        let name = account[r][0];
        let gender = account[r][1];
        let bday = account[r][2];
        let occu = account[r][3];
        let con = account[r][4];
        let email = account[r][5];
        let unit = account[r][6];
        let ptype = account[r][7];

        if (gender == "male"){
            document.getElementById("gen").value = "Male"
        }
        else{
            document.getElementById("gen").value = "Female"
        }
        document.getElementById("fullname").value = name;
        document.getElementById("bday").value = bday;
        document.getElementById("occupation").value = occu;
        document.getElementById("no.").value = con;
        document.getElementById("email").value = email;
        document.getElementById("unitno.").value = unit;
        document.getElementById("prop").value = ptype;
    }

    function editProf(){
        //get data
        let r = sessionStorage.row;
        let name = document.getElementById("fullname").value;
        let gender = document.getElementById("gen").value;
        let bday = document.getElementById("bday").value;
        let occu = document.getElementById("occupation").value;
        let con = document.getElementById("no.").value;
        let email = document.getElementById("email").value;
        let unit = document.getElementById("unitno.").value;
        let ptype = document.getElementById("prop").value;
        if (confirm("Save?")) {
        //exchange units
        if (unit != account[r][6]) {
            if (allunits.includes(unit)) {
            allunits.push(account[r][6]);
            for (let i = 0; i < allunits.length; i++) {
                if (unit == allunits[i]) {
                    allunits.splice(i,1);
                }
            } 
            } else {
                return
            }
            }
        //save new details to array
        account[r][0] = name;
        account[r][1] = gender;
        account[r][2] = bday;
        account[r][3] = occu;
        account[r][4] = con;
        account[r][5] = email;
        account[r][6] = unit;
        account[r][7] = ptype;
        //update storage
        const strAccount = JSON.stringify(account);
        sessionStorage.tenantAccounts = strAccount;
        const strUnits = JSON.stringify(allunits);
        sessionStorage.tenantUnits = strUnits;
        window.location.href = "/profile/";
        }
    }

    function proftableref() {
        //refresh table
        let proftable = document.getElementById("proftableID");
        let len = account.length;
        //remove all rows
        while(proftable.hasChildNodes())
        {
            proftable.removeChild(proftable.firstChild);
        }
        for (let n = 0; n < len; n++) {
            //add row
            let row = proftable.insertRow();
            //add table cells
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            cell1.innerHTML = account[n][0];
            cell2.innerHTML = account[n][6];
            //add onclick
            
            document.getElementsByTagName("tr")[n+1].setAttribute("onclick", "rowGetter(this)");
        }
    }

    function removeProf(x) {
        let idx = sessionStorage.row;
        if (confirm("Remove "+account[idx][0]+"?")) {
            if (confirm("YOU CAN'T RESTORE AFTER REMOVING, CONTINUE?")) {
                allunits.push(account[idx][6]);
                delete bills[account[idx][8]];
                account.splice(idx, 1);
                const strAccount = JSON.stringify(account);
                sessionStorage.tenantAccounts = strAccount;
                const strBills = JSON.stringify(bills);
                sessionStorage.tenantBills = strBills;
                const strUnits = JSON.stringify(allunits);
                sessionStorage.tenantUnits = strUnits;
                window.location.href = "/profile";
            }
        }
    }

//HISTORY
function viewHistory() {
    let table = document.getElementById("tableHistory");
    let len = his.length;
    for (let n = 0; n<len; n++) {
        //add row
        let row = table.insertRow();
        //add table cells
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        cell1.innerHTML = his[n][1];
        cell2.innerHTML = his[n][2];
        cell3.innerHTML = his[n][3];
        cell4.innerHTML = his[n][4];
        cell5.innerHTML = '<a href="/receipt/">'+'RECEIPT'+'</a>';
        cell5.target = "_blank";
        document.getElementsByTagName("a")[n+1].setAttribute("target", "_blank");
        document.getElementsByTagName("tr")[n+1].setAttribute("onclick", "rowGetter(this)");
    }
}
function historyFilter() {
    let input, filter, table, tr, td, i, txtValue, tester,x;
    input = document.getElementById("find");
    filter = input.value.toUpperCase();
    table = document.getElementById("hisTable");
    tr = table.getElementsByTagName("tr");
    tester=filter*0;
    if (tester==0) {x=2;}
    else {x=3;}
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[x];
        if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
        }       
    }
}
//modified TABLE SORTERS
//filter
function historySort(sorter) {
    let sort = sorter;
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("hisTable");
    switching = true;
    while (switching) {
      switching = false;
      rows = table.rows;
      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[sort];
        y = rows[i + 1].getElementsByTagName("TD")[sort];
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }
//sort
function sorterSelect(x) {
    console.log(x);
    if (x == "Date") {
        var sorter = 0;
    } else if (x == "Amount") {
        var sorter = 1;
    } else if (x == "Unit") {
        var sorter = 2;
    } else if (x == "Name") {
        var sorter = 3;
    }
    historySort(sorter)
}
//date select
function dateChanger() {
    let date = document.getElementById("mselect").value;
    let arrDate = date.split("-");
    if (date == "") {
        var ndate = " ";
    } else {
        var ndate = months[parseInt(arrDate[1]-1)]+" "+arrDate[0];
        var mon = arrDate[0];
    }
    let filter, table, tr, td, i, txtValue;
    filter = ndate.toUpperCase();
    table = document.getElementById("hisTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
        }       
    }
    incomeGetter(ndate, mon, months[parseInt(arrDate[1]-1)])
}

//INCOME
function incomeGetter(ndate, mon, m) {
    alert(ndate);
    var totalMonth = 0;
    var totalYear = 0;
    if (ndate == " ") {
        totalMonth = "Please Select a Month";
        totalYear = "Please Select a Year";
    } else {
        for (let i = 0; i < his.length; i++) {
            if (his[i][1] == ndate) {
                totalMonth += his[i][2];
            }
            const arrDate = his[i][1].split(" ");
            if (arrDate[1] == mon) {
                totalYear += his[i][2];
            }
        }
    }
    document.getElementById('forM').innerHTML = 'Income for '+m+' = '+totalMonth;
    document.getElementById('forY').innerHTML = 'Income for '+mon+' = '+totalYear;
    console.log(totalMonth);
    console.log(totalYear);
}
    
//receipt
function showReceipt(){
    let r = sessionStorage.row;
    let id = his[r][6];
    document.getElementById("receiptnum").textContent = "Receipt #" + id;
    document.getElementById('rectenantID').textContent = his[r][7];
    document.getElementById('recname').textContent = his[r][4];
    document.getElementById('recunit').textContent = his[r][3];
    document.getElementById('recprop').textContent = his[r][5];

    document.getElementById('recbillID').textContent = his[r][7];
    document.getElementById('recdate').textContent = his[r][0];
    document.getElementById('recpayfor').textContent = his[r][1];
    document.getElementById('recamount').textContent = his[r][2];
    
 
}
//Units
function showUnits(){
    alert("Available Units: " + allunits);

}


/*
REFERECES
TABLE FILTERS = https://www.w3schools.com/howto/howto_js_filter_table.asp
TABLE SORTERS = https://www.w3schools.com/howto/howto_js_sort_table.asp
*/


/*
var arr=[
    ["Bautista","2","5000"],
    ["Baybay","3","2500"],
    ["Tiagan","1","8000"],
    ["name",'unit','balance'],
    ["Bautista","2","5000"],
    ["Baybay","3","2500"],
    ["Tiagan","1","8000"],
    ["name",'unit','balance'],
    ["Bautista","2","5000"],
    ["Baybay","3","2500"],
    ["Tiagan","1","8000"],
    ["name",'unit','balance'],
    ["Bautista","2","5000"],
    ["Baybay","3","2500"],
    ["Tiagan","1","8000"],
    ["name",'unit','balance'],
    ["Bautista","2","5000"],
    ["Baybay","3","2500"],
    ["Tiagan","1","8000"],
    ["name",'unit','balance'],
    ["Bautista","2","5000"],
    ["Baybay","3","2500"],
    ["Tiagan","1","8000"],
    ["name",'unit','balance'],
    ["Bautista","2","5000"],
    ["Baybay","3","2500"],
    ["Tiagan","1","8000"],
    ["name",'unit','balance'],
    ["Bautista","2","5000"],
    ["Baybay","3","2500"],
    ["Tiagan","1","8000"],
    ["name",'unit','balance'],
    ["Bautista","2","5000"],
    ["Baybay","3","2500"],
    ["Tiagan","1","8000"],
    ["name",'unit','balance'],
    ["LAST","LAST","LAST"]
    ];
<!DOCTYPE html>
<html>
<head>
<script>
function clickCounter() {
  if (typeof(Storage) !== "undefined") {
    if (sessionStorage.clickcount) {
      alert(sessionStorage.clickcount);
      var obj = JSON.parse(sessionStorage.clickcount);
      alert(obj);
    } else {
    const arr = {
		a:{
			name:"jake",
			unit: "2",
			bills:{
				"Jan 2021":5000,
				"Feb 2021":5000
				}
		}
	}
	const strOBJ = JSON.stringify(arr);
      sessionStorage.clickcount = strOBJ;
    }
    document.getElementById("result").innerHTML = "You have clicked the button " + sessionStorage.clickcount + " time(s) in this session.";
  } else {
    document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
  }
}
</script>
</head>
<body>
<p><button onclick="clickCounter()" type="button">Click me!</button></p>
<div id="result"></div>
<p>Click the button to see the counter increase.</p>
<p>Close the browser tab (or window), and try again, and the counter is reset.</p>
</body>
</html>
    */