package data_importer.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import data_importer.domain.servers.*;;

@RepositoryRestResource(collectionResourceRel = "fileserver", path = "fileserver")
public interface FileServerRepo extends CrudRepository<FileServer, Long> {

}
