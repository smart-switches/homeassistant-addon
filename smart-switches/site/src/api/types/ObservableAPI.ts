import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, ConfigurationOptions, mergeConfiguration } from '../configuration'
import type { Middleware } from '../middleware';
import { Observable, of, from } from '../rxjsStub';
import {mergeMap, map} from  '../rxjsStub';
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

import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";
export class ObservableDefaultApi {
    private requestFactory: DefaultApiRequestFactory;
    private responseProcessor: DefaultApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: DefaultApiRequestFactory,
        responseProcessor?: DefaultApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new DefaultApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new DefaultApiResponseProcessor();
    }

    /**
     */
    public getConfigWithHttpInfo(_options?: ConfigurationOptions): Observable<HttpInfo<Config>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.getConfig(_config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getConfigWithHttpInfo(rsp)));
            }));
    }

    /**
     */
    public getConfig(_options?: ConfigurationOptions): Observable<Config> {
        return this.getConfigWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<Config>) => apiResponse.data));
    }

    /**
     * Returns the definitions of all supported layout versions, including which buttons they support
     * Get available layout definitions
     */
    public getLayoutDefinitionsWithHttpInfo(_options?: ConfigurationOptions): Observable<HttpInfo<{ [key: string]: LayoutDefinition; }>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.getLayoutDefinitions(_config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getLayoutDefinitionsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Returns the definitions of all supported layout versions, including which buttons they support
     * Get available layout definitions
     */
    public getLayoutDefinitions(_options?: ConfigurationOptions): Observable<{ [key: string]: LayoutDefinition; }> {
        return this.getLayoutDefinitionsWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<{ [key: string]: LayoutDefinition; }>) => apiResponse.data));
    }

    /**
     * Fetch the stored log entries for a switch
     * @param _switch Name of the switch to fetch logs for
     */
    public getLogsWithHttpInfo(_switch: string, _options?: ConfigurationOptions): Observable<HttpInfo<GetLogsResponseBody>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.getLogs(_switch, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getLogsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Fetch the stored log entries for a switch
     * @param _switch Name of the switch to fetch logs for
     */
    public getLogs(_switch: string, _options?: ConfigurationOptions): Observable<GetLogsResponseBody> {
        return this.getLogsWithHttpInfo(_switch, _options).pipe(map((apiResponse: HttpInfo<GetLogsResponseBody>) => apiResponse.data));
    }

    /**
     * @param name Name of the switch
     * @param layout_version Layout version configured on the switch
     */
    public getSwitchWithHttpInfo(name: string, layout_version: string, _options?: ConfigurationOptions): Observable<HttpInfo<LayoutInstance>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.getSwitch(name, layout_version, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getSwitchWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param name Name of the switch
     * @param layout_version Layout version configured on the switch
     */
    public getSwitch(name: string, layout_version: string, _options?: ConfigurationOptions): Observable<LayoutInstance> {
        return this.getSwitchWithHttpInfo(name, layout_version, _options).pipe(map((apiResponse: HttpInfo<LayoutInstance>) => apiResponse.data));
    }

    /**
     */
    public listExecutablesWithHttpInfo(_options?: ConfigurationOptions): Observable<HttpInfo<ListExecutablesResponseBody>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.listExecutables(_config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listExecutablesWithHttpInfo(rsp)));
            }));
    }

    /**
     */
    public listExecutables(_options?: ConfigurationOptions): Observable<ListExecutablesResponseBody> {
        return this.listExecutablesWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<ListExecutablesResponseBody>) => apiResponse.data));
    }

    /**
     * Validate connectivity to the server
     */
    public pingWithHttpInfo(_options?: ConfigurationOptions): Observable<HttpInfo<PingResponseBody>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.ping(_config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.pingWithHttpInfo(rsp)));
            }));
    }

    /**
     * Validate connectivity to the server
     */
    public ping(_options?: ConfigurationOptions): Observable<PingResponseBody> {
        return this.pingWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<PingResponseBody>) => apiResponse.data));
    }

    /**
     * Entries already stored are ignored, so a switch can safely resend entries it hasn\'t had acknowledged.
     * Upload log entries from a switch
     * @param PostLogsRequestBody
     */
    public postLogsWithHttpInfo(PostLogsRequestBody: PostLogsRequestBody, _options?: ConfigurationOptions): Observable<HttpInfo<PostLogsResponseBody>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.postLogs(PostLogsRequestBody, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.postLogsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Entries already stored are ignored, so a switch can safely resend entries it hasn\'t had acknowledged.
     * Upload log entries from a switch
     * @param PostLogsRequestBody
     */
    public postLogs(PostLogsRequestBody: PostLogsRequestBody, _options?: ConfigurationOptions): Observable<PostLogsResponseBody> {
        return this.postLogsWithHttpInfo(PostLogsRequestBody, _options).pipe(map((apiResponse: HttpInfo<PostLogsResponseBody>) => apiResponse.data));
    }

    /**
     * @param PostPressRequestBody
     */
    public pressWithHttpInfo(PostPressRequestBody: PostPressRequestBody, _options?: ConfigurationOptions): Observable<HttpInfo<any>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.press(PostPressRequestBody, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.pressWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param PostPressRequestBody
     */
    public press(PostPressRequestBody: PostPressRequestBody, _options?: ConfigurationOptions): Observable<any> {
        return this.pressWithHttpInfo(PostPressRequestBody, _options).pipe(map((apiResponse: HttpInfo<any>) => apiResponse.data));
    }

    /**
     * @param Config
     */
    public putConfigWithHttpInfo(Config: Config, _options?: ConfigurationOptions): Observable<HttpInfo<Config>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.putConfig(Config, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.putConfigWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param Config
     */
    public putConfig(Config: Config, _options?: ConfigurationOptions): Observable<Config> {
        return this.putConfigWithHttpInfo(Config, _options).pipe(map((apiResponse: HttpInfo<Config>) => apiResponse.data));
    }

}
