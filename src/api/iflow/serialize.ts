import { integrationContent } from "../../generated/IntegrationContent/service";

const { messageMappingDesigntimeArtifactsApi } = integrationContent();

messageMappingDesigntimeArtifactsApi.requestBuilder().getByKey('test', 'active').addCustomQueryParameters({ "$value": "" })