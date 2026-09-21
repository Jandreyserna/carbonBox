export interface IHttpRequest <Body = unknown, Query = unknown, Params = unknown> {
    body: Body;
    query: Query;
    params: Params;
}