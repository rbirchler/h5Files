/**
 *@author Habit 5 Business Services LLC
 * @todo Contact support@habit5.com for questions
 * @summary All of the functionality for the consolidate shipments html template
 * @description functions for buttons and different css attributes with a library of other unused functions underneath
 **/
$(document).ready( function () {
    require(
        ['N/url',
            'N/runtime',
            'N/ui/dialog',
            'N/https',
            'N/http',
            'N/ui/message',
            'N/search'
        ]);
    $('[data-toggle="tooltip"]').tooltip();
} );

function loadModules() {
    return {
        "url" : require('N/url'),
        "runtime" : require('N/runtime'),
        "dialog" : require('N/ui/dialog'),
        "https" : require('N/https'),
        "http" : require('N/http'),
        "message" : require('N/ui/message'),
        "search" : require('N/search')
    };
}

function genLabels(data){
    console.log("Gen Labels Button Pushed")
    var ns = loadModules();

    console.log(data)

    var headerObj = {
        name: "User-Agent",
        value: "Mozilla/5.0"
    };

    //_h5_sl_select_rate
    var request = ns.https.post({
        url: "https://922659-sb1.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2257&deploy=1&compid=922659_SB1&ns-at=AAEJ7tMQNv6ajZLPP2uW6HknYBFmo9BHA89pvuFSGhsVu00bdO0",
        body: JSON.stringify(data),
        headers: headerObj
    })
    console.log(request)

    if(request.code == 200){
        if (JSON.parse(request.body)?.code == 201) {
            let docUrl = JSON.parse(request.body).docUrl
            window.open(docUrl)
            window.close()
        }else{
            let message = JSON.parse(request.body)?.message || "Error"
            document.getElementById("submitButton").innerHTML = 'Generate Labels'
            alert(message)
        }
    }


}

//shows dropdown of carriers available to choose rate
