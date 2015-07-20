package data_importer.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import data_importer.domain.servers.*;;

@RepositoryRestResource(collectionResourceRel = "solrserver", path = "solrserver")
public interface SolrServerRepo extends CrudRepository<SolrServer, Long> {

}
