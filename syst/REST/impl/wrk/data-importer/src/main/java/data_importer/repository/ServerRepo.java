package data_importer.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import data_importer.domain.servers.*;;

@RepositoryRestResource(collectionResourceRel = "server", path = "server")
public interface ServerRepo extends CrudRepository<Server, Long> {

}
