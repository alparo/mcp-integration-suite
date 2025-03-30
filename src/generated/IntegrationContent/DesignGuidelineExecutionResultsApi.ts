/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { DesignGuidelineExecutionResults } from './DesignGuidelineExecutionResults';
import { DesignGuidelineExecutionResultsRequestBuilder } from './DesignGuidelineExecutionResultsRequestBuilder';
import { DesignGuidelinesApi } from './DesignGuidelinesApi';
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
  OrderableEdmTypeField,
  Link
} from '@sap-cloud-sdk/odata-v2';
export class DesignGuidelineExecutionResultsApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements
    EntityApi<DesignGuidelineExecutionResults<DeSerializersT>, DeSerializersT>
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
  ): DesignGuidelineExecutionResultsApi<DeSerializersT> {
    return new DesignGuidelineExecutionResultsApi(deSerializers);
  }

  private navigationPropertyFields!: {
    /**
     * Static representation of the one-to-many navigation property {@link designGuidelines} for query construction.
     * Use to reference this property in query operations such as 'select' in the fluent request API.
     */
    DESIGN_GUIDELINES: Link<
      DesignGuidelineExecutionResults<DeSerializersT>,
      DeSerializersT,
      DesignGuidelinesApi<DeSerializersT>
    >;
  };

  _addNavigationProperties(
    linkedApis: [DesignGuidelinesApi<DeSerializersT>]
  ): this {
    this.navigationPropertyFields = {
      DESIGN_GUIDELINES: new Link('DesignGuidelines', this, linkedApis[0])
    };
    return this;
  }

  entityConstructor = DesignGuidelineExecutionResults;

  requestBuilder(): DesignGuidelineExecutionResultsRequestBuilder<DeSerializersT> {
    return new DesignGuidelineExecutionResultsRequestBuilder<DeSerializersT>(
      this
    );
  }

  entityBuilder(): EntityBuilderType<
    DesignGuidelineExecutionResults<DeSerializersT>,
    DeSerializersT
  > {
    return entityBuilder<
      DesignGuidelineExecutionResults<DeSerializersT>,
      DeSerializersT
    >(this);
  }

  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable: NullableT = false as NullableT
  ): CustomField<
    DesignGuidelineExecutionResults<DeSerializersT>,
    DeSerializersT,
    NullableT
  > {
    return new CustomField(
      fieldName,
      this.entityConstructor,
      this.deSerializers,
      isNullable
    ) as any;
  }

  private _fieldBuilder?: FieldBuilder<
    typeof DesignGuidelineExecutionResults,
    DeSerializersT
  >;
  get fieldBuilder() {
    if (!this._fieldBuilder) {
      this._fieldBuilder = new FieldBuilder(
        DesignGuidelineExecutionResults,
        this.deSerializers
      );
    }
    return this._fieldBuilder;
  }

  private _schema?: {
    EXECUTION_ID: OrderableEdmTypeField<
      DesignGuidelineExecutionResults<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    ARTIFACT_VERSION: OrderableEdmTypeField<
      DesignGuidelineExecutionResults<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    EXECUTION_STATUS: OrderableEdmTypeField<
      DesignGuidelineExecutionResults<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    EXECUTION_TIME: OrderableEdmTypeField<
      DesignGuidelineExecutionResults<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    REPORT_TYPE: OrderableEdmTypeField<
      DesignGuidelineExecutionResults<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    /**
     * Static representation of the one-to-many navigation property {@link designGuidelines} for query construction.
     * Use to reference this property in query operations such as 'select' in the fluent request API.
     */
    DESIGN_GUIDELINES: Link<
      DesignGuidelineExecutionResults<DeSerializersT>,
      DeSerializersT,
      DesignGuidelinesApi<DeSerializersT>
    >;
    ALL_FIELDS: AllFields<DesignGuidelineExecutionResults<DeSerializers>>;
  };

  get schema() {
    if (!this._schema) {
      const fieldBuilder = this.fieldBuilder;
      this._schema = {
        /**
         * Static representation of the {@link executionId} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        EXECUTION_ID: fieldBuilder.buildEdmTypeField(
          'ExecutionId',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link artifactVersion} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        ARTIFACT_VERSION: fieldBuilder.buildEdmTypeField(
          'ArtifactVersion',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link executionStatus} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        EXECUTION_STATUS: fieldBuilder.buildEdmTypeField(
          'ExecutionStatus',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link executionTime} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        EXECUTION_TIME: fieldBuilder.buildEdmTypeField(
          'ExecutionTime',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link reportType} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        REPORT_TYPE: fieldBuilder.buildEdmTypeField(
          'ReportType',
          'Edm.String',
          true
        ),
        ...this.navigationPropertyFields,
        /**
         *
         * All fields selector.
         */
        ALL_FIELDS: new AllFields('*', DesignGuidelineExecutionResults)
      };
    }

    return this._schema;
  }
}
