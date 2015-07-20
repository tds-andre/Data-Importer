package data_importer.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import data_importer.domain.servers.LocalServer;

@RepositoryRestResource(collectionResourceRel = "localserver", path = "localserver")
public interface LocalServerRepo extends CrudRepository<LocalServer, Long>{

}
