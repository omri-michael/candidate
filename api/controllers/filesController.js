const mysqlFilesClient = require('../../db/dbClient')

mysqlFilesClient.makeConnectionDB().then(result => console.log({result: result}))

const getAllFiles = async (req, res) => {
    try {
        console.log('Attempting to get all files')
        let files = await mysqlFilesClient.selectAllFiles(false)
        res.status(200).send({
            status: 'ok',
            files: files,
            message: `returning ${files.length} files`
        })
    } catch (error) {
        console.log('getAllFiles:error: ', error)
        res.status(500).send({status: 'error', message: error})
    }
}

const addFiles = async (req, res) => {
    try {
        console.log('attempting to add files')
        if (req && req.body) {
            const {url, fileName, file} = req.body
            const existingFiles = await mysqlFilesClient.selectFileByFileName(url)
            const copyNumber = existingFiles && existingFiles.length > 0 ? existingFiles[0].copyNumber : 0
            const {newFileName, isExist, newCopyNumber} = getFileName(copyNumber, fileName)
            const fileToAdd = {url: url, name: newFileName, file: file, copyNumber: newCopyNumber}
            await mysqlFilesClient.addNewFile(fileToAdd)

            let responseMessage;
            if (isExist) {
                responseMessage = `A file with this name already exist, file ${newFileName} added successfully`
            } else {
                responseMessage = `file ${newFileName} added successfully`
            }

            res.status(200).send({message: responseMessage})
        } else {
            console.log('request is empty')
            res.status(200).send({message: 'request is empty'})
        }
    } catch (error) {
        console.log('error: ', error)
        res.status(500).send({status: 'error', message: error})
    }
}

const getFileName = (copyNumber, currentName) => {
    let newCopyNumber = 1
    let newFileName = currentName

    if (copyNumber) {
        newCopyNumber = copyNumber + 1
        newFileName += '_' + newCopyNumber
    }

    newFileName += '.exe'
    return {newFileName: newFileName, isExist: newCopyNumber !== 1, newCopyNumber: newCopyNumber}
}

const deleteFile = async (req, res) => {
    try {
        console.log(`attempting to delete a file`)
        const {fileName} = req.body
        const response = await mysqlFilesClient.deleteFile(fileName)
        if (response.affectedRows === 1) {
            res.status(200).send({message: 'file was deleted successfully'})
        } else {
            res.status(200).send({message: 'no files where deleted'})
        }
    } catch (error) {
        console.log('error: ', error)
        res.status(500).send({status: 'error', message: error})
    }
}

const updateFileName = async (req, res) => {
    try {
        console.log(`attempting to update file name`)
        const {fileName, newFileName} = req.body
        const response = await mysqlFilesClient.updateFileName(fileName, newFileName)
        if (response.changedRows === 1) {
            res.status(200).send({message: 'file name was update successfully'})
        } else {
            res.status(200).send({message: 'no files where updated'})
        }
    } catch (error) {
        console.log('error: ', error)
        res.status(500).send({status: 'error', message: error})
    }
}

module.exports = {
    getAllFiles, addFiles, deleteFile, updateFileName
}