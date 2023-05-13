// const getFileName = (existingFileName, currentName) => {
//     if (existingFileName) {
//         currentName += '_';
//         const index = existingFileName.lastIndexOf('_')
//         if (index === -1) {
//             currentName += '2'
//         } else {
//             const numberOfSameFiles = existingFileName.substring(index + 1, existingFileName.lastIndexOf('.'))
//             currentName += Number(numberOfSameFiles) + 1
//         }
//     }
//
//     const fileName = currentName + '.exe'
//     return {newFileName: fileName, nameAlreadyExists: existingFileName}
// }
//
// const res = getFileName('abc_9.exe', 'abc')
// console.log(res)