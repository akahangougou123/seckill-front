import axios from 'axios';

axios.defaults.baseURL = "/api"
axios.defaults.header.post['Content-Type'] = 'application/json;charset=UTF-8' //配置请求头
// axios.defaults.header.common['accessToken'] = "" //token信息

export default axios