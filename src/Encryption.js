import { RSA } from "react-native-rsa-native";

export const encrypt = async (message, uid) => {
    // TODO: get the public key of the target uid
    const publicKey = "";
    RSA.encrypt(message, publicKey)
        .then(encodedMessage => {
            return encodedMessage;
        })
        .catch(err => console.error(err));
}

export 

export const decrypt = async (message) => {
    // TODO: Get your private key from async storage
    const privateKey = "";
    RSA.decrypt(message, privateKey)
        .then(decodedMessage => {
            return decodedMessage;
        })
        .catch(err => {
            return null;
        })
}
