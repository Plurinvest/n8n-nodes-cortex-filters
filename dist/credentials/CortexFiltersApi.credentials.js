"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CortexFiltersApi = void 0;
class CortexFiltersApi {
    constructor() {
        this.name = 'cortexFiltersApi';
        this.displayName = 'Cortex Filters API';
        this.properties = [
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: '',
                placeholder: 'https://api.example.com/api',
                description: 'Prepended to the endpoint path set on the node',
            },
            {
                displayName: 'Authentication',
                name: 'authType',
                type: 'options',
                options: [
                    { name: 'Bearer Token', value: 'bearer' },
                    { name: 'Custom Header', value: 'header' },
                    { name: 'None', value: 'none' },
                ],
                default: 'bearer',
            },
            {
                displayName: 'Token',
                name: 'token',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                displayOptions: { show: { authType: ['bearer'] } },
            },
            {
                displayName: 'Header Name',
                name: 'headerName',
                type: 'string',
                default: 'X-API-Key',
                displayOptions: { show: { authType: ['header'] } },
            },
            {
                displayName: 'Header Value',
                name: 'headerValue',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                displayOptions: { show: { authType: ['header'] } },
            },
        ];
        // Applied manually in the node (auth type is conditional), kept for credential UI consistency.
        this.authenticate = { type: 'generic', properties: {} };
    }
}
exports.CortexFiltersApi = CortexFiltersApi;
