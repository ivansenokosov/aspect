export function getPath<String>(path:string) {
    let result = ''
    result = path.substring(14, path.indexOf('/',14))
    return result
}
