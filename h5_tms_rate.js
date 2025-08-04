{
  "getDataWithToken": "function(https, log, bearerToken) { \
    var response = https.get({ \
      url: 'https://api.example.com/data', \
      headers: { \
        Authorization: 'Bearer ' + bearerToken \
      } \
    }); \
    log.debug('API Response', response.body); \
  }"
}


