/**
 *@author Habit 5 Business Services LLC
 * @todo Contact support@habit5.com for questions
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


/****************************************************** LOGOUT *******************************************************************/

function logOut(){
    let ns = loadModules();
    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    let url = rec.getValue("custrecord_h5_sl_render_mobile_login_url")

    //_h5_sl_render_mobile_login
    location.replace(url)
}

/****************************************************** General *******************************************************************/

function getURL(url){
    console.log("switgetURLchToPage URL:", url)
    let ns = loadModules();
    let rec = ns.record.load({type:'customrecord_h5_config_deploy', id:1})
    return rec.getValue(url)
}

function switchToPage(urlField, params){
    console.log("switchToPage URL:", urlField)
    console.log("params:", params)
    let url = getURL(urlField)
    for(i in params){ //i = "location" and params[i] is the data value (&location=123)
        if(params[i]){
           url +=  `&${i}=${params[i]}`
        }
    }
    location.replace(url)
}

function nsTalkSpin(urlField,params,data, eleId){
    console.log("nsTalkSpin URL:", urlField)
    console.log("nsTalkSpin params:", params)
    console.log("nsTalkSpin data:", data)
    console.log("nsTalkSpin eleId:", eleId)
        if(eleId){
            document.getElementById(eleId).innerHTML = '<i id="loginspinner" class="fa fa-spinner fa-spin" style="zoom: 1.5;"></i>'
        }else{
            createWaiter()
        }
        setTimeout(nsTalk, 20, urlField, params, data)
}

function nsTalk(urlField, params, data){
    console.log("nsTalk URL:", urlField)
    console.log("nsTalk params:", params) //locationId && employee id
    console.log("nsTalk data:", data)  //data passed to the suitelet

    let ns = loadModules();
    let url = getURL(urlField)

    let response = ns.https.post({
        url: url,
        body: JSON.stringify(data),
        headers: {
            name: "User-Agent",
            value: "Mozilla/5.0"
        }
    })

    if(response.code == 200){
        console.log("nsTalk Response", response.body)
        return JSON.parse(response.body)
    }else{
        alert("Error: " + response.body)
        return
    }

}

function switchToPageTemp(urlField, params){
    console.log("switchToPage URL:", urlField)
    console.log("params:", params)
    alert("Coming Soon!")
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


