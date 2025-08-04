{
  "getFedExBearerToken": "function(https, log, clientId, clientSecret) { var headers = {}; headers['Content-Type'] = 'application/x-www-form-urlencoded'; var body = 'grant_type=client_credentials&client_id=' + clientId + '&client_secret=' + clientSecret; var response = https.post({ url: 'https://apis.fedex.com/oauth/token', body: body, headers: headers }); var token = JSON.parse(response.body).access_token; log.debug({ title: 'FedEx Bearer Token', details: token }); return token; }"
}

