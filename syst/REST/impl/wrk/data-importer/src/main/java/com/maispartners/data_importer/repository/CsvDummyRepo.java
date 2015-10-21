package com.maispartners.data_importer.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.maispartners.data_importer.domain.datasets.CsvDummy;

@RepositoryRestResource(collectionResourceRel = "csv", path = "csv")
public interface CsvDummyRepo extends CrudRepository<CsvDummy, Long> {

}
