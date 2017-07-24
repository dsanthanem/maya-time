'use strict';

const constants = require('../lib/constants');
const logger = require('../lib/logger');
const service = require('../server/service');
const http = require('http');
const server = http.createServer(service);
const request = require('superagent');

server.listen(); // Omitting the port parameter tells NodeJs to choose an available port dynamically

server.on('listening', function () {

    logger.info(`MAYA-Time is listening on port ${server.address().port} in ${service.get('env')} mode...`)

    const announce = () => {
        request.put(`http://127.0.0.1:3010/service/time/${server.address().port}`, (err, res) => {

            if(err) {
                logger.info(err);
                logger.info('Error Connecting to Maya');
                return;
            } else {
                logger.info('Maya-Time connected to Maya');
            }

        });

    };

    announce();
    setInterval(announce, 15*1000);

});

