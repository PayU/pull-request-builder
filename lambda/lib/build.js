const AWS = require('aws-sdk')
AWS.config.update({ region: 'eu-central-1' });
const codebuild = new AWS.CodeBuild()
const status = require('./status')

module.exports.run = (sourceVersion) => {

  return new Promise((resolve, reject) => {

    codebuild.startBuild({
      projectName: process.env.PROJECT_NAME,
      artifactsOverride: { type: 'NO_ARTIFACTS' },
      sourceVersion: sourceVersion, 
        environmentVariablesOverride: [ { name: 'TRIGGERED_BY_GITHUB', value: 'true' } ]
    })
      .promise()

      .then(resp => {
        console.log("resp1", JSON.stringify(resp))
        return status.update('pending', 'build is running...', sourceVersion, resp.build.id)
      })

      .then(resp => {
        console.log("resp2", resp)
        resolve(resp)
      })
      .catch(err => {
        console.log(err)
        reject(err)
      })
  })

}
