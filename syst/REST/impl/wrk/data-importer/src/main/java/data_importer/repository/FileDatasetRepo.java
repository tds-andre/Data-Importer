package data_importer.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import data_importer.domain.datasets.*;

@RepositoryRestResource(collectionResourceRel = "file", path = "file")
public interface FileDatasetRepo extends CrudRepository<FileDataset, Long> {

}
