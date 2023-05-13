"use strict"
const mysql = require('mysql')
const dbPool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: 'omri',
    database: 'candidate'
})

const files_table = 'files'
const makeConnectionDB = () => {
    console.log(`trying to connect to database: ${files_table}`)

    return new Promise((resolve, reject) => {
        dbPool.getConnection(function (error, connection) {
            if (error) {
                reject('makeConnectionDB: no connection\n', error)
                return
            }
            connection.ping()
            connection.release()
            resolve(`makeConnectionDB: connecting to database: ${files_table}`)
        })
    })
}

const selectAllFiles = async (desc) => {
    console.log('selectAllMeetingRooms started')
    let query = `SELECT url, name, file
                 FROM ${files_table}
                 ORDER BY dateAdded ${(desc ? 'DESC' : 'ASC')}`
    return await performQuery(query)
}

const selectFileByFileName = async (url) => {
    console.log('selectFileByFileName started')
    let query = `SELECT copyNumber
                 FROM ${files_table}
                 WHERE url LIKE '${url}'
                 ORDER BY copyNumber DESC`
    return await performQuery(query)
}

const addNewFile = async (file) => {
    console.log('addNewFile started')
    const timestamp = new Date()
    let query = `INSERT INTO ${files_table} (url, name, copyNumber, file, dateAdded)
                 VALUES ('${file.url}', '${file.name}', ${file.copyNumber}, '${file.file}', ${dbPool.escape(timestamp)})`
    return await performQuery(query)
}

const updateFileName = async (fileName, newFileName) => {
    console.log('updateFileName started')
    const timestamp = new Date()
    let query = `UPDATE ${files_table}
                 SET name         = '${newFileName}',
                     dateModified = ${dbPool.escape(timestamp)}
                 WHERE name = '${fileName}'`
    return await performQuery(query)
}

const deleteFile = async (fileName) => {
    console.log('deleteFile started')
    let query = `DELETE FROM ${files_table} WHERE name = '${fileName}'`
    return await performQuery(query)
}

const performQuery = async (query) => {
    console.log('performQuery started,\nquery: ', query)
    return new Promise((resolve, reject) => {
        dbPool.query(query, (error, data) => {
            if (error) {
                console.log(error)
                return reject(error)
            }

            console.log(`Performed query on ${data.length} records`)
            return resolve(data)
        })
    })
}

module.exports = {
    makeConnectionDB, selectAllFiles, addNewFile, updateFileName, deleteFile, selectFileByFileName
}