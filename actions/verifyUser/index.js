/*
* <license header>
*/

/**
 * This is a sample action showcasing how to access an external API
 *
 * Note:
 * You might want to disable authentication and authorization checks against Adobe Identity Management System for a generic action. In that case:
 *   - Remove the require-adobe-auth annotation for this action in the manifest.yml of your application
 *   - Remove the Authorization header from the array passed in checkMissingRequestInputs
 *   - The two steps above imply that every client knowing the URL to this deployed action will be able to invoke it without any authentication and authorization checks against Adobe Identity Management System
 *   - Make sure to validate these changes against your security requirements before deploying the action
 */


const fetch = require('node-fetch')
const { Core } = require('@adobe/aio-sdk')
const { errorResponse, decrypt, encrypt} = require('../utils')
const { Ims, ValidationCache, getToken } = require('@adobe/aio-lib-ims');

// main function that will be executed by Adobe I/O Runtime
async function main (params) {
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    // 'info' is the default level if not set
    logger.info('ENV is', process.env.AIO_CLI_ENV, typeof params);
    logger.info('Calling the verifyUser action', params);
    if(!params.userData || ! params.verification) {
      return errorResponse(401, 'Forbidden', logger);
    }
    const userDataJson = JSON.stringify(params.userData);
    console.log(`${userDataJson}--${params.verification}--${decrypt(params.verification)}--${decrypt(params.verification) === userDataJson}--${encrypt(userDataJson)}--${encrypt(userDataJson) === params.verification}`);
    const decryptedVerification = decrypt(params.verification.trim())?.toString();
    if(decryptedVerification !== userDataJson.trim()) {
      console.log(`not the same:${decryptedVerification}--${userDataJson.trim()}`);
      return errorResponse(400, 'Bad request', logger);
    }

    return {
      statusCode: 200,
      body: '',
    }

  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    return errorResponse(500, 'server error', logger)
  }
}

exports.main = main
