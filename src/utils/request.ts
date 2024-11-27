import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://api.english-quiz.com'
})

export default axiosInstance
