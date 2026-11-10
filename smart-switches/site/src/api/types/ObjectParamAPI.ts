import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, ConfigurationOptions } from '../configuration'
import type { Middleware } from '../middleware';

import { Command } from '../models/Command';
import { Config } from '../models/Config';
import { ErrorDetail } from '../models/ErrorDetail';
import { ErrorModel } from '../models/ErrorModel';
import { Executable } from '../models/Executable';
import { GetLogsResponseBody } from '../models/GetLogsResponseBody';
import { LayoutDefinition } from '../models/LayoutDefinition';
import { LayoutInstance } from '../models/LayoutInstance';
import { ListExecutablesResponseBody } from '../models/ListExecutablesResponseBody';
import { LogEntry } from '../models/LogEntry';
import { LogEntryReq } from '../models/LogEntryReq';
import { PingResponseBody } from '../models/PingResponseBody';
import { PostLogsRequestBody } from '../models/PostLogsRequestBody';
import { PostLogsResponseBody } from '../models/PostLogsResponseBody';
import { PostPressRequestBody } from '../models/PostPressRequestBody';
import { Switch } from '../models/Switch';

import { ObservableDefaultApi } from "./ObservableAPI";
import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";

export interface DefaultApiGetConfigRequest {
}

export interface DefaultApiGetLayoutDefinitionsRequest {
}

export interface DefaultApiGetLogsRequest {
    /**
     * Name of the switch to fetch logs for
     * Defaults to: undefined
     * @type string
     * @memberof DefaultApigetLogs
     */
    _switch: string
}

export interface DefaultApiGetSwitchRequest {
    /**
     * Name of the switch
     * Defaults to: undefined
     * @type string
     * @memberof DefaultApigetSwitch
     */
    name: string
    /**
     * Layout version configured on the switch
     * Defaults to: undefined
     * @type string
     * @memberof DefaultApigetSwitch
     */
    layout_version: string
}

export interface DefaultApiListExecutablesRequest {
}

export interface DefaultApiPingRequest {
}

export interface DefaultApiPostLogsRequest {
    /**
     * 
     * @type PostLogsRequestBody
     * @memberof DefaultApipostLogs
     */
    PostLogsRequestBody: PostLogsRequestBody
}

export interface DefaultApiPressRequest {
    /**
     * 
     * @type PostPressRequestBody
     * @memberof DefaultApipress
     */
    PostPressRequestBody: PostPressRequestBody
}

export interface DefaultApiPutConfigRequest {
    /**
     * 
     * @type Config
     * @memberof DefaultApiputConfig
     */
    Config: Config
}

export class ObjectDefaultApi {
    private api: ObservableDefaultApi

    public constructor(configuration: Configuration, requestFactory?: DefaultApiRequestFactory, responseProcessor?: DefaultApiResponseProcessor) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public getConfigWithHttpInfo(param: DefaultApiGetConfigRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<Config>> {
        return this.api.getConfigWithHttpInfo( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public getConfig(param: DefaultApiGetConfigRequest = {}, options?: ConfigurationOptions): Promise<Config> {
        return this.api.getConfig( options).toPromise();
    }

    /**
     * Returns the definitions of all supported layout versions, including which buttons they support
     * Get available layout definitions
     * @param param the request object
     */
    public getLayoutDefinitionsWithHttpInfo(param: DefaultApiGetLayoutDefinitionsRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<{ [key: string]: LayoutDefinition; }>> {
        return this.api.getLayoutDefinitionsWithHttpInfo( options).toPromise();
    }

    /**
     * Returns the definitions of all supported layout versions, including which buttons they support
     * Get available layout definitions
     * @param param the request object
     */
    public getLayoutDefinitions(param: DefaultApiGetLayoutDefinitionsRequest = {}, options?: ConfigurationOptions): Promise<{ [key: string]: LayoutDefinition; }> {
        return this.api.getLayoutDefinitions( options).toPromise();
    }

    /**
     * Fetch the stored log entries for a switch
     * @param param the request object
     */
    public getLogsWithHttpInfo(param: DefaultApiGetLogsRequest, options?: ConfigurationOptions): Promise<HttpInfo<GetLogsResponseBody>> {
        return this.api.getLogsWithHttpInfo(param._switch,  options).toPromise();
    }

    /**
     * Fetch the stored log entries for a switch
     * @param param the request object
     */
    public getLogs(param: DefaultApiGetLogsRequest, options?: ConfigurationOptions): Promise<GetLogsResponseBody> {
        return this.api.getLogs(param._switch,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public getSwitchWithHttpInfo(param: DefaultApiGetSwitchRequest, options?: ConfigurationOptions): Promise<HttpInfo<LayoutInstance>> {
        return this.api.getSwitchWithHttpInfo(param.name, param.layout_version,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public getSwitch(param: DefaultApiGetSwitchRequest, options?: ConfigurationOptions): Promise<LayoutInstance> {
        return this.api.getSwitch(param.name, param.layout_version,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public listExecutablesWithHttpInfo(param: DefaultApiListExecutablesRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<ListExecutablesResponseBody>> {
        return this.api.listExecutablesWithHttpInfo( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public listExecutables(param: DefaultApiListExecutablesRequest = {}, options?: ConfigurationOptions): Promise<ListExecutablesResponseBody> {
        return this.api.listExecutables( options).toPromise();
    }

    /**
     * Validate connectivity to the server
     * @param param the request object
     */
    public pingWithHttpInfo(param: DefaultApiPingRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<PingResponseBody>> {
        return this.api.pingWithHttpInfo( options).toPromise();
    }

    /**
     * Validate connectivity to the server
     * @param param the request object
     */
    public ping(param: DefaultApiPingRequest = {}, options?: ConfigurationOptions): Promise<PingResponseBody> {
        return this.api.ping( options).toPromise();
    }

    /**
     * Entries already stored are ignored, so a switch can safely resend entries it hasn\'t had acknowledged.
     * Upload log entries from a switch
     * @param param the request object
     */
    public postLogsWithHttpInfo(param: DefaultApiPostLogsRequest, options?: ConfigurationOptions): Promise<HttpInfo<PostLogsResponseBody>> {
        return this.api.postLogsWithHttpInfo(param.PostLogsRequestBody,  options).toPromise();
    }

    /**
     * Entries already stored are ignored, so a switch can safely resend entries it hasn\'t had acknowledged.
     * Upload log entries from a switch
     * @param param the request object
     */
    public postLogs(param: DefaultApiPostLogsRequest, options?: ConfigurationOptions): Promise<PostLogsResponseBody> {
        return this.api.postLogs(param.PostLogsRequestBody,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public pressWithHttpInfo(param: DefaultApiPressRequest, options?: ConfigurationOptions): Promise<HttpInfo<any>> {
        return this.api.pressWithHttpInfo(param.PostPressRequestBody,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public press(param: DefaultApiPressRequest, options?: ConfigurationOptions): Promise<any> {
        return this.api.press(param.PostPressRequestBody,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public putConfigWithHttpInfo(param: DefaultApiPutConfigRequest, options?: ConfigurationOptions): Promise<HttpInfo<Config>> {
        return this.api.putConfigWithHttpInfo(param.Config,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public putConfig(param: DefaultApiPutConfigRequest, options?: ConfigurationOptions): Promise<Config> {
        return this.api.putConfig(param.Config,  options).toPromise();
    }

}
