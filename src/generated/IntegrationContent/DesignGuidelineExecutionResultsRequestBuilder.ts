/*
 * Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import {
  CreateRequestBuilder,
  DeSerializers,
  DefaultDeSerializers,
  DeleteRequestBuilder,
  DeserializedType,
  GetAllRequestBuilder,
  GetByKeyRequestBuilder,
  RequestBuilder,
  UpdateRequestBuilder
} from '@sap-cloud-sdk/odata-v2';
import { DesignGuidelineExecutionResults } from './DesignGuidelineExecutionResults';

/**
 * Request builder class for operations supported on the {@link DesignGuidelineExecutionResults} entity.
 */
export class DesignGuidelineExecutionResultsRequestBuilder<
  T extends DeSerializers = DefaultDeSerializers
> extends RequestBuilder<DesignGuidelineExecutionResults<T>, T> {
  /**
   * Returns a request builder for querying all `DesignGuidelineExecutionResults` entities.
   * @returns A request builder for creating requests to retrieve all `DesignGuidelineExecutionResults` entities.
   */
  getAll(): GetAllRequestBuilder<DesignGuidelineExecutionResults<T>, T> {
    return new GetAllRequestBuilder<DesignGuidelineExecutionResults<T>, T>(
      this.entityApi
    );
  }

  /**
   * Returns a request builder for creating a `DesignGuidelineExecutionResults` entity.
   * @param entity The entity to be created
   * @returns A request builder for creating requests that create an entity of type `DesignGuidelineExecutionResults`.
   */
  create(
    entity: DesignGuidelineExecutionResults<T>
  ): CreateRequestBuilder<DesignGuidelineExecutionResults<T>, T> {
    return new CreateRequestBuilder<DesignGuidelineExecutionResults<T>, T>(
      this.entityApi,
      entity
    );
  }

  /**
   * Returns a request builder for retrieving one `DesignGuidelineExecutionResults` entity based on its keys.
   * @param executionId Key property. See {@link DesignGuidelineExecutionResults.executionId}.
   * @returns A request builder for creating requests to retrieve one `DesignGuidelineExecutionResults` entity based on its keys.
   */
  getByKey(
    executionId: DeserializedType<T, 'Edm.String'>
  ): GetByKeyRequestBuilder<DesignGuidelineExecutionResults<T>, T> {
    return new GetByKeyRequestBuilder<DesignGuidelineExecutionResults<T>, T>(
      this.entityApi,
      { ExecutionId: executionId }
    );
  }

  /**
   * Returns a request builder for updating an entity of type `DesignGuidelineExecutionResults`.
   * @param entity The entity to be updated
   * @returns A request builder for creating requests that update an entity of type `DesignGuidelineExecutionResults`.
   */
  update(
    entity: DesignGuidelineExecutionResults<T>
  ): UpdateRequestBuilder<DesignGuidelineExecutionResults<T>, T> {
    return new UpdateRequestBuilder<DesignGuidelineExecutionResults<T>, T>(
      this.entityApi,
      entity
    );
  }

  /**
   * Returns a request builder for deleting an entity of type `DesignGuidelineExecutionResults`.
   * @param executionId Key property. See {@link DesignGuidelineExecutionResults.executionId}.
   * @returns A request builder for creating requests that delete an entity of type `DesignGuidelineExecutionResults`.
   */
  delete(
    executionId: string
  ): DeleteRequestBuilder<DesignGuidelineExecutionResults<T>, T>;
  /**
   * Returns a request builder for deleting an entity of type `DesignGuidelineExecutionResults`.
   * @param entity Pass the entity to be deleted.
   * @returns A request builder for creating requests that delete an entity of type `DesignGuidelineExecutionResults` by taking the entity as a parameter.
   */
  delete(
    entity: DesignGuidelineExecutionResults<T>
  ): DeleteRequestBuilder<DesignGuidelineExecutionResults<T>, T>;
  delete(
    executionIdOrEntity: any
  ): DeleteRequestBuilder<DesignGuidelineExecutionResults<T>, T> {
    return new DeleteRequestBuilder<DesignGuidelineExecutionResults<T>, T>(
      this.entityApi,
      executionIdOrEntity instanceof DesignGuidelineExecutionResults
        ? executionIdOrEntity
        : { ExecutionId: executionIdOrEntity! }
    );
  }
}
