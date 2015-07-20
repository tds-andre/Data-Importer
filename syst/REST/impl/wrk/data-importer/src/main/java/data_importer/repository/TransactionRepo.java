package data_importer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import data_importer.domain.transactions.Transaction;

@RepositoryRestResource(collectionResourceRel = "transaction", path = "transaction")
public interface TransactionRepo extends CrudRepository<Transaction, Long> {
	@Query(nativeQuery=true, value="SELECT *, max(created_at) FROM data_importer.transaction a left join data_importer.version b on a.id = b.id group by scd")
	public List<Transaction> latest();
}