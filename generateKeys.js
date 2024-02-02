const fs = require("fs");
const forge = require("node-forge");


const privatePath = "keys/private.key";
const publicPath = "keys/public.key";


const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });


const privateKey = forge.pki.privateKeyToPem(keypair.privateKey);
const publicKey = forge.pki.publicKeyToPem(keypair.publicKey);


fs.writeFileSync(privatePath, privateKey);
fs.writeFileSync(publicPath, publicKey);

console.log("RSA key pair generated successfully!");
