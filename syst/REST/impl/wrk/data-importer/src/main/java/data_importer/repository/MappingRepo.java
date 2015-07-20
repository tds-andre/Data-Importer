package data_importer.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import data_importer.domain.fields.*;

@RepositoryRestResource(collectionResourceRel = "mapping", path = "mapping")
public interface MappingRepo extends CrudRepository<Mapping, Long> {

}
