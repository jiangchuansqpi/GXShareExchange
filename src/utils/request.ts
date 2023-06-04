import axios from 'axios'

const baseURL = 'http://114.67.78.94:8077/cz'

function request (config: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: baseURL,
      // timeout: 1000,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })

    instance(config).then((res: any) => {
      resolve(res.data)
    }).catch((err: any) => reject(err))
  })
}

export default request
