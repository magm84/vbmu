const md5 = require('crypto-js/md5');

const generateUUID = (email = "") => {
    let tmpObject = {
        email,
        uuid: null
    }

    if (email === "" || email === null) {
        console.log(`"${email}" is invalid or empty!`);
        return tmpObject;
    } else {

        tmpObject.email = email.toLowerCase().trim();

        if (tmpObject.email !== "") {
            //valid is an email
            if (/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/.test(tmpObject.email)) {
                let hash = md5(tmpObject.email).toString();
                let brazeUUID = hash.substr(0, 8) + "-" + hash.substr(8, 4) + "-" + hash.substr(12, 4) + "-" + hash.substr(16, 4) + "-" + hash.substr(20, 12);
                tmpObject.uuid = brazeUUID;

            } else {
                console.log(`invalid email address ${tmpObject.email}`);
            }
        }

        return tmpObject;
    }
}

module.exports = generateUUID;