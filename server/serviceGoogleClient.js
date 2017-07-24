/*
This module (using Google Client) needs debugging.
 */

'use strict';

const constants = require('../lib/constants');
const express = require('express');
const service = express();
const logger = require('../lib/logger');
const moment = require('moment');
var googleMapsGeoClient = require('@google/maps').createClient({
    key: constants.GOOGLE_GEOCODING_API_KEY
});
var googleMapsTzClient = require('@google/maps').createClient({
    key: constants.GOOGLE_TIMEZONE_API_KEY
});


service.get('/time/:location', (req, res, next) => {

    googleMapsGeoClient.geocode({
        address: req.params.location
    }, function(err, res) {

        if (err) {
            logger.info(err);
            return res.sendStatus(500);
        }
        // console.log(res.json.results);

        const location = res.body.results[0].geometry.location;
        const lat = location.lat;
        const lng = location.lng;
        const timestamp = +moment().format('X');

        googleMapsTzClient.timezone({
            location: lat + ', '+ lng,
            timestamp: timestamp
        }, function(err, res) {

            if(err) {
                logger.info(err);
                return res.sendStatus(500);
            }
            const results = res.body;
            const locationTime = timestamp + results.dstOffset + results.rawOffset;
            const timeFormatFull = 'dddd, MMMM Do YYYY h:mm:ss A';
            const timeFormatOnlyTime = 'h:mm:ss A';
            const timeStringFull = moment.unix(locationTime).utc().format(timeFormatFull);
            const timeStringOnlyTime = moment.unix(locationTime).utc().format(timeFormatOnlyTime);
            res.json({result: {time: timeStringOnlyTime, dateTime: timeStringFull}});

        });

    });

});

module.exports = service;





