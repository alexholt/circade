const AWS = require('aws-sdk');
const crypto = require('crypto');

const ses = new AWS.SESV2({
  apiVersion: '2019-09-27',
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: 'us-west-2',
});

function createActivationLink(email) {
  Gprocess.env.ACTIVATION_SECRET
  const hmac = cypto.privateKeyEncrypt('sha256', );
  hmac.update(
}

function sendEmail() {
  const params = {

    Destination: {
      ToAddresses: ["me@alexholt.me"],
      CcAddresses: [],
      BccAddresses: [],
    },

    Content: {
      Simple: {
        Subject: {
          Data: "Activate your Circade account",
          Charset: "UTF-8",
        },

        Body: {
          Text: {
            Data: "This is the message body in text format.",
            Charset: "UTF-8"
          },

          Html: {
            Data: "This is <strong>HTML</strong>.",
            Charset: "UTF-8",
          },
        },
      },
    },

    FromEmailAddress: "hello@circade.today",
  };

  ses.sendEmail(params, function (err, data) {
    if (err) throw err;
    console.dir(data);
  });
}

function createKey() {
  const { generateKeyPair } = require('crypto');
generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: process.env.ACTIVATION_SECRET,
  }
}, (err, publicKey, privateKey) => {
});

}
