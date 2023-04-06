// utility module for the server

module.exports = {
     generateID,
}

function generateID(length){
    var result = ''; //empty result which will be my room id

    var charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charsetLength = charset.length;

    for (let index = 0; index < charsetLength; index++) {
        //add random characters to result
        result += charset.charAt(Math.floor(Math.random() * charsetLength));
        
    }

    return result;
}