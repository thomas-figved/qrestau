import {useState, useEffect} from 'react'
import axios from 'axios';
import {useAPI} from 'contexts/APIContext';

export function useFetch(method, path, needsAuth, successCallback, errorCallback) {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const {backendURL, getAuthorizationHeader} = useAPI()

  useEffect(()=>{

    const fetchData = async () => {
      setIsLoading(true)

      try {
        let axios_conf = {
          method: method,
          url: backendURL + path,
        }

        if(needsAuth) {
          axios_conf['headers'] = getAuthorizationHeader()
        }

        let axios_instance = axios.create()

        axios_instance.request(axios_conf)
        .then((response)=>{
          successCallback(response)
          setIsLoading(false)
          setError(null);
        })
        .catch((responseError)=>{
          setError(errorCallback(responseError))
          setIsLoading(false)
        })
      } catch (responseError) {
        setError(errorCallback(responseError))
        setIsLoading(false)
      }
    }
    fetchData()
  },[method, backendURL, path, needsAuth, getAuthorizationHeader, successCallback, errorCallback])

  return {error, isLoading}
}