/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { DesignGuidelines } from './DesignGuidelines';
import { DesignGuidelinesRequestBuilder } from './DesignGuidelinesRequestBuilder';
import {
  CustomField,
  defaultDeSerializers,
  DefaultDeSerializers,
  DeSerializers,
  AllFields,
  entityBuilder,
  EntityBuilderType,
  EntityApi,
  FieldBuilder,
  OrderableEdmTypeField
} from '@sap-cloud-sdk/odata-v2';
export class DesignGuidelinesApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements EntityApi<DesignGuidelines<DeSerializersT>, DeSerializersT>
{
  public deSerializers: DeSerializersT;

  private constructor(
    deSerializers: DeSerializersT = defaultDeSerializers as any
  ) {
    this.deSerializers = deSerializers;
  }

  /**
   * Do not use this method or the constructor directly.
   * Use the service function as described in the documentation to get an API instance.
   */
  public static _privateFactory<
    DeSerializersT extends DeSerializers = DefaultDeSerializers
  >(
    deSerializers: DeSerializersT = defaultDeSerializers as any
  ): DesignGuidelinesApi<DeSerializersT> {
    return new DesignGuidelinesApi(deSerializers);
  }

  private navigationPropertyFields!: {};

  _addNavigationProperties(linkedApis: []): this {
    this.navigationPropertyFields = {};
    return this;
  }

  entityConstructor = DesignGuidelines;

  requestBuilder(): DesignGuidelinesRequestBuilder<DeSerializersT> {
    return new DesignGuidelinesRequestBuilder<DeSerializersT>(this);
  }

  entityBuilder(): EntityBuilderType<
    DesignGuidelines<DeSerializersT>,
    DeSerializersT
  > {
    return entityBuilder<DesignGuidelines<DeSerializersT>, DeSerializersT>(
      this
    );
  }

  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable: NullableT = false as NullableT
  ): CustomField<DesignGuidelines<DeSerializersT>, DeSerializersT, NullableT> {
    return new CustomField(
      fieldName,
      this.entityConstructor,
      this.deSerializers,
      isNullable
    ) as any;
  }

  private _fieldBuilder?: FieldBuilder<typeof DesignGuidelines, DeSerializersT>;
  get fieldBuilder() {
    if (!this._fieldBuilder) {
      this._fieldBuilder = new FieldBuilder(
        DesignGuidelines,
        this.deSerializers
      );
    }
    return this._fieldBuilder;
  }

  private _schema?: {
    GUIDELINE_ID: OrderableEdmTypeField<
      DesignGuidelines<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    GUIDELINE_NAME: OrderableEdmTypeField<
      DesignGuidelines<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    CATEGORY: OrderableEdmTypeField<
      DesignGuidelines<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    SEVERITY: OrderableEdmTypeField<
      DesignGuidelines<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    APPLICABILITY: OrderableEdmTypeField<
      DesignGuidelines<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    COMPLIANCE: OrderableEdmTypeField<
      DesignGuidelines<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    IS_GUIDELINE_SKIPPED: OrderableEdmTypeField<
      DesignGuidelines<DeSerializers>,
      DeSerializersT,
      'Edm.Boolean',
      true,
      true
    >;
    SKIP_REASON: OrderableEdmTypeField<
      DesignGuidelines<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    SKIPPED_BY: OrderableEdmTypeField<
      DesignGuidelines<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    EXPECTED_KPI: OrderableEdmTypeField<
      DesignGuidelines<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    ACTUAL_KPI: OrderableEdmTypeField<
      DesignGuidelines<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    VIOLATED_COMPONENTS: OrderableEdmTypeField<
      DesignGuidelines<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    ALL_FIELDS: AllFields<DesignGuidelines<DeSerializers>>;
  };

  get schema() {
    if (!this._schema) {
      const fieldBuilder = this.fieldBuilder;
      this._schema = {
        /**
         * Static representation of the {@link guidelineId} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        GUIDELINE_ID: fieldBuilder.buildEdmTypeField(
          'GuidelineId',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link guidelineName} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        GUIDELINE_NAME: fieldBuilder.buildEdmTypeField(
          'GuidelineName',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link category} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        CATEGORY: fieldBuilder.buildEdmTypeField(
          'Category',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link severity} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        SEVERITY: fieldBuilder.buildEdmTypeField(
          'Severity',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link applicability} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        APPLICABILITY: fieldBuilder.buildEdmTypeField(
          'Applicability',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link compliance} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        COMPLIANCE: fieldBuilder.buildEdmTypeField(
          'Compliance',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link isGuidelineSkipped} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        IS_GUIDELINE_SKIPPED: fieldBuilder.buildEdmTypeField(
          'IsGuidelineSkipped',
          'Edm.Boolean',
          true
        ),
        /**
         * Static representation of the {@link skipReason} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        SKIP_REASON: fieldBuilder.buildEdmTypeField(
          'SkipReason',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link skippedBy} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        SKIPPED_BY: fieldBuilder.buildEdmTypeField(
          'SkippedBy',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link expectedKpi} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        EXPECTED_KPI: fieldBuilder.buildEdmTypeField(
          'ExpectedKPI',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link actualKpi} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        ACTUAL_KPI: fieldBuilder.buildEdmTypeField(
          'ActualKPI',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link violatedComponents} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        VIOLATED_COMPONENTS: fieldBuilder.buildEdmTypeField(
          'ViolatedComponents',
          'Edm.String',
          true
        ),
        ...this.navigationPropertyFields,
        /**
         *
         * All fields selector.
         */
        ALL_FIELDS: new AllFields('*', DesignGuidelines)
      };
    }

    return this._schema;
  }
}
