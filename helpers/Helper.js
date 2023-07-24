
const fs = require('fs')
var path = require("path");
class FileController{
    constructor(){}
    /**
     * @function saveFIle
    * @param {uploadedFile} file
    * @param {string} pathTosave
    *@returns {string}
    */
    static async saveFile (file, pathTosave){
        
        let imageFile = file
    
        const fpath = path.dirname('./public')+`/${pathTosave}/${Date.now().toString()}_${imageFile.name}`
        
        await imageFile.mv(fpath)
    
        return fpath
    }

}

module.exports.FileController = FileController