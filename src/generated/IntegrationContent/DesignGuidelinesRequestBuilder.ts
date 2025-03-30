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
import { DesignGuidelines } from './DesignGuidelines';

/**
 * Request builder class for operations supported on the {@link DesignGuidelines} entity.
 */
export class DesignGuidelinesRequestBuilder<
  T extends DeSerializers = DefaultDeSerializers
> extends RequestBuilder<DesignGuidelines<T>, T> {
  /**
   * Returns a request builder for querying all `DesignGuidelines` entities.
   * @returns A request builder for creating requests to retrieve all `DesignGuidelines` entities.
   */
  getAll(): GetAllRequestBuilder<DesignGuidelines<T>, T> {
    return new GetAllRequestBuilder<DesignGuidelines<T>, T>(this.entityApi);
  }

  /**
   * Returns a request builder for creating a `DesignGuidelines` entity.
   * @param entity The entity to be created
   * @returns A request builder for creating requests that create an entity of type `DesignGuidelines`.
   */
  create(
    entity: DesignGuidelines<T>
  ): CreateRequestBuilder<DesignGuidelines<T>, T> {
    return new CreateRequestBuilder<DesignGuidelines<T>, T>(
      this.entityApi,
      entity
    );
  }

  /**
   * Returns a request builder for retrieving one `DesignGuidelines` entity based on its keys.
   * @param guidelineId Key property. See {@link DesignGuidelines.guidelineId}.
   * @returns A request builder for creating requests to retrieve one `DesignGuidelines` entity based on its keys.
   */
  getByKey(
    guidelineId: DeserializedType<T, 'Edm.String'>
  ): GetByKeyRequestBuilder<DesignGuidelines<T>, T> {
    return new GetByKeyRequestBuilder<DesignGuidelines<T>, T>(this.entityApi, {
      GuidelineId: guidelineId
    });
  }

  /**
   * Returns a request builder for updating an entity of type `DesignGuidelines`.
   * @param entity The entity to be updated
   * @returns A request builder for creating requests that update an entity of type `DesignGuidelines`.
   */
  update(
    entity: DesignGuidelines<T>
  ): UpdateRequestBuilder<DesignGuidelines<T>, T> {
    return new UpdateRequestBuilder<DesignGuidelines<T>, T>(
      this.entityApi,
      entity
    );
  }

  /**
   * Returns a request builder for deleting an entity of type `DesignGuidelines`.
   * @param guidelineId Key property. See {@link DesignGuidelines.guidelineId}.
   * @returns A request builder for creating requests that delete an entity of type `DesignGuidelines`.
   */
  delete(guidelineId: string): DeleteRequestBuilder<DesignGuidelines<T>, T>;
  /**
   * Returns a request builder for deleting an entity of type `DesignGuidelines`.
   * @param entity Pass the entity to be deleted.
   * @returns A request builder for creating requests that delete an entity of type `DesignGuidelines` by taking the entity as a parameter.
   */
  delete(
    entity: DesignGuidelines<T>
  ): DeleteRequestBuilder<DesignGuidelines<T>, T>;
  delete(
    guidelineIdOrEntity: any
  ): DeleteRequestBuilder<DesignGuidelines<T>, T> {
    return new DeleteRequestBuilder<DesignGuidelines<T>, T>(
      this.entityApi,
      guidelineIdOrEntity instanceof DesignGuidelines
        ? guidelineIdOrEntity
        : { GuidelineId: guidelineIdOrEntity! }
    );
  }
}
