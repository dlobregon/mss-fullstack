import { useEffect, useState, useCallback } from 'react'
import './App.css';

const ShowApis = ({ apis }) => {

  const [currentApi, setCurrentApi] = useState({})
  const [currentParams, setCurrentParams] = useState({})
  const [successCall, setSuccessCall]  = useState(false)
  const [responseData, setResponseData] = useState({})

  const fetchApi = useCallback(()=> {
    const apiIndex = apis.indexOf(currentApi)
    console.log(apiIndex, currentParams)
    fetch('http://localhost:4000/'+apiIndex, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({currentParams})
      }).then((data) => {
        data.json().then((data) => {
         setResponseData(data.body)
         setSuccessCall(true)
        }).catch(e => {
          console.log('fail',e)
        })
      }).catch((e) => {
        console.log('fail call', e)
      })

  }, [apis,currentParams, currentApi])

  const selectApi = (api) => {
    setCurrentApi(api)
    let tmpParam = {}
    api.params.forEach(param => {
      tmpParam[param] = ''
    });
    setCurrentParams(tmpParam)
  }

  const handleMakeCall = () => {
    console.log(currentParams)
    fetchApi()
  }

  const handleChangeParams = (param, value) => {
   const tmpCurrentParams = {...currentParams}
   tmpCurrentParams[param]= value
   setCurrentParams(tmpCurrentParams)
}

return (
  <>
    <ul>
      {
        apis.map((item, index) => {
          return <li key={index}>{index} - {item.urlObject?.hostname} <button onClick={() => selectApi(item)}>call</button></li>
        })
      }
    </ul>
    {
      Object.hasOwn(currentApi, 'urlObject') ?
        <div>
          <div>
            <br />
            <span>Api hostname: {currentApi.urlObject?.hostname}</span>

            <br />
            {
              currentApi.params.map((param, index) => {
                return (
                  <div key={index}>
                    <span>
                      {param}:
                    </span>
                    <input
                      value={currentParams[param]}
                      onChange={(e) => handleChangeParams(param, e.target.value)}
                    />
                  </div>
                )
              })
            }
            <div>
              <button onClick={handleMakeCall}>make call</button>
              <button onClick={() => { setCurrentApi({}); setCurrentParams({}); setSuccessCall(false); setResponseData({}) }}>hide api call</button>
              <div>
                {
                  successCall?
                  <>

                    <div>response properties:</div>
                    {
                      Object.keys(responseData).map((item, i)=> (
                        <div key={i}>{item}</div>
                      ))
                    }
                  </>
                  : ''
                }
              </div>
            </div>

          </div>
        </div>
        :
        ''
    }
  </>
)
}


const SaveApi = () => {
  const [mode, setMode] = useState(0)
  const [url, setUrl] = useState('')
  const [success, setSuccess] = useState(0)
  const [parameters, setParameters] = useState([])

  const saveApi = useCallback(() => {
    if (mode === 0 && url !== '') {
      fetch('http://localhost:4000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          builder: mode,
          urlString: url
        })
      }).then((data) => {
        data.json().then((data) => {
          setSuccess(1)
        }).catch(e => {
          console.log(e)
          setSuccess(2)
        })
      }).catch((e) => {
        console.log(e)
        setSuccess(2)
      })
    } else if (mode === 1 && url !== '') {
      fetch('http://localhost:4000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          builder: mode,
          urlString: url,
          params: parameters
        })
      }).then((data) => {
        data.json().then((data) => {
          setSuccess(1)
        }).catch(e => {
          console.log(e)
          setSuccess(2)
        })
      }).catch((e) => {
        console.log(e)
        setSuccess(2)
      })
    }
  }, [url, mode, parameters])

  const changeUrl = (e) => {
    setUrl(e.target.value)
  }
  const changeMode = () => {
    if (mode === 0) {
      setMode(1)
    } else {
      setMode(0)
    }
  }

  const handleSave = () => {
    saveApi()
  }

  const addParameter = () => {
    const ptmp = [...parameters]
    ptmp.push('')
    setParameters(ptmp)
  }

  const deleteParameter = (index) => {
    const updatedItems = [...parameters]
    updatedItems.splice(index, 1)

    console.log(updatedItems)
    setParameters(updatedItems)
  }

  const changeParameterName = (index, value) => {
    const updatedItems = [...parameters]
    updatedItems[index] = value
    setParameters(updatedItems)
  }
  return (
    <>
      <button onClick={changeMode}>{mode === 1 ? 'pass to builder mode' : 'pass to url mode'}</button>
      <div>
        <input placeholder='enter your url' value={url} onChange={changeUrl} />
      </div>
      <div>
        {
          mode === 0 ?
            ''
            :
            <div>
              <button onClick={addParameter}> add parameter</button>
              {
                parameters.map((element, index) => {
                  return (
                    <div key={index}>
                      &nbsp;
                      <input
                        type='text'
                        placeholder='enter your parameter name'
                        onChange={(e) => changeParameterName(index, e.target.value)}
                        value={element}
                      />
                      &nbsp;
                      <button onClick={() => { deleteParameter(index) }}>delete parameter</button>
                    </div>
                  )
                })
              }
            </div>
        }
        <div>
          {
            success === 1 ?
              <span>success</span>
              :
              success === 2 ?
                <span>error</span>
                :
                ''

          }
        </div>
      </div>
      <button onClick={handleSave}>save</button>
    </>
  )
}




function App() {

  const [apis, setApis] = useState([])
  const [view, setView] = useState(0)

  useEffect(() => {
    if (view === 0) {
      fetch('http://localhost:4000/')
        .then(response => response.json())
        .then(data => setApis(data))
        .catch(err => console.error(err))
    }
  }, [view])


  const changeView1 = () => {
    setView(0)
  }
  const changeView2 = () => {
    setView(1)
  }
  const changeView3 = () => {
    setView(2)
  }


  return (
    <>
      <div>
        <button onClick={changeView1}>Get List</button> &nbsp;
        <button onClick={changeView2}>get url object</button> &nbsp;

      </div>
      <ul>
        {view === 0 ?
          <>
            <ShowApis apis={apis} />
          </>
          : view === 1 ?
            <SaveApi />
            : ''
        }
      </ul>
    </>
  )
}

export default App;
