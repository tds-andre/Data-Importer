package data_importer.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import data_importer.domain.SCD;
import data_importer.domain.transactions.Transaction;

@RepositoryRestResource(collectionResourceRel = "scd", path = "scd")
public interface SCDRepo extends CrudRepository<SCD, Long> {

}