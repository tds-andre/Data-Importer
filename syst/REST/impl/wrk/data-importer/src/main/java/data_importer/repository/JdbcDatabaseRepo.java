package data_importer.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import data_importer.domain.servers.JdbcDatabase;

@RepositoryRestResource(collectionResourceRel = "jdbcdatabase", path = "jdbcdatabase")
public interface JdbcDatabaseRepo extends CrudRepository<JdbcDatabase, Long>{

}
