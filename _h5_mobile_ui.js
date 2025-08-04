/**
 *@author Habit 5 Business Services LLC
 * @todo Contact support@habit5.com for questions
 * @summary All of the functionality for the capitol coffee html template
 * @description functions for buttons and different css attributes
 **/
$(document).ready(function () {
    require(
        ['N/url',
            'N/search',
            'N/runtime',
            'N/ui/dialog',
            'N/https',
            'N/http',
            'N/ui/message',
            'N/record'
        ]);
    $('[data-toggle="tooltip"]').tooltip();
});

function loadModules() {
    return {
        "url": require('N/url'),
        "search": require('N/search'),
        "runtime": require('N/runtime'),
        "dialog": require('N/ui/dialog'),
        "https": require('N/https'),
        "http": require('N/http'),
        "message": require('N/ui/message'),
        "record": require('N/record')
    };
}


/****************************************************** Set Instance *******************************************************************/

let instance = "922659" //"6682797-sb1"
let instance2 = "922659" //"6682797_SB1"

/****************************************************** Global Variables *******************************************************************/
let pageContainer = document.getElementById('pagecontainer');
let employeeName = '';
let employeeInternalId;
let employeeLocation;
let shipmentData = [];
let specificCaseData = [];
let caseCommentArr = [];
let caseStatusArr = [];
let shipId
let shipmentId

/****************************************************** LOGOUT *******************************************************************/

function logOut(){
    let ns = loadModules();
    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    let url = rec.getValue("custrecord_h5_sl_render_mobile_login_url")

    //_h5_sl_render_mobile_login
    location.replace(url)
}

/****************************************************** LOGIN *******************************************************************/

function loginSpin(){
    $("#loginbuttontext").hide('fast');
    $("#loginspinner").show('fast');
    $("#loginbutton").animate({ width: '-=100px !important' }, 300);
    setTimeout(loginAuthorization, 700)
}
function loginAuthorization() {

    ///////////ERROR HANDLING
    let emailError = document.getElementById('incorrectemail');
    let emailBox = document.getElementById('emailbox');
    let emailLogo = document.getElementById('emaillogo');
    let passwordError = document.getElementById('incorrectpassword');
    let passwordBox = document.getElementById('passwordbox');
    let passwordLogo = document.getElementById('passwordlogo');
    ////////////
    let untrimmedEmail = document.getElementById('email').value;
    let email = untrimmedEmail.trim();
    let untrimmedPassword = document.getElementById('password').value;
    let password = untrimmedPassword.trim();

    if(!Boolean(password)){
        $("#loginbuttontext").show('fast');
        $("#loginspinner").hide('fast');
        passwordError.style.display = 'block';
        passwordBox.style.border = '2px solid red';
        passwordLogo.style.color = 'red';
        return;
    }

    //Get Employee ID
    let objToSend = {
        email: email,
        password: password
    }
    let ns = loadModules()

    console.log("here")

    let headerObj = {
        name: "User-Agent",
        value: "Mozilla/5.0"
    };

    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    let url = rec.getValue("custrecord_h5_sl_validate_employee_url")

    //_h5_sl_validate_employee
    let response = ns.https.post({
        url:url,
        headers: headerObj,
        body: JSON.stringify(objToSend)
    });

    console.log(JSON.parse(response.body))
    let employeeData = JSON.parse(response.body);

    //Validation
    emailError.style.display = 'none';
    emailBox.style.border = '';
    emailLogo.style.color = 'white';
    passwordError.style.display = 'none';
    passwordBox.style.border = '';
    passwordLogo.style.color = 'white';
    if(response.body == '0'){
        $("#loginbuttontext").show('fast');
        $("#loginspinner").hide('fast');
        emailError.style.display = 'block';
        emailBox.style.border = '2px solid red';
        emailLogo.style.color = 'red';
        return;
    }else if(employeeData[0].password == '1'){
        $("#loginbuttontext").show('fast');
        $("#loginspinner").hide('fast');
        passwordError.style.display = 'block';
        passwordBox.style.border = '2px solid red';
        passwordLogo.style.color = 'red';
        return;
    }else {
        username = employeeData[0].name
        employeeId = employeeData[0].id
        locationId = employeeData[0].location
        console.log("employee location", locationId)
        console.log("employee internal id", employeeId)

        switchToMenu(locationId, employeeId)
    }
}

/****************************************************** MAIN MENU *******************************************************************/

//Opens the script _h5_render_mobile_menu
function switchToMenu(locationId, employeeId){
    console.log("switchToMenu 1:", employeeId + " | " + locationId)
    let ns = loadModules();
    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    let url = rec.getValue("custrecord_h5_sl_render_mobile_menu_url")
    //_h5_sl_render_mobile_menu
    location.replace(url + "&location=" + locationId + "&employee=" + employeeId)
}

function pickList(locationId, employeeId){
    let ns = loadModules();
    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    let url = rec.getValue("custrecord_h5_sl_render_pick_list_url")
    //_h5_sl_render_pick_list
    let shipmentListURL = url + "&location=" + locationId + "&employee=" + employeeId
    location.replace(shipmentListURL)
}

function printFromList(data, buttonId, label){

    let sendObj = {
        print: data
    }
    let headerObj = {
        name: "User-Agent",
        value: "Mozilla/5.0"
    };
    let ns = loadModules();
    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    let url = rec.getValue("custrecord_h5_sl_print_pick_ticket_url")
    //_h5_sl_print_pick_ticket
    let response = ns.https.post({
        url: url,
        body: JSON.stringify(sendObj),
        headers: headerObj
    })

    console.log(response)
    console.log("response", JSON.parse(response.body))
    if (JSON.parse(response.body).code == 201) {
        let message = JSON.parse(response.body).message

        // for(x=0; x<JSON.parse(response.body).link.length; x++){
        //     window.open(JSON.parse(response.body).link[x])
        // }
        // alert(message)
        document.getElementById(buttonId).innerHTML = label
    } else {
        let message = JSON.parse(response.body).message
        alert(message)
        document.getElementById(buttonId).innerHTML = label
    }
}


/**************************************************** Outbound *******************************************************************/

function outbound(shipId, locationId, employeeId){
    console.log("shipId", shipId)
    let ns = loadModules();
    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    let url = rec.getValue("custrecord_h5_sl_render_outbound_url")
    let shipmentListURL = url + "&location=" + locationId + "&employee=" + employeeId + "&shipmentId=" + shipId
    location.replace(shipmentListURL)
}

function rateShipment(rateObj){

    let headerObj = {
        name: "User-Agent",
        value: "Mozilla/5.0"
    };
    let ns = loadModules();
    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    let url = rec.getValue("custrecord_h5_sl_rates_all_url")
    //_h5_sl_rates_all
    let response = ns.https.post({
        url: url,
        body: JSON.stringify(rateObj),
        headers: headerObj
    })
    if (JSON.parse(response.body).code == 201) {
        let url = rec.getValue("custrecord_h5_sl_get_rate_passes_url")
        //_h5_sl_get_rate_passes
        let response = ns.https.post({
            url: url,
            body: JSON.stringify(rateObj),
            headers: headerObj
        })
        if (JSON.parse(response.body).code == 201) {
            document.getElementById("rateButton").innerHTML = 'Pack & Rate'
            addRateLines(JSON.parse(response.body).rates)
        }
    } else {
        let message = JSON.parse(response.body).message
        alert(message)
        document.getElementById("rateButton").innerHTML = 'Re-Rate'
        document.getElementById("saveButton").innerHTML = 'Save'
    }
}

function reserveRate(sendObj){

    let headerObj = {
        name: "User-Agent",
        value: "Mozilla/5.0"
    };
    let ns = loadModules();
    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    let url = rec.getValue("custrecord_h5_sl_reserve_rates_url")
    //_h5_sl_reserve_rates
    let response = ns.https.post({
        url: url,
        body: JSON.stringify(sendObj),
        headers: headerObj
    })
    if (JSON.parse(response.body).code == 201) {

    } else {
        let message = JSON.parse(response.body).message
        alert(message)
    }
}

function takePhotos(shipmentId, locationId, employeeId, root){

    console.log("ShipmentId | LocationId", shipmentId + " | " + locationId)
    let ns = loadModules();
    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    let url = rec.getValue("custrecord_h5_sl_render_ship_photo_url")
    //_h5_sl_render_shipment_photo
    let renderShipPhotoURL = url + "&shipmentId=" + shipmentId + '&employee=' + employeeId + '&location=' + locationId + '&root=' + root
    location.replace(renderShipPhotoURL)
}

function savePhoto(data, photoNum){
    console.log("Take Photo Button")

    let location = document.getElementById('locationID').innerHTML;
    let employee = document.getElementById('employeeID').innerHTML;
    let shipmentId = document.getElementById('shipRecID').innerHTML;

    let parameters = {
        dataFile: data,
        photoNum: photoNum,
        shipId: shipmentId,
        locationId: location,
        employeeId: employee
    }

    let headerObj = {
        name: "User-Agent",
        value: "Mozilla/5.0"
    };
    let ns = loadModules();
    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    let url = rec.getValue("custrecord_h5_sl_ship_photo_save_url")
    let photoSave = ns.https.post({
        url: url,
        body: JSON.stringify(parameters),
        headers: headerObj
    })

}

function takeMorePhotos(shipmentId, locationId, employeeId){
    console.log("ShipmentId | LocationId", shipmentId + " | " + locationId)
    let ns = loadModules();
    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    let url = rec.getValue("custrecord_h5_sl_render_photo_more_url")
    //_h5_sl_render_shipment_photo_more
    let renderShipPhotoURL = url + "&shipmentId=" + shipmentId + '&location=' + locationId + '&employeeId=' + employeeId
    location.replace(renderShipPhotoURL)
}

function deletePhotos(shipId){
    console.log("Delete Photo Button")
    console.log("shipId", shipId)

    let deleteDone = document.getElementById('deleted');
    let deleteActive = document.getElementById('delete');
    let canvas = document.getElementById('canvas');
    let snap = document.getElementById("snap");
    let snapRedo = document.getElementById("snapAgain");
    let cameraDiv = document.getElementById('cameraDiv');
    let ns = loadModules();

    let parameters = {
        shipId: shipId,
    }
    canvas.style.display = 'none';
    snapRedo.style.display = 'none';
    deleteActive.style.display = 'none';
    cameraDiv.style.display = 'block';
    snap.style.display = 'block';
    deleteDone.style.display = 'block';
    console.log(parameters)
    let headerObj = {
        name: "User-Agent",
        value: "Mozilla/5.0"
    };
    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    let url = rec.getValue("custrecord_h5_sl_ship_photo_delete_url")
    let photoDelete = ns.https.post({
        url: url,
        body: JSON.stringify(parameters),
        headers: headerObj
    })

}

let order =[]
let tableRowMatch = {
    "item": 0,
    "qty": 1,
    "qtyCommit": 2,
    "qtyPick": 3,
    // "Mstr": 4,
    // "case": 5,
    // "each": 6,
    "bin": 4,
    "qtyLoad": 5
}
let fakeTableRowMatch = {

}
function loadShipments(data){
    console.log("shipInputs", data)

    if(data.length == 0){
        alert("No Shipments Selected")
        location.reload()
    }

    let headerObj = {
        name: "User-Agent",
        value: "Mozilla/5.0"
    };
    let ns = loadModules()
    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    let url = rec.getValue("custrecord_h5_sl_get_load_count_url")
    //_h5_sl_get_load_count
    let response = ns.https.post({
        url: url,
        headers: headerObj,
        body: JSON.stringify(data)
    });

    console.log(JSON.parse(response.body))

    order = JSON.parse(response.body)
    console.log("order", order)

    let modalContainer = document.getElementById('loadModalContainer')

    let modalContents = '<div class=modal-header style="padding-bottom: 0%; margin-bottom: 0%;"><h5 class=modal-title style="font-size: 1vw;">Pick Items</h5><button class=btn-close data-bs-dismiss=modal type=button></button></div><div class=modal-body id=loadModalBodyContainer>'
    for(b=0; b<order.soIds.length; b++) {
        modalContents += '<p style="font-weight: bold;">' + order.soLines[b].soName + '</p><table id="outboundTable' + b + '" class="table table-striped" style="width: 100%; background-color: white;">' +
            '<tr style="width: 100%; background-color: #65799c; color: white">' +
            '<td align="center" style="padding: 0%; !important; font-weight: bold;">Item' +
            '<td align="center" style="padding: 0%; !important; font-weight: bold;">Qty' +
            '<td align="center" style="padding: 0%; !important; font-weight: bold;">Qty Committed' +
            '<td align="center" style="padding: 0%; !important; font-weight: bold;">Qty Picked' +
            // '<td align="center" style="padding: 0%; !important; font-weight: bold;">Mstr' + //new
            // '<td align="center" style="padding: 0%; !important; font-weight: bold;">Case' + //new
            // '<td align="center" style="padding: 0%; !important; font-weight: bold;">Each' + //new
            '<td align="center" style="padding: 0%; !important; font-weight: bold;">Bin' +
            '<td align="center" style="padding: 0%; !important; font-weight: bold;">Qty Loaded'

        for (y = 0; y < order.soLines.length; y++) {
            if(order.soLines[y].soId == order.soIds[b]) {
                let temppicked = Number(order.soLines[y].qtyCommitted) - Number(order.soLines[y].qtyPicked)
                modalContents += '<tr style="padding: 0%; !important; background-color: white">' +
                    '<td align="center" style="padding: 0%; !important;" data-committed="' + order.soLines[y].qtyCommitted + '" data-picked="' + order.soLines[y].qtyPicked + '"  data-lineid="' + order.soLines[y].lineId + '" id="' + order.soLines[y].item + '">' + order.soLines[y].itemName +
                    '<td align="center" style="padding: 0%; !important;">' + order.soLines[y].qty +
                    '<td align="center" style="padding: 0%; !important;">' + order.soLines[y].qtyCommitted +
                    '<td align="center" style="padding: 0%; !important;">' + order.soLines[y].qtyPicked +
                    // '<td align="center" style="padding: 0%; !important;">' + order.soLines[y].mastPack + //new
                    // '<td align="center" style="padding: 0%; !important;">' + order.soLines[y].casePack + //new
                    // '<td align="center" style="padding: 0%; !important;">' + order.soLines[y].eachPack + //new
                    '<td align="center" style="padding: 0%; !important;" data-max="' + temppicked + '">'
                console.log("aboveaddButton", y)
                modalContents += '<select style="width: 100%;" onchange="addBinButton(this, ' + y + ')">'

                modalContents += addBinSelector(y,true)
                // sr new line
                modalContents += "<span id='tempBtn"+y+"'><button type='button' onclick='addBin(this, " + y + ")' style='background-color: transparent; border-color: transparent;'><i class=\"fa-solid fa-plus\" style=\"color: #28a42f;\"></i></button></span>"
                // sr end
                modalContents += '<td colspan=1 align="center" style="padding: 0%; !important;"><input onchange="pickDec(this)" class="qtyL' + order.shipId + '" id=qtyLoaded' + order.soLines[y].item + ' type=number style="width: 75%; padding: 2pt; margin: 0pt" value="' + temppicked + '">'
            }
        }
        modalContents += '</table>'
    }
    modalContents += '</div><div class=modal-footer><button id="closeButton" class="btn btn-danger" data-bs-dismiss=modal type=button>Close</button><button class="btn btn-success" type=button id=finalLoadButton onclick=finalLoadShipmentsSpinner()><p id="pickText" style="padding: 0%; margin: 0%;">Pick</p><i id="pickSpin" class="fa fa-spinner fa-spin" style="display: none"></i></button></div>'
   // data-bs-dismiss=modal
    modalContainer.innerHTML = modalContents;
}

function addBinSelector(line,firstgo){
    let binSelector = ''
    binSelector += '<option value="">--Bins--</option>'
    for(z=0; z<order.soLines[line].bins.length; z++) {
        if(order.soLines[line].bins[z].preferred){
            if(firstgo){
                binSelector += '<option value="' + order.soLines[line].bins[z].binId + '" selected>' + order.soLines[line].bins[z].binNumber + ' (' + order.soLines[line].bins[z].available +')</option>'
            }else{
                binSelector += '<option value="' + order.soLines[line].bins[z].binId + '">' + order.soLines[line].bins[z].binNumber + ' (' + order.soLines[line].bins[z].available +')</option>'
            }
        }else{
            binSelector += '<option value="' + order.soLines[line].bins[z].binId + '">' + order.soLines[line].bins[z].binNumber + ' (' + order.soLines[line].bins[z].available +')</option>'
        }
    }
    binSelector += '</select>'

    return binSelector
}

function addBinButton(ele, line){
    console.log("addButton", ele, line)
    if(document.getElementById('tempBtn' + line)){
        return true
    }
    let newSpan = document.createElement("span")
    newSpan.innerHTML = "<button type='button' onclick='addBin(this, " + line + ")' style='background-color: transparent; border-color: transparent;'><i class=\"fa-solid fa-plus\" style=\"color: #28a42f;\"></i></button>"
    newSpan.id = 'tempBtn' + line
    ele.parentNode.appendChild(newSpan)
}

function addBin(ele, line){
    console.log("addBin", ele, line)
    let lineBreak = document.createElement("br")
    let p = ele.parentNode.parentNode
    p.removeChild(document.getElementById('tempBtn' + line))
    let newSelect = document.createElement("select")
    newSelect.onchange = function() {addBinButton(this, line)}
    newSelect.style = "width: 100%"
    newSelect.innerHTML += addBinSelector(line)
    // p.appendChild(lineBreak)
    p.appendChild(newSelect)

    let newInput = document.createElement("input")
    newInput.type = "number"
    newInput.style.width = "75%"
    newInput.style.padding = "2pt"
    newInput.style.margin = "0pt"
    newInput.placeholder = pickDec(p.parentNode)
    newInput.min = 0
    newInput.max = p.getAttribute("data-max")
    newInput.addEventListener("change", (event)=>{
        // let tempInput = event.srcElement.children[tableRowMatch.qtyLoad].getElementsByTagName("input")[qtyInputs].value
        // console.log("tempInput", tempInput.value)
        pickDec(event.srcElement)
    })
    // p.parentNode.children[tableRowMatch.qtyLoad].appendChild(lineBreak)
    p.parentNode.children[tableRowMatch.qtyLoad].appendChild(newInput)

}

function pickDec(toDec){ //dec = decrease

    console.log("pickDeck", toDec)
    if(toDec.nodeName == 'INPUT'){
        toDec = toDec.parentNode.parentNode
    }
    //toDec should be the table
    console.log(toDec.nodeName)
    let countRemain = toDec.children[tableRowMatch.qtyCommit].innerHTML
    console.log("countRemain", countRemain)
    for (let qtyInputs = 0; qtyInputs < toDec.children[tableRowMatch.qtyLoad].getElementsByTagName("input").length; qtyInputs++) {
        let tempInput = toDec.children[tableRowMatch.qtyLoad].getElementsByTagName("input")[qtyInputs]
        console.log("tempInput", tempInput.value)
        countRemain -= tempInput.value
        console.log("countRemain", countRemain)
    }
    for (let qtyInputs = 0; qtyInputs < toDec.children[tableRowMatch.qtyLoad].getElementsByTagName("input").length; qtyInputs++) {
        let tempInput = toDec.children[tableRowMatch.qtyLoad].getElementsByTagName("input")[qtyInputs]
        tempInput.placeholder = countRemain
    }
    return countRemain
}

function finalLoadShipmentsSpinner(){
    // createWaiter()
    document.getElementById("pickText").style.display = "none"
    document.getElementById("pickSpin").style.display = ""
    setTimeout(finalLoadShipments, 1000)
}

function finalLoadShipments(){
    console.log("finalLoadShipments", order)

    // fakeTableRowMatch
    let finalTableData = {}
    order.skipOrder = []
    let pass = true
    let failReason = ''
    for(b=0; b<order.soIds.length; b++) {
        let submitTable = document.getElementById("outboundTable" + b).rows //parent
        let tableRows = submitTable.length
        let orderTotal = 0
        console.log("tableRows" + b, tableRows)
        let headerRow = submitTable[0].children //columns within the parent (which is the row)
        for (x = 0; x < headerRow.length; x++) {
            fakeTableRowMatch[camelize(headerRow[x].innerHTML)] = x
        }

        for (y = 1; y < submitTable.length; y++) {
            let temp = {
                item: submitTable[y].children[tableRowMatch.item].id,
                itemName: submitTable[y].children[tableRowMatch.item].innerHTML,
                total: 0,
                soId: order.soIds[b],
                lineId: submitTable[y].children[tableRowMatch.item].getAttribute("data-lineid"),
                committed: submitTable[y].children[tableRowMatch.item].getAttribute("data-committed"),
                picked: submitTable[y].children[tableRowMatch.item].getAttribute("data-picked")
            }

            let binCount = submitTable[y].children[tableRowMatch.bin].children
            let qtyLoad = submitTable[y].children[tableRowMatch.qtyLoad].children
            let binData = []
            for (bc = 0; bc < binCount.length; bc++) {
                console.log("bin type", binCount[bc].type)
                if (binCount[bc].type == 'select-one') {
                    console.log("bin value", binCount[bc].value)
                    console.log("bin value", binCount[bc].value)
                    if(!binCount[bc].value && Number(qtyLoad[bc].value) == 0) {

                    }else if(qtyLoad[bc].value && Number(binCount[bc].value) > 0) {
                        binData.push({
                            "binId": binCount[bc].value,
                            "binQty": qtyLoad[bc].value
                        })
                        temp.total += Number(qtyLoad[bc].value)
                    }else if(Number(qtyLoad[bc].value) > 0 && !binCount[bc].value){
                        alert(temp.itemName + " has no bin selected.")
                        document.getElementById("pickText").style.display = ""
                        document.getElementById("pickSpin").style.display = "none"
                        return
                    }else{
                        // if(!binData[0]) {
                        //     pass = false
                        //     failReason += temp.itemName + ': has no bin selected. \n'
                        // }
                        binData.push({
                            // "binId": binCount[bc].value,
                            "binQty": qtyLoad[bc].value
                        })
                        temp.total += Number(qtyLoad[bc].value)
                    }
                }
            }

            temp.binData = binData
            if(finalTableData[temp.soId]){
                finalTableData[temp.soId].push(temp)
            }else{
                finalTableData[temp.soId] = [temp]
            }
            orderTotal+= temp.total
            console.log("temp", temp)
            let tempTotalPicked = Number(temp.total) + Number(temp.picked)
            if(tempTotalPicked != temp.committed && binData[0]) {
                let overUnder = 'under'
                if(tempTotalPicked>temp.committed){
                    alert(temp.itemName + ': is over the quantity committed.')
                    document.getElementById("pickText").style.display = ""
                    document.getElementById("pickSpin").style.display = "none"
                    return
                    // overUnder = 'over'
                    // pass = false
                }
                if(tempTotalPicked<temp.committed){
                    overUnder = 'under'
                    pass = true
                }
                failReason += temp.itemName + ': is ' + overUnder + ' the quantity committed. \n'
            }
            // if((temp.total == 0 && temp.picked == 0) && binData[0]){
            //     pass = false
            //
            //     failReason += temp.itemName + ': must have a quantity to fulfill. \n'
            // }
        }

        if(orderTotal == 0){
            order.skipOrder.push(order.soIds[b])
        }

    }

    order["finalBins"] = finalTableData

    console.log("order", order)

    if(pass && !failReason) {
        let headerObj = {
            name: "User-Agent",
            value: "Mozilla/5.0"
        };
        let ns = loadModules()
        let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
        let url = rec.getValue("custrecord_h5_sl_load_shipments_url")
        //_h5_sl_load_shipments
        let response = ns.https.post({
            url: url,
            headers: headerObj,
            body: JSON.stringify(order)
        });

        console.log("response", JSON.parse(response.body))
        if (JSON.parse(response.body).code == 201) {
            let message = JSON.parse(response.body).message

            alert(message)
            document.getElementById("closeButton").click()
            document.getElementById("packSectionHR").style.display = ''
            document.getElementById("packSection").style.display = ''
            // location.reload();

        } else {
            let message = JSON.parse(response.body).message
            alert(message)
            location.reload();
        }
    }else if(pass && failReason){
        document.getElementById("pickText").style.display = ""
        document.getElementById("pickSpin").style.display = "none"
        alert(failReason)
        let headerObj = {
            name: "User-Agent",
            value: "Mozilla/5.0"
        };
        let ns = loadModules()
        let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
        let url = rec.getValue("custrecord_h5_sl_load_shipments_url")
        //_h5_sl_load_shipments
        let response = ns.https.post({
            url: url,
            headers: headerObj,
            body: JSON.stringify(order)
        });

        console.log("response", JSON.parse(response.body))
        if (JSON.parse(response.body).code == 201) {
            let message = JSON.parse(response.body).message

            alert(message)
            document.getElementById("closeButton").click()
            document.getElementById("packSectionHR").style.display = ''
            document.getElementById("packSection").style.display = ''
            // location.reload();
            document.getElementById("pickTitleBar").innerHTML = '<i class="fa-regular fa-clipboard-list-check" style="color: gray"></i> Picked'

        } else {
            let message = JSON.parse(response.body).message
            alert(message)
            location.reload();
        }
    }else{
        document.getElementById("pickText").style.display = ""
        document.getElementById("pickSpin").style.display = "none"
        alert(failReason)
    }
}

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
}

function getFile(sendObj){
    console.log("Get File", sendObj)

    let headerObj = {
        name: "User-Agent",
        value: "Mozilla/5.0"
    };
    let ns = loadModules()
    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    let url = rec.getValue("custrecord_h5_sl_get_ship_doc_url")
    //_h5_sl_get_ship_doc
    let response = ns.https.post({
        url:url,
        headers: headerObj,
        body: JSON.stringify(sendObj)
    });

    if (JSON.parse(response.body)?.code == 201) {
        let docUrl = JSON.parse(response.body).docUrl
        console.log(docUrl)
        window.open(docUrl);
    }else{
        let message = JSON.parse(response.body)?.message || "Error"
        alert(message)
    }
}

function getLabel(sendObj){
    console.log("Get File", sendObj)

    let headerObj = {
        name: "User-Agent",
        value: "Mozilla/5.0"
    };
    let ns = loadModules()
    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    let url = rec.getValue("custrecord_h5_sl_sscc_label_url")
    //_h5_sl_sscc_label
    let response = ns.https.post({
        url: url,
        headers: headerObj,
        body: JSON.stringify(sendObj)
    });

    if (JSON.parse(response.body)?.code == 201) {
        let docUrl = JSON.parse(response.body).docUrl
        console.log(docUrl)
        location.reload();
    }else{
        let message = JSON.parse(response.body)?.message || "Error"
        document.getElementById("genLabelButton").innerHTML = 'UCC Labels'
        alert(message)
    }
}

function shipShipment(shipObj){
    console.log("Ship Shipments", shipObj)
    let ns = loadModules()
    let headerObj = {
        name: "User-Agent",
        value: "Mozilla/5.0"
    };
    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    let url = rec.getValue("custrecord_h5_sl_ship_shipment_url")
    //_h5_sl_ship_shipment
    let response = ns.https.post({
        url: url,
        headers: headerObj,
        body: JSON.stringify(shipObj)
    });

    console.log("response", JSON.parse(response.body))
    if (JSON.parse(response.body).code == 201) {
        let message = JSON.parse(response.body).message

        pickList(shipObj?.location, shipObj?.employee)
        //alert(message)
       //window.location = window.location

    } else {
        let message = JSON.parse(response.body).message
        alert(message)
        window.location = window.location
    }
}

/**************************************************** Shipped List *******************************************************************/

function shippedList(locationId, employeeId){
    let ns = loadModules();
    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    let url = rec.getValue("custrecord_h5_sl_render_shipped_list_url")
    //_h5_sl_render_shipped_list
    let shipmentListURL = url + "&location=" + locationId + "&employee=" + employeeId
    location.replace(shipmentListURL)
}

/**************************************************** Photo List *******************************************************************/

function photoList(locationId, employeeId){
    let ns = loadModules();
    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    let url = rec.getValue("custrecord_h5_sl_render_ship_photo_li_ur")
    //_h5_sl_render_ship_photo_lis
    let shipmentListURL = url + "&location=" + locationId + "&employee=" + employeeId
    location.replace(shipmentListURL)
}

/**************************************************** Consolidate *******************************************************************/

function consolidate(locationId, employeeId){
    let ns = loadModules();
    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    let url = rec.getValue("custrecord_h5_sl_render_consolidator_url")
    //_h5_sl_render_consolidator
    let shipmentListURL = url + "&location=" + locationId + "&employee=" + employeeId
    location.replace(shipmentListURL)
}

function consolSpinner(data, employeeId, empLocation){
    createWaiter()
    setTimeout(consolShipments, 1000, data, employeeId, empLocation)
}

function consolShipments(data, locationId, employeeId){

    let shipmentsToSend = {
        ships: data
    }
    let headerObj = {
        name: "User-Agent",
        value: "Mozilla/5.0"
    };
    let ns = loadModules()
    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    let url = rec.getValue("custrecord_h5_sl_consolidator_url")
    //_h5_sl_consolidator
    let response = ns.https.post({
        url:url,
        headers: headerObj,
        body: JSON.stringify(shipmentsToSend)
    })

    if (JSON.parse(response.body).code == 201) {
        let message = JSON.parse(response.body).message

        alert(message)
        //_h5_sl_render_pick_list
        pickList('{{location}}', '{{employee}}')
    } else {
        let message = JSON.parse(response.body).message
        alert(message)
        location.reload();
    }
}

let modalData = []
function getShipData(shipModelData){
    let shipId = shipModelData
    console.log("shipId", shipId)

    let headerObj = {
        name: "User-Agent",
        value: "Mozilla/5.0"
    };
    let ns = loadModules();
    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    let url = rec.getValue("custrecord_h5_sl_get_ship_data_url")
    //_h5_sl_get_ship_data
    let response = ns.https.post({
        url: url,
        headers: headerObj,
        body: shipId
    });

    console.log(response.body)

    modalData = JSON.parse(response.body)

    buildModal(shipId)

}
//shipment fields modal
function buildModal(shipId) {

    console.log("buildModal", shipId)
    let modalContainer = document.getElementById('shipModalContainer')

    let modalContent = '<div class=modal-header style=padding-bottom:0;margin-bottom:0><h5 class=modal-title style=font-size:1vw;padding-bottom:0;margin-bottom:1%>' + modalData[0].shipName + '</h5><p id=shipmentID style=display:none>' + modalData[0].shipId + '</p><button class=close type=button data-bs-dismiss=modal aria-label=Close><span aria-hidden=true>×</span></button></div><div class=modal-body id=modalBody><div class=row style=height:auto;padding:.5%><table style="width:100%;border-radius:1px;margin-bottom:.5%;box-shadow:1px 2px 3px rgba(0,0,0,.2);background-color:#4d5f79"class=titleBars><tr><td style=font-size:.75vw;font-weight:700;padding-left:1%;padding:.5%;color:#fff>Parties</table><div class="col-6 container-fluid"style=padding:0 align=center><form action=""autocomplete=off class=form-horizontal id=shipAddressForm role=form><div class=form-group style=margin-right:.5%!important;margin-left:.5%!important><table style=width:100%;border-radius:1px;margin-bottom:1%;background-color:rgba(0,0,0,.2) class=titleBars><tr><td style=font-size:.75vw;font-weight:700;padding-left:1%;padding:.5%>SHIP DATE</table><div class="input-group mb-3"style=padding:0!important;margin-bottom:1%!important;margin-top:0!important><span class=input-group-text id=dateSL style=font-size:.75vw>Date:</span> <input class=form-control id=dateS placeholder=Date style=font-size:.75vw value="' + modalData[0].shipDate + '"type=date aria-describedby=basic-addon1 aria-label=Company></div><table style=width:100%;border-radius:1px;margin-bottom:1%;margin-top:1%;background-color:rgba(0,0,0,.2) class=titleBars><tr><td style=font-size:.75vw;font-weight:700;padding-left:1%;padding:.5%>SHIP FROM</table><div class="input-group mb-3"style=padding:0!important;margin-bottom:1%!important;margin-top:0!important;margin-right:.5%!important><span class=input-group-text id=locationSL style=font-size:.75vw>Location:</span> <input class=form-control-plaintext id=locationS placeholder=Location style=font-size:.75vw value="' + modalData[0].location + '"aria-describedby=basic-addon1 aria-label="Company Address"readonly></div><div class="input-group mb-3"style=padding:0!important;margin-bottom:1%!important;margin-top:0!important><span class=input-group-text id=phoneSL style=font-size:.75vw><i class="fa-phone fa-solid"></i></span> <input class=form-control id=phoneS placeholder=Phone style=font-size:.75vw value="' + modalData[0].shipPhone + '"type=tel aria-describedby=basic-addon1 aria-label=Company></div><table style=width:100%;border-radius:1px;margin-bottom:1%;margin-top:1%;background-color:rgba(0,0,0,.2) class=titleBars><tr><td style=font-size:.75vw;font-weight:700;padding-left:1%;padding:.5%>BILL TO</table><div class="input-group mb-3"style=padding:0!important;margin-bottom:1%!important;margin-top:0!important><span class=input-group-text id=addreBL style=font-size:.75vw;padding:.5%>Addre:</span> <input class=form-control id=addreB placeholder=State style=font-size:.75vw;padding:.5% value="' + modalData[0].billToAddre + '"type=tel></div><div class="input-group mb-3"style=padding:0!important;margin-bottom:1%!important;margin-top:0!important><span class=input-group-text id=stateBL style=font-size:.75vw;padding:.5%>State:</span> <input class=form-control id=stateB placeholder=State style=font-size:.75vw;padding:.5% value="' + modalData[0].billToState + '"type=state></div><div class="input-group mb-3"style=padding:0!important;margin-bottom:1%!important;margin-top:0!important><span class=input-group-text id=countryBL style=font-size:.75vw;padding:.5%>Country:</span> <input class=form-control id=countryB placeholder=Country style=font-size:.75vw;padding:.5% value="' + modalData[0].billToCountry + '"type=country></div><div class="input-group mb-3"style=padding:0!important;margin-bottom:1%!important;margin-top:0!important></div></div></form></div><div class="col-6 container-fluid"style=padding:0 align=center><form action=""autocomplete=off class=form-horizontal id=shipToAddressForm role=form><div class=form-group style=margin-right:.5%!important;margin-left:.5%!important><table style=width:100%;border-radius:1px;margin-bottom:1%;background-color:rgba(0,0,0,.2) class=titleBars><tr><td style=font-size:.75vw;font-weight:700;padding-left:1%;padding:.5%>SHIP TO</table><div class="input-group mb-3"style=padding:0!important;margin-bottom:1%!important;margin-top:0!important><span class=input-group-text id=companyL style=font-size:.75vw;padding:.5%>Company:</span> <input class=form-control id=company placeholder=Company style=font-size:.75vw;padding:.5% value="' + modalData[0].conAddre + '"></div><div class="input-group mb-3"style=padding:0!important;margin-bottom:1%!important;margin-top:0!important><span class=input-group-text id=attnL style=font-size:.75vw;padding:.5%>Attn:</span> <input class=form-control id=attn placeholder=Company style=font-size:.75vw;padding:.5% value="' + modalData[0].conAttn + '"></div><div class="input-group mb-3"style=padding:0!important;margin-bottom:1%!important;margin-top:0!important><span class=input-group-text id=add1L style=font-size:.75vw;padding:.5%>Address 1:</span> <input class=form-control id=add1 placeholder="Address 1"style=font-size:.75vw;padding:.5% value="' + modalData[0].conAdd1 + '"></div><div class="input-group mb-3"style=padding:0!important;margin-bottom:1%!important;margin-top:0!important><span class=input-group-text id=add2L style=font-size:.75vw;padding:.5%>Address 2:</span> <input class=form-control id=add2 placeholder="Address 2"style=font-size:.75vw;padding:.5% value="' + modalData[0].conAdd2 + '"></div><div class="input-group mb-3"style=padding:0!important;margin-bottom:1%!important;margin-top:0!important><span class=input-group-text id=cityL style=font-size:.75vw;padding:.5%>City:</span> <input class=form-control id=city placeholder=City style=font-size:.75vw;padding:.5% value="' + modalData[0].conCity + '"></div><div class="input-group mb-3"style=padding:0!important;margin-bottom:1%!important;margin-top:0!important><span class=input-group-text id=stateL style=font-size:.75vw;padding:.5%>State:</span> <input class=form-control id=state placeholder=State: style=font-size:.75vw;padding:.5% value="' + modalData[0].conState + '"></div><div class="input-group mb-3"style=padding:0!important;margin-bottom:1%!important;margin-top:0!important><span class=input-group-text id=zipL style=font-size:.75vw;padding:.5%>Zip:</span> <input class=form-control id=zip placeholder=Zip style=font-size:.75vw;padding:.5% value="' + modalData[0].conZip + '"></div><div class="input-group mb-3"style=padding:0!important;margin-bottom:1%!important;margin-top:0!important><span class=input-group-text id=countryL style=font-size:.75vw;padding:.5%>Country:</span> <input class=form-control id=country placeholder=Country style=font-size:.75vw;padding:.5% value="' + modalData[0].conCountry + '"></div><div class="input-group mb-3"style=padding:0!important;margin-bottom:1%!important;margin-top:0!important><span class=input-group-text id=contactL style=font-size:.75vw;padding:1%><i class="fa-phone fa-solid"></i></span> <input class=form-control id=phone placeholder=Phone style=font-size:.75vw;padding:.5% value="' + modalData[0].conPhone + '"></div></div></form></div></div><div class=row style=height:auto;padding:.5%></div><div class=modal-footer><button class="btn btn-danger" type=button id="closeButton" data-bs-dismiss=modal>Close</button></div>'

    //<button class="btn btn-primary"type=button onclick=saveShipment()>Save</button>

    modalContainer.innerHTML = modalContent;
}


/**************************************************** Manifests *******************************************************************/

function manifestMenu(locationId, employeeId){
    let ns = loadModules();
    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    let url = rec.getValue("custrecord_h5_sl_render_mani_menu_url")
    //_h5_sl_render_consolidator
    let shipmentListURL = url + "&location=" + locationId + "&employee=" + employeeId
    location.replace(shipmentListURL)
}

function getManifest(sendObj){
    console.log("Get File", sendObj)

    let headerObj = {
        name: "User-Agent",
        value: "Mozilla/5.0"
    };
    let ns = loadModules()
    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    let url = rec.getValue("custrecord_h5_sl_get_manifest_url")
    //_h5_sl_get_ship_doc
    let response = ns.https.post({
        url:url,
        headers: headerObj,
        body: JSON.stringify(sendObj)
    });

    if (JSON.parse(response.body)?.code == 201) {
        let docUrl = JSON.parse(response.body).docUrl
        console.log(docUrl)
        window.open(docUrl);
    }else{
        let message = JSON.parse(response.body)?.message || "Error"
        alert(message)
    }
}



function hideSpinner() {
    let spinner = document.getElementById('h5bot-spin');
    spinner.setAttribute('class', 'd-none');
}
function createWaiter() {
    let waiter = {};
    waiter.styles = '#h5bot-spin{'
        + '  position: fixed;'
        + '  top: 0;'
        + '  left: 0;'
        + '  background-color: #000;'
        + '  height: 100%;'
        + '  width: 100%;'
        + '  z-index: 100000;'
        + '  opacity: 0.6;'
        + '}'
        + '.h5bot-spin{'
        + '  border: 7px solid #333;'
        + '  -webkit-animation: spin 2s linear infinite;'
        + '  animation: spin 2s linear infinite;'
        + '  border-top: 7px solid #fff;'
        + '  border-radius: 50%;'
        + '  width: 50px;'
        + '  height: 50px;'
        + '  position: absolute;'
        + '  bottom: 50%;'
        + '  left: 45%;'
        + '}'
        + '@keyframes spin{'
        + '  0% { transform: rotate(0deg); }'
        + '  100% { transform: rotate(360deg); }'
        + '}';
    waiter.id = 'h5bot-spin';
    waiter.class = 'h5bot-spin';
    // create HTML chunk for loader
    let loaderHtmlElement = document.createElement('div');
    loaderHtmlElement.id = waiter.id;
    loaderHtmlElement.innerHTML = '<div class="' + waiter.class + '"></div>';
    document.body.appendChild(loaderHtmlElement);

    // add styles for loader
    let loaderStyleElement = document.createElement('style');
    loaderStyleElement.type = 'text/css';
    loaderStyleElement.innerHTML = waiter.styles;
    document.body.appendChild(loaderStyleElement);
    document.getElementById('h5bot-spin').style.display = 'block:none';
}


