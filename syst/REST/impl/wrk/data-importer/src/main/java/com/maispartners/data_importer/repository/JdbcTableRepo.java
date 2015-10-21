package com.maispartners.data_importer.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.maispartners.data_importer.domain.datasets.JdbcTable;

@RepositoryRestResource(collectionResourceRel = "jdbctable", path = "jdbctable")
public interface JdbcTableRepo extends CrudRepository<JdbcTable, Long>{

}
