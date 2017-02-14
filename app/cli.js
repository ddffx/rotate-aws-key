#!/usr/bin/env node
'use strict';
const meow = require('meow');
const rotateAwsKeyCli = require('.');

const cli = meow(`
    Usage

    AWS Key commands
    $ cli rotate-key 
    $ cli create-key 
    $ cli update-key-status
    $ cli delete-key

    Options
      --user-name
      --accesskeyId
`)

rotateAwsKeyCli(cli.input[0], cli.flags);
