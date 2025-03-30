/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { IntegrationRuntimeArtifacts_1 } from './IntegrationRuntimeArtifacts_1';
import { IntegrationRuntimeArtifacts_1RequestBuilder } from './IntegrationRuntimeArtifacts_1RequestBuilder';
import { RuntimeArtifactErrorInformationsApi } from './RuntimeArtifactErrorInformationsApi';
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
  OneToOneLink
} from '@sap-cloud-sdk/odata-v2';
export class IntegrationRuntimeArtifacts_1Api<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements
    EntityApi<IntegrationRuntimeArtifacts_1<DeSerializersT>, DeSerializersT>
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
  ): IntegrationRuntimeArtifacts_1Api<DeSerializersT> {
    return new IntegrationRuntimeArtifacts_1Api(deSerializers);
  }

  private navigationPropertyFields!: {
    /**
     * Static representation of the one-to-one navigation property {@link errorInformation_1} for query construction.
     * Use to reference this property in query operations such as 'select' in the fluent request API.
     */
    ERROR_INFORMATION_1: OneToOneLink<
      IntegrationRuntimeArtifacts_1<DeSerializersT>,
      DeSerializersT,
      RuntimeArtifactErrorInformationsApi<DeSerializersT>
    >;
  };

  _addNavigationProperties(
    linkedApis: [RuntimeArtifactErrorInformationsApi<DeSerializersT>]
  ): this {
    this.navigationPropertyFields = {
      ERROR_INFORMATION_1: new OneToOneLink(
        'ErrorInformation',
        this,
        linkedApis[0]
      )
    };
    return this;
  }

  entityConstructor = IntegrationRuntimeArtifacts_1;

  requestBuilder(): IntegrationRuntimeArtifacts_1RequestBuilder<DeSerializersT> {
    return new IntegrationRuntimeArtifacts_1RequestBuilder<DeSerializersT>(
      this
    );
  }

  entityBuilder(): EntityBuilderType<
    IntegrationRuntimeArtifacts_1<DeSerializersT>,
    DeSerializersT
  > {
    return entityBuilder<
      IntegrationRuntimeArtifacts_1<DeSerializersT>,
      DeSerializersT
    >(this);
  }

  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable: NullableT = false as NullableT
  ): CustomField<
    IntegrationRuntimeArtifacts_1<DeSerializersT>,
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
    typeof IntegrationRuntimeArtifacts_1,
    DeSerializersT
  >;
  get fieldBuilder() {
    if (!this._fieldBuilder) {
      this._fieldBuilder = new FieldBuilder(
        IntegrationRuntimeArtifacts_1,
        this.deSerializers
      );
    }
    return this._fieldBuilder;
  }

  private _schema?: {
    ID_1: OrderableEdmTypeField<
      IntegrationRuntimeArtifacts_1<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    VERSION_1: OrderableEdmTypeField<
      IntegrationRuntimeArtifacts_1<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    NAME_1: OrderableEdmTypeField<
      IntegrationRuntimeArtifacts_1<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    TYPE_1: OrderableEdmTypeField<
      IntegrationRuntimeArtifacts_1<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    DEPLOYED_BY_1: OrderableEdmTypeField<
      IntegrationRuntimeArtifacts_1<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    DEPLOYED_ON_1: OrderableEdmTypeField<
      IntegrationRuntimeArtifacts_1<DeSerializers>,
      DeSerializersT,
      'Edm.DateTime',
      true,
      true
    >;
    STATUS_1: OrderableEdmTypeField<
      IntegrationRuntimeArtifacts_1<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    /**
     * Static representation of the one-to-one navigation property {@link errorInformation_1} for query construction.
     * Use to reference this property in query operations such as 'select' in the fluent request API.
     */
    ERROR_INFORMATION_1: OneToOneLink<
      IntegrationRuntimeArtifacts_1<DeSerializersT>,
      DeSerializersT,
      RuntimeArtifactErrorInformationsApi<DeSerializersT>
    >;
    ALL_FIELDS: AllFields<IntegrationRuntimeArtifacts_1<DeSerializers>>;
  };

  get schema() {
    if (!this._schema) {
      const fieldBuilder = this.fieldBuilder;
      this._schema = {
        /**
         * Static representation of the {@link id_1} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        ID_1: fieldBuilder.buildEdmTypeField('Id', 'Edm.String', false),
        /**
         * Static representation of the {@link version_1} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        VERSION_1: fieldBuilder.buildEdmTypeField(
          'Version',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link name_1} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        NAME_1: fieldBuilder.buildEdmTypeField('Name', 'Edm.String', true),
        /**
         * Static representation of the {@link type_1} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        TYPE_1: fieldBuilder.buildEdmTypeField('Type', 'Edm.String', true),
        /**
         * Static representation of the {@link deployedBy_1} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        DEPLOYED_BY_1: fieldBuilder.buildEdmTypeField(
          'DeployedBy',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link deployedOn_1} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        DEPLOYED_ON_1: fieldBuilder.buildEdmTypeField(
          'DeployedOn',
          'Edm.DateTime',
          true
        ),
        /**
         * Static representation of the {@link status_1} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        STATUS_1: fieldBuilder.buildEdmTypeField('Status', 'Edm.String', true),
        ...this.navigationPropertyFields,
        /**
         *
         * All fields selector.
         */
        ALL_FIELDS: new AllFields('*', IntegrationRuntimeArtifacts_1)
      };
    }

    return this._schema;
  }
}
