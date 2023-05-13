const axios = require('axios')
const {createInterface} = require('readline')
const expertUrl = 'https://candidate.ironsrc.net?expert=True'

const readline = createInterface({
    input: process.stdin,
    output: process.stdout
})

const readLineAsync = msg => {
    return new Promise(resolve => {
        readline.question(msg, userRes => {
            resolve(userRes)
        })
    })
}

const startApp = async () => {
    const message = `Files storage app

(1) set add new files scheduled job
(2) add new files from candidate url
(3) update file name
(4) delete a file
(q) quit

Please choose an action: => `

    let fileName, newFileName
    let userRes = await readLineAsync(message)

    while (userRes !== 'q') {
        switch (userRes) {
            case '1':
                const min = await readLineAsync('please insert the time interval (in minutes): ')
                setInterval(() => {
                    addFiles()
                }, 60 * min * 1000)
                userRes = 'q'
                break
            case '2':
                addFiles()
                userRes = 'q'
                break
            case '3':
                fileName = await readLineAsync('file name to update: ')
                newFileName = await readLineAsync('new file name: ')
                updateFileName(fileName, newFileName)
                userRes = 'q'
                break
            case '4':
                fileName = await readLineAsync('file name: ')
                deleteFile(fileName)
                userRes = 'q'
                break
            default:
                userRes = await readLineAsync('wrong input, try again (q to quit) => ')
                break
        }
    }

    readline.close()
}

const addFiles = () => {
    axios({method: 'get', url: expertUrl}).then(data => {
        if (data && data.data && data.data.length > 0) {
            const urls = [...new Set(extractUrls(data.data))]
            sendUrlsToStorageApp(urls)
        } else {
            console.log('No data to retrieve, will try again later.')
        }
    }).catch(error => {
        console.log('addFiles: ', error)
    })
}

const deleteFile = (fileName) => {
    axios({
        method: 'DELETE',
        url: 'http://localhost:3000/',
        data: {
            fileName: fileName
        }
    }).then(res => {
        console.log(res.data.message)
    }).catch(error => {
        console.log('deleteFile: ', error)
    })
}

const updateFileName = (fileName, newFileName) => {
    axios({
        method: 'PUT',
        url: 'http://localhost:3000/',
        data: {
            fileName: fileName,
            newFileName: newFileName
        }
    }).then(res => {
        console.log(res.data.message)
    }).catch(error => {
        console.log('updateFileName', error)
    })
}

const sendUrlsToStorageApp = (urls) => {
    console.log('attempting to sendUrlsToStorageApp')
    urls.forEach(url => {
        axios({
            url: url,
            method: 'GET',
            responseType: 'arraybuffer'
        }).then(response => {
            const fileName = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'))
            const fileObject = {url: url, fileName: fileName, file: toBinaryString(response.data)}
            sendToStorageApi(fileObject).then(res => {
                console.log(res.data.message)
            })
        }).catch(error => {
            console.log('sendUrlsToStorageApp: ', error)
        })
    })
}

const toBinaryString = (arrayBuffer) => {
    const view = new Uint8Array(arrayBuffer);
    return view.reduce((str, byte) => str + byte.toString(2).padStart(8, '0'), '');
}

const sendToStorageApi = async (data) => {
    try {
        return await axios({
            method: 'POST',
            url: 'http://localhost:3000/',
            data: {url: data.url, fileName: data.fileName, file: data.file}
        })
    } catch (error) {
        console.log('sendToStorageApi: ', error)
    }
}

const extractUrls = (listOfObjects) => {
    return JSON.parse(JSON.stringify(listOfObjects)).map(object => {
        if (!!object) {
            return reqFindUrl(object)
        }
    })
}

const reqFindUrl = (object) => {
    if (typeof object === 'string') {
        return object
    } else if (object.a0) {
        return reqFindUrl(object.a0)
    } else if (object.a1) {
        return reqFindUrl(object.a1)
    } else if (object.a2) {
        return reqFindUrl(object.a2)
    }
}

startApp()