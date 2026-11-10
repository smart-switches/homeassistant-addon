# .DefaultApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getConfig**](DefaultApi.md#getConfig) | **GET** /api/config | 
[**getLayoutDefinitions**](DefaultApi.md#getLayoutDefinitions) | **GET** /api/layout-definitions | Get available layout definitions
[**getLogs**](DefaultApi.md#getLogs) | **GET** /api/logs | Fetch the stored log entries for a switch
[**getSwitch**](DefaultApi.md#getSwitch) | **GET** /api/switches/{name}/{layout-version} | 
[**listExecutables**](DefaultApi.md#listExecutables) | **GET** /api/executables | 
[**ping**](DefaultApi.md#ping) | **GET** /api/ping | Validate connectivity to the server
[**postLogs**](DefaultApi.md#postLogs) | **POST** /api/logs | Upload log entries from a switch
[**press**](DefaultApi.md#press) | **POST** /api/press | 
[**putConfig**](DefaultApi.md#putConfig) | **PUT** /api/config | 


# **getConfig**
> Config getConfig()


### Example


```typescript
import { createConfiguration, DefaultApi } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request = {};

const data = await apiInstance.getConfig(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**Config**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getLayoutDefinitions**
> { [key: string]: LayoutDefinition; } getLayoutDefinitions()

Returns the definitions of all supported layout versions, including which buttons they support

### Example


```typescript
import { createConfiguration, DefaultApi } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request = {};

const data = await apiInstance.getLayoutDefinitions(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**{ [key: string]: LayoutDefinition; }**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**0** | Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getLogs**
> GetLogsResponseBody getLogs()


### Example


```typescript
import { createConfiguration, DefaultApi } from '';
import type { DefaultApiGetLogsRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request: DefaultApiGetLogsRequest = {
    // Name of the switch to fetch logs for
  _switch: "switch_example",
};

const data = await apiInstance.getLogs(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **_switch** | [**string**] | Name of the switch to fetch logs for | defaults to undefined


### Return type

**GetLogsResponseBody**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**422** | Unprocessable Entity |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **getSwitch**
> LayoutInstance getSwitch()


### Example


```typescript
import { createConfiguration, DefaultApi } from '';
import type { DefaultApiGetSwitchRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request: DefaultApiGetSwitchRequest = {
    // Name of the switch
  name: "name_example",
    // Layout version configured on the switch
  layout_version: "layout-version_example",
};

const data = await apiInstance.getSwitch(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **name** | [**string**] | Name of the switch | defaults to undefined
 **layout_version** | [**string**] | Layout version configured on the switch | defaults to undefined


### Return type

**LayoutInstance**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**404** | Not Found |  -  |
**422** | Unprocessable Entity |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **listExecutables**
> ListExecutablesResponseBody listExecutables()


### Example


```typescript
import { createConfiguration, DefaultApi } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request = {};

const data = await apiInstance.listExecutables(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**ListExecutablesResponseBody**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **ping**
> PingResponseBody ping()


### Example


```typescript
import { createConfiguration, DefaultApi } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request = {};

const data = await apiInstance.ping(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**PingResponseBody**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**0** | Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **postLogs**
> PostLogsResponseBody postLogs(PostLogsRequestBody)

Entries already stored are ignored, so a switch can safely resend entries it hasn\'t had acknowledged.

### Example


```typescript
import { createConfiguration, DefaultApi } from '';
import type { DefaultApiPostLogsRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request: DefaultApiPostLogsRequest = {
  
  PostLogsRequestBody: {
    logs: [
      {
        lvl: "lvl_example",
        msg: "msg_example",
        seq: 0,
        t: 0,
      },
    ],
    _switch: "_switch_example",
    uptime_ms: 0,
    version: "version_example",
  },
};

const data = await apiInstance.postLogs(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **PostLogsRequestBody** | **PostLogsRequestBody**|  |


### Return type

**PostLogsResponseBody**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json, application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**422** | Unprocessable Entity |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **press**
> any press(PostPressRequestBody)


### Example


```typescript
import { createConfiguration, DefaultApi } from '';
import type { DefaultApiPressRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request: DefaultApiPressRequest = {
  
  PostPressRequestBody: {
    key: "key_example",
    layout: "layout_example",
    _switch: "_switch_example",
  },
};

const data = await apiInstance.press(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **PostPressRequestBody** | **PostPressRequestBody**|  |


### Return type

**any**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json, application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**422** | Unprocessable Entity |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **putConfig**
> Config putConfig(Config)


### Example


```typescript
import { createConfiguration, DefaultApi } from '';
import type { DefaultApiPutConfigRequest } from '';

const configuration = createConfiguration();
const apiInstance = new DefaultApi(configuration);

const request: DefaultApiPutConfigRequest = {
  
  Config: {
    switches: {
      "key": {
        layouts: {
          "key": {
            buttons: {
              "key": {
                cmd: "cmd_example",
                color: [
                  1,
                ],
              },
            },
            flipped: true,
            version: "version_example",
          },
        },
      },
    },
  },
};

const data = await apiInstance.putConfig(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **Config** | **Config**|  |


### Return type

**Config**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json, application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**422** | Unprocessable Entity |  -  |
**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


