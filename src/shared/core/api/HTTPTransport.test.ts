import httpTransport from './HTTPTransport'

describe('HTTPTransport', () => {
  let mockXHR: Partial<XMLHttpRequest>
  let xhrSendMock: jest.Mock
  let xhrOpenMock: jest.Mock
  let setRequestHeaderMock: jest.Mock

  beforeEach(() => {
    xhrSendMock = jest.fn()
    xhrOpenMock = jest.fn()
    setRequestHeaderMock = jest.fn()

    mockXHR = {
      open: xhrOpenMock,
      send: xhrSendMock,
      setRequestHeader: setRequestHeaderMock,
      withCredentials: false,
      onload: null,
      onabort: null,
      onerror: null,
      ontimeout: null,
      readyState: 4,
      status: 200,
      responseText: '{}',
    }

    // @ts-expect-error
    global.XMLHttpRequest = jest.fn(() => mockXHR)
  })

  test('GET-запрос с query-параметрами', async () => {
    const promise = httpTransport.get('/test', { data: { a: '1' } })
    // @ts-expect-error
    mockXHR.onload?.call(mockXHR)
    await expect(promise).resolves.toBe(mockXHR)
    expect(xhrOpenMock).toHaveBeenCalledWith('GET', '/test?a=1')
    expect(xhrSendMock).toHaveBeenCalled()
  })

  test('POST-запрос с JSON-данными', async () => {
    const promise = httpTransport.post('/test', { data: { b: '2' } })
    // @ts-expect-error
    mockXHR.onload?.call(mockXHR)
    await expect(promise).resolves.toBe(mockXHR)
    expect(setRequestHeaderMock).toHaveBeenCalledWith('Content-Type', 'application/json')
    expect(xhrSendMock).toHaveBeenCalledWith(JSON.stringify({ b: '2' }))
  })

  test('Отправка FormData без Content-Type', async () => {
    const formData = new FormData()
    formData.append('key', 'value')
    const promise = httpTransport.put('/upload', { data: formData })
    // @ts-expect-error
    mockXHR.onload?.call(mockXHR)
    await expect(promise).resolves.toBe(mockXHR)
    expect(setRequestHeaderMock).not.toHaveBeenCalledWith('Content-Type', expect.any(String))
    expect(xhrSendMock).toHaveBeenCalledWith(formData)
  })

  test('Отклонение по таймауту', async () => {
    const promise = httpTransport.delete('/timeout')
    // @ts-expect-error
    mockXHR.ontimeout?.call(mockXHR)
    await expect(promise).rejects.toThrow('Request timed out')
  })

  test('Отклонение при прерывании запроса', async () => {
    const promise = httpTransport.get('/abort')
    // @ts-expect-error
    mockXHR.onabort?.call(mockXHR)
    await expect(promise).rejects.toThrow('Request aborted')
  })

  test('Отклонение при ошибке запроса', async () => {
    const promise = httpTransport.get('/error')
    // @ts-expect-error
    mockXHR.onerror?.call(mockXHR)
    await expect(promise).rejects.toThrow('Request error')
  })

  test('Ошибка при отсутствии метода', async () => {
    await expect(httpTransport.request('/broken', {})).rejects.toThrow('No method provided')
  })
})
