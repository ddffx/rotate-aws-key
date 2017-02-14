'use strict';
const AWS = require('aws-sdk');
const async = require('async');
const iam = new AWS.IAM();
const _ = require('lodash');


const _createKey = (flags, done) => {
	if (flags && flags.userName) {
		let params = {
			UserName: flags.userName
		}

		iam.createAccessKey(params, (err, data) => {
			if (err) {
				// console.log(err);
				done(err, null)
			} else {
				// console.log(data);
				done(null, data);
			}
		})
	} else {
		done(new Error('--user-name is missing'), null);
	}

};

const _listKeys = (flags, done) => {

	if (flags && flags.userName) {
		let params = {
			UserName: flags.userName
		}
        console.log((new Date()).toISOString());
		iam.listAccessKeys(params, (err, data) => {
			if (err) {
				// console.log(err);
				done(err, null)
			} else {
				// console.log(data);
				done(null, data['AccessKeyMetadata']);
			}
		})
	} else {
		done(new Error('--user-name is missing'), null);
	}


};
/**
 * @params {object}
 * {
 *      UserName: '',
 *      AccessKeyId: '',
 *      Status: ''
 * }
 */

const _updateKey = (flags, done) => {
	if (flags && flags.userName && flags.accessKeyId && flags.status) {
		let params = {
			UserName: flags.userName,
			AccessKeyId: flags.accessKeyId,
			Status: flags.status
		}
		iam.updateAccessKey(params, (err, data) => {
			if (err) {
				// console.log(err);
				done(err, null)
			} else {
				// console.log(data);
				if (data.ResponseMetadata.RequestId) {
					_listAccessKeys({
						userName: flags.userName
					}, (err, result) => {
						if (err) {
							done(err, null);
						} else {
							done(null, _.find(result, {
								AccessKeyId: flags.accessKeyId
							}));
						}
					})
				}
			}
		})
	} else {
		done(new Error('--user-name and --access-key-id --status are required'), null);
	}


};

const _deleteKey = (flags, done) => {
	if (flags && flags.userName && flags.accessKeyId) {
		let params = {
			UserName: flags.userName,
			AccessKeyId: flags.accessKeyId
		}
		iam.deleteAccessKey(params, (err, data) => {
			if (err) {
				// console.log(err);
				done(err, null)
			} else {
				console.log(data);
				if (data.ResponseMetadata.RequestId) {
					done(null, `Access key ${flags.accessKeyId} deleted`)
				}
			}
		})
	} else {
		done(new Error('--user-name and --access-key-id --status are required'), null);
	}


};

const _rotateKey = (flags, done) =>{
    if (flags && flags.userName && flags.accessKeyId) {
		let params = {
			UserName: flags.userName,
			AccessKeyId: flags.accessKeyId
		}
		async.waterfall([
            // add a new key
            function(msg, cb){
                _createKey(flags,cb)
            },

            
            function(data, cb){
                // update env with new credentials & print it on stdout
                console.log(data);
                // delete existing key 
                //  _deleteKey(flags,cb)
            },
            

        ], (err, result)=>{
            if(err){
                done(err, null);
            } else {
                done(err, result);
            }
        });
	} else {
		done(new Error('--user-name and --access-key-id --status are required'), null);
	}
}



const rotateAWSKeyCli = (input, flags) => {
	// console.log(input);
	// console.log(flags);

	const _processOutput = (err, result) => {
		if (err) {
			console.error(err);

		} else {
			console.log(result);
		}
	}
	if (input) {
		switch (input) {
			case 'create-key':
				_createKey(flags, _processOutput);
				break;
			case 'list-keys':
				_listKeys(flags, _processOutput);
				break;
			case 'update-key':
				_updateKey(flags, _processOutput);
				break;
			case 'delete-key':
				_deleteKey(flags, _processOutput);
				break;
            case 'rotate-key':
				_rotateKey(flags, _processOutput);
				break;
			default:
				console.log('not a valid input')
		}
	} else {
		console.error(`input not provided`);
		process.exit();
	}
}
module.exports = exports = rotateAWSKeyCli;
