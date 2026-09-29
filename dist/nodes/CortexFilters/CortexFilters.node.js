"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CortexFilters = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const csv = (v) => String(v !== null && v !== void 0 ? v : '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .join(',');
class CortexFilters {
    constructor() {
        this.description = {
            displayName: 'Cortex Filters',
            name: 'cortexFilters',
            icon: 'file:cortexFilters.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["method"] + " " + $parameter["endpoint"]}}',
            description: 'HTTP request with Spatie Query Builder fields (filter, include, sort, fields, append)',
            defaults: { name: 'Cortex Filters' },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [{ name: 'cortexFiltersApi', required: false }],
            properties: [
                {
                    displayName: 'Method',
                    name: 'method',
                    type: 'options',
                    options: [
                        { name: 'DELETE', value: 'DELETE' },
                        { name: 'GET', value: 'GET' },
                        { name: 'PATCH', value: 'PATCH' },
                        { name: 'POST', value: 'POST' },
                        { name: 'PUT', value: 'PUT' },
                    ],
                    default: 'GET',
                },
                {
                    displayName: 'Endpoint',
                    name: 'endpoint',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: '/users',
                    description: 'Path appended to the credential Base URL. A full URL (http…) is used as is, and also works without credentials.',
                },
                // ---------- Spatie Query Builder ----------
                {
                    displayName: 'Filters',
                    name: 'filters',
                    type: 'fixedCollection',
                    typeOptions: { multipleValues: true },
                    placeholder: 'Add Filter',
                    default: {},
                    description: 'Becomes filter[name]=value. Comma-separated values are sent as-is (Spatie treats them as arrays).',
                    options: [
                        {
                            name: 'items',
                            displayName: 'Filter',
                            values: [
                                {
                                    displayName: 'Name',
                                    name: 'name',
                                    type: 'string',
                                    default: '',
                                    placeholder: 'name or relation.field',
                                    description: 'Filter name as declared in allowedFilters()',
                                },
                                {
                                    displayName: 'Operator',
                                    name: 'operator',
                                    type: 'string',
                                    default: '',
                                    placeholder: 'gte (optional)',
                                    description: 'Optional. When set, sends filter[name][operator]=value, for custom filters on your API. Leave empty for the standard filter[name]=value.',
                                },
                                {
                                    displayName: 'Value',
                                    name: 'value',
                                    type: 'string',
                                    default: '',
                                    placeholder: 'john or a,b,c',
                                },
                            ],
                        },
                    ],
                },
                {
                    displayName: 'Includes',
                    name: 'includes',
                    type: 'string',
                    default: '',
                    placeholder: 'posts,posts.comments,profile',
                    description: 'Comma-separated relationships → include=…',
                },
                {
                    displayName: 'Sorts',
                    name: 'sorts',
                    type: 'fixedCollection',
                    typeOptions: { multipleValues: true },
                    placeholder: 'Add Sort',
                    default: {},
                    description: 'Becomes sort=-created_at,name',
                    options: [
                        {
                            name: 'items',
                            displayName: 'Sort',
                            values: [
                                { displayName: 'Field', name: 'field', type: 'string', default: '' },
                                {
                                    displayName: 'Direction',
                                    name: 'direction',
                                    type: 'options',
                                    options: [
                                        { name: 'Ascending', value: 'asc' },
                                        { name: 'Descending', value: 'desc' },
                                    ],
                                    default: 'asc',
                                },
                            ],
                        },
                    ],
                },
                {
                    displayName: 'Fields (Sparse Fieldsets)',
                    name: 'fields',
                    type: 'fixedCollection',
                    typeOptions: { multipleValues: true },
                    placeholder: 'Add Fieldset',
                    default: {},
                    description: 'Becomes fields[table]=a,b',
                    options: [
                        {
                            name: 'items',
                            displayName: 'Fieldset',
                            values: [
                                {
                                    displayName: 'Resource / Table',
                                    name: 'resource',
                                    type: 'string',
                                    default: '',
                                    placeholder: 'users',
                                },
                                {
                                    displayName: 'Fields',
                                    name: 'columns',
                                    type: 'string',
                                    default: '',
                                    placeholder: 'id,name,email',
                                },
                            ],
                        },
                    ],
                },
                {
                    displayName: 'Appends',
                    name: 'appends',
                    type: 'string',
                    default: '',
                    placeholder: 'full_name,avatar_url',
                    description: 'Comma-separated accessors → append=…',
                },
                // ---------- Pagination ----------
                {
                    displayName: 'Pagination',
                    name: 'paginationMode',
                    type: 'options',
                    displayOptions: { show: { method: ['GET'] } },
                    options: [
                        { name: 'None', value: 'none' },
                        { name: 'Single Page', value: 'page', description: 'Send page and per-page parameters' },
                        {
                            name: 'Fetch All Pages',
                            value: 'all',
                            description: 'Follow pages until the last one (Laravel paginator: meta.last_page / last_page / links.next)',
                        },
                    ],
                    default: 'none',
                },
                {
                    displayName: 'Page',
                    name: 'page',
                    type: 'number',
                    typeOptions: { minValue: 1 },
                    default: 1,
                    displayOptions: { show: { method: ['GET'], paginationMode: ['page'] } },
                },
                {
                    displayName: 'Per Page',
                    name: 'perPage',
                    type: 'number',
                    typeOptions: { minValue: 1 },
                    default: 50,
                    displayOptions: { show: { method: ['GET'], paginationMode: ['page', 'all'] } },
                },
                {
                    displayName: 'Max Pages',
                    name: 'maxPages',
                    type: 'number',
                    typeOptions: { minValue: 1 },
                    default: 100,
                    displayOptions: { show: { method: ['GET'], paginationMode: ['all'] } },
                    description: 'Safety cap on the number of requests',
                },
                // ---------- Body ----------
                {
                    displayName: 'Send Body',
                    name: 'sendBody',
                    type: 'boolean',
                    default: false,
                    displayOptions: { show: { method: ['POST', 'PUT', 'PATCH', 'DELETE'] } },
                },
                {
                    displayName: 'Body (JSON)',
                    name: 'body',
                    type: 'json',
                    default: '{}',
                    displayOptions: { show: { sendBody: [true], method: ['POST', 'PUT', 'PATCH', 'DELETE'] } },
                },
                // ---------- Extras ----------
                {
                    displayName: 'Additional Query Parameters',
                    name: 'extraQuery',
                    type: 'fixedCollection',
                    typeOptions: { multipleValues: true },
                    placeholder: 'Add Parameter',
                    default: {},
                    options: [
                        {
                            name: 'items',
                            displayName: 'Parameter',
                            values: [
                                { displayName: 'Name', name: 'name', type: 'string', default: '' },
                                { displayName: 'Value', name: 'value', type: 'string', default: '' },
                            ],
                        },
                    ],
                },
                {
                    displayName: 'Headers',
                    name: 'headers',
                    type: 'fixedCollection',
                    typeOptions: { multipleValues: true },
                    placeholder: 'Add Header',
                    default: {},
                    options: [
                        {
                            name: 'items',
                            displayName: 'Header',
                            values: [
                                { displayName: 'Name', name: 'name', type: 'string', default: '' },
                                { displayName: 'Value', name: 'value', type: 'string', default: '' },
                            ],
                        },
                    ],
                },
                {
                    displayName: 'Options',
                    name: 'options',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'Data Property',
                            name: 'dataProperty',
                            type: 'string',
                            default: 'data',
                            description: 'Response property holding the records; each element becomes one output item. Leave empty to return the whole response as one item.',
                        },
                        {
                            displayName: 'Full Response',
                            name: 'fullResponse',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to return status code and headers along with the body',
                        },
                        {
                            displayName: 'Ignore SSL Issues',
                            name: 'allowUnauthorizedCerts',
                            type: 'boolean',
                            default: false,
                        },
                        {
                            displayName: 'Timeout (Ms)',
                            name: 'timeout',
                            type: 'number',
                            default: 30000,
                        },
                        {
                            displayName: 'Query Key: Filter',
                            name: 'keyFilter',
                            type: 'string',
                            default: 'filter',
                            description: 'Rename if you changed query-builder.parameters.filter in Laravel config',
                        },
                        {
                            displayName: 'Query Key: Include',
                            name: 'keyInclude',
                            type: 'string',
                            default: 'include',
                        },
                        {
                            displayName: 'Query Key: Sort',
                            name: 'keySort',
                            type: 'string',
                            default: 'sort',
                        },
                        {
                            displayName: 'Query Key: Fields',
                            name: 'keyFields',
                            type: 'string',
                            default: 'fields',
                        },
                        {
                            displayName: 'Query Key: Append',
                            name: 'keyAppend',
                            type: 'string',
                            default: 'append',
                        },
                        {
                            displayName: 'Query Key: Page',
                            name: 'keyPage',
                            type: 'string',
                            default: 'page',
                            description: 'Use e.g. page[number] for JSON:API style paginators',
                        },
                        {
                            displayName: 'Query Key: Per Page',
                            name: 'keyPerPage',
                            type: 'string',
                            default: 'per_page',
                            description: 'Use e.g. page[size] for JSON:API style paginators',
                        },
                    ],
                },
            ],
        };
    }
    async execute() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        const items = this.getInputData();
        const out = [];
        let cred;
        try {
            cred = (await this.getCredentials('cortexFiltersApi'));
        }
        catch {
            cred = undefined;
        }
        for (let i = 0; i < items.length; i++) {
            try {
                const method = this.getNodeParameter('method', i);
                const endpoint = this.getNodeParameter('endpoint', i).trim();
                const opts = this.getNodeParameter('options', i, {});
                const k = (name, def) => opts[name] || def;
                // ----- URL -----
                let url = endpoint;
                if (!/^https?:\/\//i.test(endpoint)) {
                    const base = String((_a = cred === null || cred === void 0 ? void 0 : cred.baseUrl) !== null && _a !== void 0 ? _a : '').replace(/\/+$/, '');
                    if (!base) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Set a full URL in Endpoint, or add credentials with a Base URL', { itemIndex: i });
                    }
                    url = `${base}/${endpoint.replace(/^\/+/, '')}`;
                }
                // ----- Spatie query -----
                const qs = {};
                const filters = (_b = this.getNodeParameter('filters.items', i, [])) !== null && _b !== void 0 ? _b : [];
                for (const f of filters) {
                    const name = String((_c = f.name) !== null && _c !== void 0 ? _c : '').trim();
                    if (!name)
                        continue;
                    const op = String((_d = f.operator) !== null && _d !== void 0 ? _d : '').trim();
                    qs[`${k('keyFilter', 'filter')}[${name}]${op ? `[${op}]` : ''}`] = String((_e = f.value) !== null && _e !== void 0 ? _e : '');
                }
                const includes = csv(this.getNodeParameter('includes', i, ''));
                if (includes)
                    qs[k('keyInclude', 'include')] = includes;
                const sorts = (_f = this.getNodeParameter('sorts.items', i, [])) !== null && _f !== void 0 ? _f : [];
                const sortStr = sorts
                    .filter((s) => { var _a; return String((_a = s.field) !== null && _a !== void 0 ? _a : '').trim(); })
                    .map((s) => `${s.direction === 'desc' ? '-' : ''}${String(s.field).trim()}`)
                    .join(',');
                if (sortStr)
                    qs[k('keySort', 'sort')] = sortStr;
                const fields = (_g = this.getNodeParameter('fields.items', i, [])) !== null && _g !== void 0 ? _g : [];
                for (const f of fields) {
                    const res = String((_h = f.resource) !== null && _h !== void 0 ? _h : '').trim();
                    const cols = csv(f.columns);
                    if (res && cols)
                        qs[`${k('keyFields', 'fields')}[${res}]`] = cols;
                }
                const appends = csv(this.getNodeParameter('appends', i, ''));
                if (appends)
                    qs[k('keyAppend', 'append')] = appends;
                const extra = (_j = this.getNodeParameter('extraQuery.items', i, [])) !== null && _j !== void 0 ? _j : [];
                for (const e of extra) {
                    if (String((_k = e.name) !== null && _k !== void 0 ? _k : '').trim())
                        qs[String(e.name).trim()] = String((_l = e.value) !== null && _l !== void 0 ? _l : '');
                }
                // ----- headers / auth -----
                const headers = { Accept: 'application/json' };
                const authType = cred === null || cred === void 0 ? void 0 : cred.authType;
                if (authType === 'bearer' && (cred === null || cred === void 0 ? void 0 : cred.token))
                    headers.Authorization = `Bearer ${cred.token}`;
                if (authType === 'header' && (cred === null || cred === void 0 ? void 0 : cred.headerName))
                    headers[String(cred.headerName)] = String((_m = cred.headerValue) !== null && _m !== void 0 ? _m : '');
                const hs = (_o = this.getNodeParameter('headers.items', i, [])) !== null && _o !== void 0 ? _o : [];
                for (const h of hs) {
                    if (String((_p = h.name) !== null && _p !== void 0 ? _p : '').trim())
                        headers[String(h.name).trim()] = String((_q = h.value) !== null && _q !== void 0 ? _q : '');
                }
                // ----- body -----
                let body;
                if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && this.getNodeParameter('sendBody', i, false)) {
                    const raw = this.getNodeParameter('body', i, '{}');
                    try {
                        body = typeof raw === 'string' ? JSON.parse(raw) : raw;
                    }
                    catch {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Body is not valid JSON', { itemIndex: i });
                    }
                }
                const request = async (query) => {
                    const req = {
                        method,
                        url,
                        qs: query,
                        headers,
                        json: true,
                        returnFullResponse: true,
                        ignoreHttpStatusErrors: false,
                        skipSslCertificateValidation: !!opts.allowUnauthorizedCerts,
                        timeout: opts.timeout || 30000,
                    };
                    if (body !== undefined)
                        req.body = body;
                    return (await this.helpers.httpRequest(req));
                };
                const dataProp = (_r = opts.dataProperty) !== null && _r !== void 0 ? _r : 'data';
                const full = !!opts.fullResponse;
                const emit = (res) => {
                    if (full) {
                        out.push({ json: { statusCode: res.statusCode, headers: res.headers, body: res.body }, pairedItem: i });
                        return;
                    }
                    const b = res.body;
                    const records = dataProp && b && !Array.isArray(b) && Array.isArray(b[dataProp])
                        ? b[dataProp]
                        : Array.isArray(b)
                            ? b
                            : null;
                    if (records) {
                        for (const r of records) {
                            out.push({ json: (typeof r === 'object' && r !== null ? r : { value: r }), pairedItem: i });
                        }
                    }
                    else {
                        out.push({ json: (typeof b === 'object' && b !== null ? b : { value: b }), pairedItem: i });
                    }
                };
                // ----- pagination -----
                const mode = method === 'GET' ? this.getNodeParameter('paginationMode', i, 'none') : 'none';
                if (mode === 'none') {
                    emit(await request(qs));
                }
                else if (mode === 'page') {
                    emit(await request({
                        ...qs,
                        [k('keyPage', 'page')]: String(this.getNodeParameter('page', i, 1)),
                        [k('keyPerPage', 'per_page')]: String(this.getNodeParameter('perPage', i, 50)),
                    }));
                }
                else {
                    const perPage = this.getNodeParameter('perPage', i, 50);
                    const maxPages = this.getNodeParameter('maxPages', i, 100);
                    for (let page = 1; page <= maxPages; page++) {
                        const res = await request({
                            ...qs,
                            [k('keyPage', 'page')]: String(page),
                            [k('keyPerPage', 'per_page')]: String(perPage),
                        });
                        emit(res);
                        const b = ((_s = res.body) !== null && _s !== void 0 ? _s : {});
                        const meta = ((_t = b.meta) !== null && _t !== void 0 ? _t : {});
                        const links = ((_u = b.links) !== null && _u !== void 0 ? _u : {});
                        const last = Number((_w = (_v = meta.last_page) !== null && _v !== void 0 ? _v : b.last_page) !== null && _w !== void 0 ? _w : 0);
                        const hasNext = last ? page < last : !!((_x = links.next) !== null && _x !== void 0 ? _x : b.next_page_url);
                        if (!hasNext)
                            break;
                    }
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    out.push({ json: { error: error.message }, pairedItem: i });
                    continue;
                }
                if (error instanceof n8n_workflow_1.NodeOperationError)
                    throw error;
                throw new n8n_workflow_1.NodeApiError(this.getNode(), error, { itemIndex: i });
            }
        }
        return [out];
    }
}
exports.CortexFilters = CortexFilters;
