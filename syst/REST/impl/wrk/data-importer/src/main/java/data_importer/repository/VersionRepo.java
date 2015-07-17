package data_importer.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import data_importer.domain.Version;
import data_importer.domain.transactions.Transaction;

@RepositoryRestResource(collectionResourceRel = "version", path = "version")
public interface VersionRepo extends CrudRepository<Version, Long> {

}