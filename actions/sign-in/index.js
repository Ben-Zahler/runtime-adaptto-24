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


const {Core} = require('@adobe/aio-sdk')
const {errorResponse, encrypt} = require('../utils')

// main function that will be executed by Adobe I/O Runtime
async function main(params) {
    // create a Logger
    const logger = Core.Logger('main', {level: params.LOG_LEVEL || 'info'})

    try {
        // 'info' is the default level if not set
        logger.info('ENV', process.env.AIO_CLI_ENV);
        logger.info('Calling the second action');
        let cookieData = {level : 'anonymous'};
        let statuscode = 401;
        if (params.userName ) {
            if (params.userName === 'Jack') {
                cookieData.level = 'secret';
            } else {
                cookieData.level = 'member';
            }
            cookieData.userName = params.userName;
            statuscode = 200;
        }
        logger.info('return status code', statuscode);
        logger.info('cookie data is '+ JSON.stringify(cookieData));
        return {
            statusCode: statuscode,
            body: '',
            headers: {
                'Set-Cookie': [`adaptToMemberData=${JSON.stringify(cookieData)}; Secure; SameSite=Strict; Path=/; Max-Age=3000;`,
                  `adaptToVerification=${encrypt(JSON.stringify(cookieData))}; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=3000;`],
            }
        }

    } catch (error) {
        // log any server errors
        logger.error(error)
        // return with 500
        return errorResponse(500, 'server error', logger)
    }
}

exports.main = main
