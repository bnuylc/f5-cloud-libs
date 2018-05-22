/**
 * Copyright 2017-2018 F5 Networks, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/* eslint-disable no-console */

const assert = require('assert');
const options = require('commander');
const localCryptoUtil = require('../lib/localCryptoUtil');
const KEYS = require('../lib/sharedConstants').KEYS;

(function run() {
    const runner = {

        /**
         * Runs the decryptDataInFile script
         *
         * Notes:
         *
         *    + Only runs locally on a BIG-IP. Cannot run on a remote BIG-IP.
         *    + Uses tmsh rather than iControl REST so that we do not need to take in a password
         *
         * @param {String[]} argv - The process arguments
         * @param {Function} cb - Optional cb to call when done
         */
        run(argv, cb) {
            try {
                options
                    .version('4.2.0')
                    .option('--data-file <data_file>', 'Full path to file with data (use this or --data)')
                    .parse(argv);

                assert.ok(options.dataFile, '--data-file must be specified');

                localCryptoUtil.decryptDataFromFile(
                    options.dataFile,
                    KEYS.LOCAL_PRIVATE_KEY_FOLDER,
                    KEYS.LOCAL_PRIVATE_KEY
                )
                    .then((data) => {
                        console.log(data);
                        if (cb) {
                            cb(data);
                        }
                    })
                    .catch((err) => {
                        console.log('Decryption failed:', err.message);
                        if (cb) {
                            cb(err);
                        }
                    });
            } catch (err) {
                console.log('Decryption error:', err);
                if (cb) {
                    cb(err);
                }
            }
        }
    };

    module.exports = runner;

    // If we're called from the command line, run
    // This allows for test code to call us as a module
    if (!module.parent) {
        runner.run(process.argv);
    }
}());
