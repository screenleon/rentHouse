const request = require('request');

/**
 * @param  {request.Options} options the request url, body ,headers
 * 
 * @return {request.Response}
 */
async function deleteRequest(options) {
  return new Promise((resolve, reject) => {
    request.delete(options, (error, response) => {
      if (error) reject(new Error(`Ops! Some error about delete request -> ${error}`));
      resolve(response);
    });
  });
}

/**
 * @param  {request.Options} options the request url, body ,headers
 * 
 * @return {request.Response}
 */
async function getRequest(options) {
  return new Promise((resolve, reject) => {
    request.get(options, (error, response) => {
      if (error) reject(new Error(`Ops! Some error about get request-> ${error}`));
      resolve(response);
    });
  });
}

/**
 * @param  {request.Options} options the request url, body ,headers
 * 
 * @return {request.Response}
 */
async function postRequest(options) {
  return new Promise((resolve, reject) => {
    request.post(options, (error, response) => {
      if (error) reject(new Error(`Ops! Some error about post request-> ${error}`));
      resolve(response);
    });
  });
}

/**
 * @param  {request.Options} options the request url, body ,headers
 * 
 * @return {request.Response}
 */
async function putRequest(options) {
  return new Promise((resolve, reject) => {
    request.put(options, (error, response) => {
      if (error) reject(new Error(`Ops! Some error about put request-> ${error}`));
      resolve(response);
    });
  });
}

module.exports = {
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
};