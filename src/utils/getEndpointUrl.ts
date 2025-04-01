import { logInfo } from "..";
import { ServiceEndpoints } from "../generated/IntegrationContent";

const cpiProtocolMap: { [protocol: string]: { trailingProtocol: string, URIProtocol: string } } = {
    "REST": {
        trailingProtocol: 'https',
        URIProtocol: '/http/',
    },
    "AS2": {
        trailingProtocol: 'https',
        URIProtocol: '/as2/as2/'
    },
    "SOAP": {
        trailingProtocol: 'https',
        URIProtocol: '/cfx/soapapi/'
    }

};

export const getEndpointUrl = (endpoint: ServiceEndpoints): string => {
    const endpointIdentifier = endpoint.id.split('=')[1];

    if (!endpointIdentifier || ! endpoint.protocol) {
        logInfo('Could not find endpoint identifier:');
        logInfo(JSON.stringify(endpoint.toJSON()));
        return '';
    }

    const protocolObj = cpiProtocolMap[endpoint.protocol];

    if (!protocolObj) {
        logInfo('Unsupported Protocol');
        logInfo(JSON.stringify(endpoint.toJSON()));
        return '';
    }

    return `${protocolObj.trailingProtocol}://${process.env['CPI_BASE_URL']}${protocolObj.URIProtocol}${endpointIdentifier}`;
}