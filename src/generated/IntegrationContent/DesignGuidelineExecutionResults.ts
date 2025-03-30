/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import {
  Entity,
  DefaultDeSerializers,
  DeSerializers,
  DeserializedType
} from '@sap-cloud-sdk/odata-v2';
import type { DesignGuidelineExecutionResultsApi } from './DesignGuidelineExecutionResultsApi';
import { DesignGuidelines, DesignGuidelinesType } from './DesignGuidelines';

/**
 * This class represents the entity "DesignGuidelineExecutionResults" of service "com.sap.hci.api".
 */
export class DesignGuidelineExecutionResults<
    T extends DeSerializers = DefaultDeSerializers
  >
  extends Entity
  implements DesignGuidelineExecutionResultsType<T>
{
  /**
   * Technical entity name for DesignGuidelineExecutionResults.
   */
  static override _entityName = 'DesignGuidelineExecutionResults';
  /**
   * Default url path for the according service.
   */
  static override _defaultBasePath = '/';
  /**
   * All key fields of the DesignGuidelineExecutionResults entity.
   */
  static _keys = ['ExecutionId'];
  /**
   * Execution Id.
   */
  declare executionId: DeserializedType<T, 'Edm.String'>;
  /**
   * Artifact Version.
   * @nullable
   */
  declare artifactVersion?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Execution Status.
   * @nullable
   */
  declare executionStatus?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Execution Time.
   * @nullable
   */
  declare executionTime?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Report Type.
   * @nullable
   */
  declare reportType?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * One-to-many navigation property to the {@link DesignGuidelines} entity.
   */
  declare designGuidelines: DesignGuidelines<T>[];

  constructor(_entityApi: DesignGuidelineExecutionResultsApi<T>) {
    super(_entityApi);
  }
}

export interface DesignGuidelineExecutionResultsType<
  T extends DeSerializers = DefaultDeSerializers
> {
  executionId: DeserializedType<T, 'Edm.String'>;
  artifactVersion?: DeserializedType<T, 'Edm.String'> | null;
  executionStatus?: DeserializedType<T, 'Edm.String'> | null;
  executionTime?: DeserializedType<T, 'Edm.String'> | null;
  reportType?: DeserializedType<T, 'Edm.String'> | null;
  designGuidelines: DesignGuidelinesType<T>[];
}
