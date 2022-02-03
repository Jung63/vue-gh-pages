






//取出token
const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
//存到header
axios.defaults.headers.common['Authorization'] = token;