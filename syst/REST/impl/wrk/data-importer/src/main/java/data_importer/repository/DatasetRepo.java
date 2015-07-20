package data_importer.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import data_importer.domain.datasets.*;

@RepositoryRestResource(collectionResourceRel = "dataset", path = "dataset")
public interface DatasetRepo extends CrudRepository<Dataset, Long> {

}
