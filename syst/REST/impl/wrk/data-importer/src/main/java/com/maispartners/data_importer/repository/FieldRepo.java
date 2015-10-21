package com.maispartners.data_importer.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.maispartners.data_importer.domain.datasets.Field;

@RepositoryRestResource(collectionResourceRel = "field", path = "field")
public interface FieldRepo extends CrudRepository<Field, Long> {

}
