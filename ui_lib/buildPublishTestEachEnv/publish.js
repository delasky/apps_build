(function() {
    'use strict';

    var request = require('request')
    var pkg     = require('../../package.json')
        , _     = require('lodash')
        , envs  = require('./envs.json')
        , global_envs = require('./global_envs.json')
        , fs = require('fs')
        , Client = require('bodhi-driver-superagent').createClient
        , Bearer = require('bodhi-driver-superagent').BearerToken

    module.exports = function(current_env, zipFileName) {

        return function publish(callback) {
            callback = callback || _.noop

            let env = envs[current_env]
            let global_env = global_envs[current_env]

            request({
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/x-www-form-urlencoded'
                },
                form: {
                    grant_type: 'password',
                    client_id: 'admin-cli',
                    username: env.username,
                    password: env.password
                },
                method: 'POST',
                url: `https://login.${env.host}/auth/realms/hotschedules/protocol/openid-connect/token`
            }, (err, response, data) => {
                if (err) {
                    callback(err)
                } else {
                    let id_token = JSON.parse(data).id_token
                    request({
                        headers: {
                            accept: 'application/json',
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        form: {
                            grant_type: 'password',
                            client_id: 'admin-cli',
                            username: global_env.username,
                            password: global_env.password
                        },
                        method: 'POST',
                        url: `https://login.${global_env.host}/auth/realms/hotschedules/protocol/openid-connect/token`
                    }, (err, response, data) => {
                        if (err) {
                            callback(err)
                        } else {
                            let global_id_token = JSON.parse(data).id_token

                            let client = new Client({
                                url: `https://api.${env.host}`,
                                namespace: `${env.namespace}`,
                                credentials: new Bearer(id_token, env.namespace)
                            })

                            let global_client = new Client({
                                url: `https://api.${global_env.host}`,
                                namespace: `${global_env.namespace}`,
                                credentials: new Bearer(global_id_token, global_env.namespace)
                            })

                            request({
                                method: 'POST',
                                auth: {
                                    bearer: id_token
                                },
                                url: `https://api.${env.host}/${env.namespace}/controllers/vertx/apps/start/publish?upsert=true`,
                                formData: {
                                    file: fs.createReadStream(zipFileName)
                                }
                            }, (err, response, data) => {
                                if (err) {
                                    console.log(err)
                                    callback(err)
                                } else {
                                    console.log('local publish => ', data)
                                    request({
                                        method: 'POST',
                                        auth: {
                                            bearer: global_id_token
                                        },
                                        url: `https://api.${global_env.host}/${global_env.namespace}/controllers/vertx/apps/start/publish?upsert=true&global=true&appname=${env.namespace}.${pkg.name}`,
                                        json: true,
                                        body: {}
                                    }, (err, response, data) => {
                                        if (err) {
                                            console.log('req 4 err')
                                            callback(err)
                                        } else {
                                            console.log('global publish => ', data)
                                            callback()
                                        }
                                    })
                                }
                            })

                        }

                    })
                }

            })

            //curl -X POST -F "file=@application.zip" -u '[USERNAME]:[PASSWORD]' https://api.bodhi-dev.io/[NAMESPACE]/controllers/vertx/apps/start/publish[?global=true]&[upsert=true]

        }

    }

})()
