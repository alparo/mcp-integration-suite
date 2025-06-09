import { logInfo } from "..";
import { ServiceEndpoints } from "../generated/IntegrationContent";

/**
 * Translate internal CPI Protocol names
 */
const cpiProtocolMap: { [protocol: string]: { URIProtocol: string } } = {
    "REST": {
        URIProtocol: '/http/',
    },
    "AS2": {
        URIProtocol: '/as2/as2/'
    },
    "SOAP": {
        URIProtocol: '/cfx/soapapi/'
    }
};

/**
 * Get Endpoint URL for IFLOWs based on ServiceEndpoints entity
 * @param ServiceEndpoints from api 
 * @returns string of the actual URL of the endpoint or empty string
 */
export const getEndpointUrl = (endpoint: ServiceEndpoints): string => {
    const endpointIdentifier = endpoint.id.split('=')[1];

    if (!endpointIdentifier || ! endpoint.protocol) {
        logInfo('Could not find endpoint identifier for endpoint object:');
        logInfo(JSON.stringify(endpoint)); // Log the raw object, remove .toJSON()
        return '';
    }

    const protocolObj = cpiProtocolMap[endpoint.protocol];

    if (!protocolObj) {
        logInfo('Unsupported Protocol for endpoint object:');
        logInfo(JSON.stringify(endpoint)); // Log the raw object, remove .toJSON()
        return '';
    }

    // for now only supports https://
    if (!process.env['CPI_BASE_URL']) {
        return '';
    }
    return `${process.env['CPI_BASE_URL']}${protocolObj.URIProtocol}${endpointIdentifier}`;
}

