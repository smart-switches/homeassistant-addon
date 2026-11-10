import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, PromiseConfigurationOptions, wrapOptions } from '../configuration'
import { PromiseMiddleware, Middleware, PromiseMiddlewareWrapper } from '../middleware';

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
import { ObservableDefaultApi } from './ObservableAPI';

import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";
export class PromiseDefaultApi {
    private api: ObservableDefaultApi

    public constructor(
        configuration: Configuration,
        requestFactory?: DefaultApiRequestFactory,
        responseProcessor?: DefaultApiResponseProcessor
    ) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     */
    public getConfigWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<Config>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getConfigWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     */
    public getConfig(_options?: PromiseConfigurationOptions): Promise<Config> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getConfig(observableOptions);
        return result.toPromise();
    }

    /**
     * Returns the definitions of all supported layout versions, including which buttons they support
     * Get available layout definitions
     */
    public getLayoutDefinitionsWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<{ [key: string]: LayoutDefinition; }>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getLayoutDefinitionsWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     * Returns the definitions of all supported layout versions, including which buttons they support
     * Get available layout definitions
     */
    public getLayoutDefinitions(_options?: PromiseConfigurationOptions): Promise<{ [key: string]: LayoutDefinition; }> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getLayoutDefinitions(observableOptions);
        return result.toPromise();
    }

    /**
     * Fetch the stored log entries for a switch
     * @param _switch Name of the switch to fetch logs for
     */
    public getLogsWithHttpInfo(_switch: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<GetLogsResponseBody>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getLogsWithHttpInfo(_switch, observableOptions);
        return result.toPromise();
    }

    /**
     * Fetch the stored log entries for a switch
     * @param _switch Name of the switch to fetch logs for
     */
    public getLogs(_switch: string, _options?: PromiseConfigurationOptions): Promise<GetLogsResponseBody> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getLogs(_switch, observableOptions);
        return result.toPromise();
    }

    /**
     * @param name Name of the switch
     * @param layout_version Layout version configured on the switch
     */
    public getSwitchWithHttpInfo(name: string, layout_version: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<LayoutInstance>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getSwitchWithHttpInfo(name, layout_version, observableOptions);
        return result.toPromise();
    }

    /**
     * @param name Name of the switch
     * @param layout_version Layout version configured on the switch
     */
    public getSwitch(name: string, layout_version: string, _options?: PromiseConfigurationOptions): Promise<LayoutInstance> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getSwitch(name, layout_version, observableOptions);
        return result.toPromise();
    }

    /**
     */
    public listExecutablesWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<ListExecutablesResponseBody>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.listExecutablesWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     */
    public listExecutables(_options?: PromiseConfigurationOptions): Promise<ListExecutablesResponseBody> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.listExecutables(observableOptions);
        return result.toPromise();
    }

    /**
     * Validate connectivity to the server
     */
    public pingWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<PingResponseBody>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.pingWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     * Validate connectivity to the server
     */
    public ping(_options?: PromiseConfigurationOptions): Promise<PingResponseBody> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.ping(observableOptions);
        return result.toPromise();
    }

    /**
     * Entries already stored are ignored, so a switch can safely resend entries it hasn\'t had acknowledged.
     * Upload log entries from a switch
     * @param PostLogsRequestBody
     */
    public postLogsWithHttpInfo(PostLogsRequestBody: PostLogsRequestBody, _options?: PromiseConfigurationOptions): Promise<HttpInfo<PostLogsResponseBody>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.postLogsWithHttpInfo(PostLogsRequestBody, observableOptions);
        return result.toPromise();
    }

    /**
     * Entries already stored are ignored, so a switch can safely resend entries it hasn\'t had acknowledged.
     * Upload log entries from a switch
     * @param PostLogsRequestBody
     */
    public postLogs(PostLogsRequestBody: PostLogsRequestBody, _options?: PromiseConfigurationOptions): Promise<PostLogsResponseBody> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.postLogs(PostLogsRequestBody, observableOptions);
        return result.toPromise();
    }

    /**
     * @param PostPressRequestBody
     */
    public pressWithHttpInfo(PostPressRequestBody: PostPressRequestBody, _options?: PromiseConfigurationOptions): Promise<HttpInfo<any>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.pressWithHttpInfo(PostPressRequestBody, observableOptions);
        return result.toPromise();
    }

    /**
     * @param PostPressRequestBody
     */
    public press(PostPressRequestBody: PostPressRequestBody, _options?: PromiseConfigurationOptions): Promise<any> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.press(PostPressRequestBody, observableOptions);
        return result.toPromise();
    }

    /**
     * @param Config
     */
    public putConfigWithHttpInfo(Config: Config, _options?: PromiseConfigurationOptions): Promise<HttpInfo<Config>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.putConfigWithHttpInfo(Config, observableOptions);
        return result.toPromise();
    }

    /**
     * @param Config
     */
    public putConfig(Config: Config, _options?: PromiseConfigurationOptions): Promise<Config> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.putConfig(Config, observableOptions);
        return result.toPromise();
    }


}



