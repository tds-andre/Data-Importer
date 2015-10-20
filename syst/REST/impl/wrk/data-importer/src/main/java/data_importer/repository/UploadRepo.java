package data_importer.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import data_importer.domain.datasets.Upload;

@RepositoryRestResource(collectionResourceRel = "upload", path = "upload")
public interface UploadRepo extends CrudRepository<Upload, Long> {

}
