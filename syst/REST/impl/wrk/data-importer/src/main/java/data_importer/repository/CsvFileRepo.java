package data_importer.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import data_importer.domain.datasets.CsvFile;;

@RepositoryRestResource(collectionResourceRel = "csvfile", path = "csvfile")
public interface CsvFileRepo extends CrudRepository<CsvFile, Long> {

}
