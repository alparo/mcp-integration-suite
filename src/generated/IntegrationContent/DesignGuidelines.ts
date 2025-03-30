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
import type { DesignGuidelinesApi } from './DesignGuidelinesApi';

/**
 * This class represents the entity "DesignGuidelines" of service "com.sap.hci.api".
 */
export class DesignGuidelines<T extends DeSerializers = DefaultDeSerializers>
  extends Entity
  implements DesignGuidelinesType<T>
{
  /**
   * Technical entity name for DesignGuidelines.
   */
  static override _entityName = 'DesignGuidelines';
  /**
   * Default url path for the according service.
   */
  static override _defaultBasePath = '/';
  /**
   * All key fields of the DesignGuidelines entity.
   */
  static _keys = ['GuidelineId'];
  /**
   * Guideline Id.
   */
  declare guidelineId: DeserializedType<T, 'Edm.String'>;
  /**
   * Guideline Name.
   * @nullable
   */
  declare guidelineName?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Category.
   * @nullable
   */
  declare category?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Severity.
   * @nullable
   */
  declare severity?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Applicability.
   * @nullable
   */
  declare applicability?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Compliance.
   * @nullable
   */
  declare compliance?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Is Guideline Skipped.
   * @nullable
   */
  declare isGuidelineSkipped?: DeserializedType<T, 'Edm.Boolean'> | null;
  /**
   * Skip Reason.
   * @nullable
   */
  declare skipReason?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Skipped By.
   * @nullable
   */
  declare skippedBy?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Expected Kpi.
   * @nullable
   */
  declare expectedKpi?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Actual Kpi.
   * @nullable
   */
  declare actualKpi?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Violated Components.
   * @nullable
   */
  declare violatedComponents?: DeserializedType<T, 'Edm.String'> | null;

  constructor(_entityApi: DesignGuidelinesApi<T>) {
    super(_entityApi);
  }
}

export interface DesignGuidelinesType<
  T extends DeSerializers = DefaultDeSerializers
> {
  guidelineId: DeserializedType<T, 'Edm.String'>;
  guidelineName?: DeserializedType<T, 'Edm.String'> | null;
  category?: DeserializedType<T, 'Edm.String'> | null;
  severity?: DeserializedType<T, 'Edm.String'> | null;
  applicability?: DeserializedType<T, 'Edm.String'> | null;
  compliance?: DeserializedType<T, 'Edm.String'> | null;
  isGuidelineSkipped?: DeserializedType<T, 'Edm.Boolean'> | null;
  skipReason?: DeserializedType<T, 'Edm.String'> | null;
  skippedBy?: DeserializedType<T, 'Edm.String'> | null;
  expectedKpi?: DeserializedType<T, 'Edm.String'> | null;
  actualKpi?: DeserializedType<T, 'Edm.String'> | null;
  violatedComponents?: DeserializedType<T, 'Edm.String'> | null;
}
